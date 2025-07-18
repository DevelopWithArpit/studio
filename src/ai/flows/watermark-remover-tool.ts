'use server';

/**
 * @fileOverview Attempts to remove a watermark from an image.
 *
 * - removeWatermark - A function that processes an image to remove a watermark.
 * - RemoveWatermarkInput - The input type for the function.
 * - RemoveWatermarkOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const RemoveWatermarkInputSchema = z.object({
  imageDataUri: z.string().describe("An image with a watermark, as a data URI. Format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type RemoveWatermarkInput = z.infer<typeof RemoveWatermarkInputSchema>;

const RemoveWatermarkOutputSchema = z.object({
  processedImageUrl: z.string().describe('The data URI of the image after attempting to remove the watermark.'),
});
export type RemoveWatermarkOutput = z.infer<typeof RemoveWatermarkOutputSchema>;

export async function removeWatermark(input: RemoveWatermarkInput): Promise<RemoveWatermarkOutput> {
  return removeWatermarkFlow(input);
}

const removeWatermarkFlow = ai.defineFlow(
  {
    name: 'removeWatermarkFlow',
    inputSchema: RemoveWatermarkInputSchema,
    outputSchema: RemoveWatermarkOutputSchema,
  },
  async ({ imageDataUri }) => {
    const prompt = [
        { media: { url: imageDataUri } },
        { text: 'Analyze the provided image and intelligently remove the watermark. Reconstruct the area behind the watermark as accurately as possible to make it look like the watermark was never there.' },
    ];
    
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: prompt,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media?.url) {
      throw new Error('Failed to process the image.');
    }

    return { processedImageUrl: media.url };
  }
);
