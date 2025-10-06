
'use server';

/**
 * @fileOverview A tool to generate video from a text prompt.
 *
 * - generateVideo - Kicks off the video generation process.
 * - checkVideoStatus - Checks the status of an ongoing video generation operation.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { googleAI } from '@genkit-ai/googleai';
import { MediaPart } from 'genkit';

const GenerateVideoInputSchema = z.object({
  prompt: z.string().describe('The text prompt to generate the video from.'),
  durationSeconds: z.number().int().min(1).max(10).default(5).describe('The duration of the video in seconds.'),
});
export type GenerateVideoInput = z.infer<typeof GenerateVideoInputSchema>;

const GenerateVideoOutputSchema = z.object({
  operationName: z.string().describe('The name of the long-running operation.'),
});
export type GenerateVideoOutput = z.infer<typeof GenerateVideoOutputSchema>;

const CheckVideoStatusInputSchema = z.object({
    operationName: z.string(),
});

const CheckVideoStatusOutputSchema = z.object({
    done: z.boolean(),
    videoUrl: z.string().optional(),
    error: z.string().optional(),
});
export type CheckVideoStatusOutput = z.infer<typeof CheckVideoStatusOutputSchema>;


async function downloadVideo(video: MediaPart): Promise<Buffer> {
    const fetch = (await import('node-fetch')).default;
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

export async function generateVideo(input: GenerateVideoInput): Promise<GenerateVideoOutput> {
  return generateVideoFlow(input);
}

export async function checkVideoStatus(input: {operationName: string}): Promise<CheckVideoStatusOutput> {
    return checkVideoStatusFlow(input);
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
      
      return { operationName: operation.name };
  }
);


const checkVideoStatusFlow = ai.defineFlow({
    name: 'checkVideoStatusFlow',
    inputSchema: CheckVideoStatusInputSchema,
    outputSchema: CheckVideoStatusOutputSchema,
}, async ({ operationName }) => {
    let operation = await ai.checkOperation({ name: operationName });
    
    if (!operation.done) {
        return { done: false };
    }

    if (operation.error) {
        return { done: true, error: operation.error.message };
    }

    const video = operation.output?.message?.content.find((p) => !!p.media);
    if (!video) {
        return { done: true, error: 'Failed to find the generated video in the operation result.' };
    }

    const videoData = await downloadVideo(video);
    const videoDataUri = `data:video/mp4;base64,${videoData.toString('base64')}`;

    return { done: true, videoUrl: videoDataUri };
});
