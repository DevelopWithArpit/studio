
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
    input: { schema: GeneratePresentationInputSchema },
    output: { schema: PresentationOutlineSchema },
    prompt: `You are an expert presentation creator. Your task is to generate a compelling presentation outline based on the user's request.

For each slide, you must provide:
1.  A short, engaging title.
2.  A set of concise bullet points for the content.
3.  A descriptive prompt for an AI image generator to create a relevant visual for the slide. The image prompt should be detailed and creative. If the user specified an image style, incorporate it into every image prompt.

**Presentation Topic/Title:** "{{{topic}}}"

{{#if customStructure}}
**Instructions for Custom Structure:**
The user has provided a custom structure. You **must** use these slide titles in the exact order they are given. For each title, generate relevant bullet points and a creative image prompt.
**Custom Structure:**
{{{customStructure}}}
{{else}}
  {{#if (eq contentType "projectProposal")}}
**Instructions for Project Proposal:**
Generate a presentation with exactly 8 slides using the following structure. The user's topic is the project title.
1.  **Introduction:** What is the project about? Relevance to society/community.
2.  **Objectives:** 2–3 main goals of the project.
3.  **Problem Statement / Need Analysis:** Issue identified in the community/field; Why this issue is important.
4.  **Target Group / Area:** Who will benefit? Where will the project be conducted?
5.  **Proposed Activities:** Planned actions (survey, awareness program, teaching, cleanliness drive, etc.); Tools or resources needed.
6.  **Methodology:** How the project will be implemented; Steps or timeline.
7.  **Expected Outcomes:** What you aim to achieve; Impact on community.
8.  **Conclusion:** Summary of your plan; Commitment to execute.
  {{else}}
**Instructions for General Topic:**
Generate a presentation with a logical flow. The presentation must have exactly {{{numSlides}}} slides, including a title slide and a conclusion slide.
  {{/if}}
{{/if}}
`,
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
