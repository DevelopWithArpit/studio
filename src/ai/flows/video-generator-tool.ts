
'use server';

/**
 * @fileOverview A tool to generate video from a text prompt.
 *
 * - generateVideo - A function that generates a video from a text prompt.
 * - GenerateVideoInput - The input type for the generateVideo function.
 * - GenerateVideoOutput - The return type for the generateVideo function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { googleAI } from '@genkit-ai/googleai';
import * as fs from 'fs';
import { Readable } from 'stream';
import { MediaPart } from 'genkit';

const GenerateVideoInputSchema = z.object({
  prompt: z.string().describe('The text prompt to generate the video from.'),
  durationSeconds: z.number().int().min(1).max(10).default(5).describe('The duration of the video in seconds.'),
});
export type GenerateVideoInput = z.infer<typeof GenerateVideoInputSchema>;

const GenerateVideoOutputSchema = z.object({
  videoUrl: z.string().describe('The data URI of the generated video.'),
});
export type GenerateVideoOutput = z.infer<typeof GenerateVideoOutputSchema>;

export async function generateVideo(input: GenerateVideoInput): Promise<GenerateVideoOutput> {
  return generateVideoFlow(input);
}

async function downloadVideo(video: MediaPart): Promise<Buffer> {
    const fetch = (await import('node-fetch')).default;
    // Add API key before fetching the video.
    const videoDownloadResponse = await fetch(
      `${video.media!.url}&key=${process.env.GEMINI_API_KEY}`
    );
    if (
      !videoDownloadResponse ||
      videoDownloadResponse.status !== 200 ||
      !videoDownloadResponse.body
    ) {
      throw new Error('Failed to fetch video');
    }
  
    const chunks: Buffer[] = [];
    for await (const chunk of videoDownloadResponse.body) {
        chunks.push(chunk as Buffer);
    }
    return Buffer.concat(chunks);
}

const generateVideoFlow = ai.defineFlow(
  {
    name: 'generateVideoFlow',
    inputSchema: GenerateVideoInputSchema,
    outputSchema: GenerateVideoOutputSchema,
  },
  async ({ prompt, durationSeconds }) => {
    let { operation } = await ai.generate({
        model: googleAI.model('veo-2.0-generate-001'),
        prompt: prompt,
        config: {
          durationSeconds: durationSeconds,
          aspectRatio: '16:9',
        },
      });
  
      if (!operation) {
        throw new Error('Expected the model to return an operation');
      }
  
      // Wait until the operation completes.
      while (!operation.done) {
        operation = await ai.checkOperation(operation);
        // Sleep for 5 seconds before checking again.
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
  
      if (operation.error) {
        throw new Error('failed to generate video: ' + operation.error.message);
      }
  
      const video = operation.output?.message?.content.find((p) => !!p.media);
      if (!video) {
        throw new Error('Failed to find the generated video');
      }

      const videoData = await downloadVideo(video);
      const videoDataUri = `data:video/mp4;base64,${videoData.toString('base64')}`;

      return { videoUrl: videoDataUri };
  }
);
