
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
  topic: z.string().describe('The topic or title of the presentation.'),
  numSlides: z.number().int().min(2).max(20).describe('The number of slides to generate (for general topics).'),
  imageStyle: z.string().optional().describe('An optional style for the images (e.g., "photorealistic", "cartoon", "minimalist").'),
  contentType: z.enum(['general', 'projectProposal', 'custom']).default('general').describe('The type of content to generate.'),
  customStructure: z.string().optional().describe("A user-defined structure for the presentation, as a string of slide titles."),
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
    input: { schema: z.any() },
    output: { schema: PresentationOutlineSchema },
    prompt: `You are an expert presentation creator. Your task is to generate a compelling and detailed presentation outline based on the user's request.

For each slide, you must provide:
1.  A short, engaging title.
2.  A set of **detailed and comprehensive** bullet points for the content. The content must be thorough and informative.
3.  A descriptive prompt for an AI image generator. This is the most critical step. The image prompt **MUST BE a direct visual representation of the bullet points you just wrote for the slide**, creating a highly relevant visual. The image prompt should be detailed and creative, aiming for a cinematic and visually stunning result, and it must not include any text, letters, or numbers. If the user specified an image style, incorporate it into every image prompt.

**Presentation Topic/Title:** "{{{topic}}}"

**Content Generation Instructions:**
- If the user provides a "Custom Structure," you **must** use those slide titles in the exact order given. For each title, generate detailed bullet points and a creative, relevant image prompt.
- If the content type is "Project Proposal," generate a presentation with exactly 8 slides using this structure: 1. Introduction, 2. Objectives, 3. Problem Statement / Need Analysis, 4. Target Group / Area, 5. Proposed Activities, 6. Methodology, 7. Expected Outcomes, 8. Conclusion.
- If the content type is "General," generate a presentation with a logical flow of exactly {{{numSlides}}} slides, including a title slide and a conclusion slide.

**User Input Details:**
- Topic: {{{topic}}}
- Content Type: {{{contentType}}}
- Number of Slides (for General type): {{{numSlides}}}
- Custom Structure (if provided):
{{{customStructure}}}
`,
});


const generatePresentationFlow = ai.defineFlow(
  {
    name: 'generatePresentationFlow',
    inputSchema: GeneratePresentationInputSchema,
    outputSchema: PresentationOutlineSchema,
  },
  async (input) => {
    // 1. Generate the text outline first.
    const { output: outline } = await outlinePrompt(input);
    if (!outline) {
      throw new Error('Failed to generate presentation outline.');
    }

    // 2. Sequentially generate an image for each slide.
    for (const slide of outline.slides) {
        try {
            let fullImagePrompt = slide.imagePrompt;
            if (input.imageStyle) {
                fullImagePrompt += `, in a ${input.imageStyle} style`;
            }

            const { media } = await ai.generate({
                model: 'googleai/gemini-2.0-flash-preview-image-generation',
                prompt: fullImagePrompt,
                config: {
                    responseModalities: ['TEXT', 'IMAGE'],
                },
            });
            slide.imageUrl = media?.url || '';
        } catch (error) {
            console.error(`Failed to generate image for slide: "${slide.title}". Reason: ${error instanceof Error ? error.message : 'Unknown error'}`);
            slide.imageUrl = ''; // Mark as failed
        }
    }
    
    return outline;
  }
);
