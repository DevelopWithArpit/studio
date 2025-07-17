'use server';
/**
 * @fileOverview Image Toolkit AI agent. Allows users to upload images or input text and use the Image Toolkit to create custom visuals with watermarks and other image manipulations.
 *
 * - imageToolkit - A function that handles the image toolkit process.
 * - ImageToolkitInput - The input type for the imageToolkit function.
 * - ImageToolkitOutput - The return type for the imageToolkit function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImageToolkitInputSchema = z.object({
  imageOrText: z.string().describe('The image as a data URI (data:<mimetype>;base64,<encoded_data>) or text to be used as a base for image generation.'),
  watermarkText: z.string().optional().describe('Optional text to add as a watermark to the image.'),
  manipulationInstructions: z.string().describe('Instructions for image manipulation, such as adding effects, changing colors, or other modifications.'),
});
export type ImageToolkitInput = z.infer<typeof ImageToolkitInputSchema>;

const ImageToolkitOutputSchema = z.object({
  finalImage: z.string().describe('The resulting image as a data URI (data:<mimetype>;base64,<encoded_data>).'),
  report: z.string().describe('Report of the modifications done.'),
});
export type ImageToolkitOutput = z.infer<typeof ImageToolkitOutputSchema>;

export async function imageToolkit(input: ImageToolkitInput): Promise<ImageToolkitOutput> {
  return imageToolkitFlow(input);
}

const imageToolkitPrompt = ai.definePrompt({
  name: 'imageToolkitPrompt',
  input: {schema: ImageToolkitInputSchema},
  output: {schema: ImageToolkitOutputSchema},
  prompt: `You are an image processing expert. You are given an image or text, watermark text, and manipulation instructions.

  Your task is to generate a final image based on these inputs and create a report of the modifications done.

  Base Image/Text: {{imageOrText}}
  Watermark Text: {{watermarkText}}
  Manipulation Instructions: {{manipulationInstructions}}

  Generate a final image incorporating the watermark and manipulations, and provide a detailed report.
  Ensure the final image is a valid data URI.

  If the input is text, generate an initial image from the text before applying watermark and manipulations.

  The output should be a JSON object conforming to ImageToolkitOutputSchema.
  `,
});

const imageToolkitFlow = ai.defineFlow(
  {
    name: 'imageToolkitFlow',
    inputSchema: ImageToolkitInputSchema,
    outputSchema: ImageToolkitOutputSchema,
  },
  async input => {
    let baseImage = input.imageOrText;

    // If the input is text, generate an initial image from the text
    if (!baseImage.startsWith('data:image')) {
      const {media} = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: baseImage,
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      });
      if (media?.url) {
        baseImage = media.url;
      } else {
        throw new Error('Failed to generate image from text input.');
      }
    }

    // Apply watermark and manipulations using the prompt
    const {output} = await imageToolkitPrompt({
      ...input,
      imageOrText: baseImage, // Use the potentially generated image
    });
    return output!;
  }
);
