'use server';

/**
 * @fileOverview Generates a presentation outline with images for each slide.
 *
 * - generatePresentation - A function that creates a presentation outline.
 * - GeneratePresentationInput - The input type for the function.
 * - GeneratePresentationOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GeneratePresentationInputSchema = z.object({
  topic: z.string().describe('The topic of the presentation.'),
  numSlides: z.number().int().min(2).max(10).describe('The number of slides to generate.'),
  imageStyle: z.string().optional().describe('An optional style for the images (e.g., "photorealistic", "cartoon", "minimalist").'),
});
export type GeneratePresentationInput = z.infer<typeof GeneratePresentationInputSchema>;

const SlideSchema = z.object({
  title: z.string().describe('The title of the slide.'),
  content: z.array(z.string()).describe('An array of bullet points for the slide content.'),
  imagePrompt: z.string().describe('A text prompt to generate a relevant image for this slide.'),
  imageUrl: z.string().optional().describe('The data URI of the generated image for the slide.'),
});

const PresentationOutlineSchema = z.object({
  title: z.string().describe('The main title of the presentation.'),
  slides: z.array(SlideSchema).describe('An array of slide objects.'),
});
export type GeneratePresentationOutput = z.infer<typeof PresentationOutlineSchema>;

export async function generatePresentation(input: GeneratePresentationInput): Promise<GeneratePresentationOutput> {
  return generatePresentationFlow(input);
}

const outlinePrompt = ai.definePrompt({
    name: 'generatePresentationOutlinePrompt',
    input: { schema: GeneratePresentationInputSchema },
    output: { schema: PresentationOutlineSchema },
    prompt: `You are an expert presentation creator. Generate a compelling presentation outline for the topic: "{{{topic}}}".

The presentation must have exactly {{{numSlides}}} slides, including a title slide and a conclusion slide.

For each slide, provide:
1.  A short, engaging title.
2.  3-5 concise bullet points for the content.
3.  A descriptive prompt for an AI image generator to create a relevant visual. The image prompt should be detailed. If the user specified an image style, incorporate it into the prompt (e.g., "A photorealistic image of...").

The overall presentation should have a logical flow.`,
});


const generatePresentationFlow = ai.defineFlow(
  {
    name: 'generatePresentationFlow',
    inputSchema: GeneratePresentationInputSchema,
    outputSchema: PresentationOutlineSchema,
  },
  async (input) => {
    // 1. Generate the text outline first
    const { output: outline } = await outlinePrompt(input);
    if (!outline) {
      throw new Error('Failed to generate presentation outline.');
    }

    // 2. Generate an image for each slide in parallel
    const imagePromises = outline.slides.map(async (slide) => {
        let fullImagePrompt = slide.imagePrompt;
        if (input.imageStyle) {
            fullImagePrompt = `${slide.imagePrompt}, in a ${input.imageStyle} style.`
        }

        const { media } = await ai.generate({
            model: 'googleai/gemini-2.0-flash-preview-image-generation',
            prompt: fullImagePrompt,
            config: {
                responseModalities: ['TEXT', 'IMAGE'],
            },
        });
        return media?.url || ''; // Return empty string if generation fails
    });

    const imageUrls = await Promise.all(imagePromises);

    // 3. Combine the outline with the generated image URLs
    const finalPresentation = {
      ...outline,
      slides: outline.slides.map((slide, index) => ({
        ...slide,
        imageUrl: imageUrls[index],
      })),
    };

    return finalPresentation;
  }
);
