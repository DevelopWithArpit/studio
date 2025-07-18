'use server';

/**
 * @fileOverview Edits text directly within an image based on instructions.
 *
 * - manipulateImageText - A function that performs text manipulation on an image.
 * - ManipulateImageTextInput - The input type for the function.
 * - ManipulateImageTextOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ManipulateImageTextInputSchema = z.object({
  imageDataUri: z.string().describe("An image containing text, as a data URI. Format: 'data:<mimetype>;base64,<encoded_data>'."),
  instructions: z.string().describe('Detailed instructions on how to manipulate the text in the image (e.g., "Change the headline to \'New Title\'").'),
});
export type ManipulateImageTextInput = z.infer<typeof ManipulateImageTextInputSchema>;

const ManipulateImageTextOutputSchema = z.object({
  processedImageUrl: z.string().describe('The data URI of the image after text manipulation.'),
});
export type ManipulateImageTextOutput = z.infer<typeof ManipulateImageTextOutputSchema>;

export async function manipulateImageText(input: ManipulateImageTextInput): Promise<ManipulateImageTextOutput> {
  return manipulateImageTextFlow(input);
}

const manipulateImageTextFlow = ai.defineFlow(
  {
    name: 'manipulateImageTextFlow',
    inputSchema: ManipulateImageTextInputSchema,
    outputSchema: ManipulateImageTextOutputSchema,
  },
  async ({ imageDataUri, instructions }) => {
    const prompt = [
        { media: { url: imageDataUri } },
        { text: `You are an expert image editor. Your task is to manipulate the text within the provided image based on the following instructions, while seamlessly blending the changes with the original image style, font, and background. Instructions: "${instructions}"` },
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
