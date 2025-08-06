
'use server';

/**
 * @fileOverview Generates a presentation outline with titles, content, and images.
 *
 * - generatePresentation - A function that creates a complete presentation.
 * - GeneratePresentationInput - The input type for the function.
 * - GeneratePresentationOutput - The return type for a single slide's image.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { googleAI } from '@genkit-ai/googleai';

const GeneratePresentationInputSchema = z.object({
  topic: z.string().describe('The topic or title of the presentation.'),
  numSlides: z.number().int().min(2).max(20).describe('The number of slides to generate (for general topics).'),
  contentType: z.enum(['general', 'projectProposal', 'custom']).default('general').describe('The type of content to generate.'),
  customStructure: z.string().optional().describe("A user-defined structure for the presentation, as a string of slide titles."),
  imageStyle: z.string().optional().describe("An optional style for the images (e.g., 'photorealistic', 'cartoon')."),
});
export type GeneratePresentationInput = z.infer<typeof GeneratePresentationInputSchema>;

const SlideSchema = z.object({
  title: z.string().describe('The title of the slide.'),
  content: z.array(z.string()).describe('An array of short bullet points for the slide content.'),
  imagePrompt: z.string().describe('A text prompt to generate a relevant image for this slide.'),
  imageUrl: z.string().optional().describe('The data URI of the generated image for the slide.'),
});

const DesignSchema = z.object({
  backgroundColor: z.string().describe('A hex color code for the slide background (e.g., "#0B192E").'),
  textColor: z.string().describe('A hex color code for the main text (e.g., "#E6F1FF").'),
  accentColor: z.string().describe('A hex color code for titles and accents (e.g., "#64FFDA").'),
  backgroundPrompt: z.string().describe("A prompt for an AI image generator to create a subtle, professional background image related to the presentation topic. It should be abstract and not distracting."),
});

const PresentationOutlineSchema = z.object({
  title: z.string().describe('The main title of the presentation.'),
  slides: z.array(SlideSchema).describe('An array of slide objects.'),
  design: DesignSchema.describe('A design theme for the presentation, inspired by the topic.'),
  backgroundImageUrl: z.string().optional().describe('The data URI of the generated background image for the presentation.'),
});
export type GeneratePresentationOutput = z.infer<typeof PresentationOutlineSchema>;

export async function generatePresentation(input: GeneratePresentationInput): Promise<GeneratePresentationOutput> {
  return generatePresentationFlow(input);
}

const outlinePrompt = ai.definePrompt({
    name: 'generatePresentationOutlinePrompt',
    input: { schema: GeneratePresentationInputSchema },
    output: { schema: PresentationOutlineSchema },
    prompt: `You are an expert presentation creator and designer with the ability to write like a professional human. Your task is to generate a compelling and detailed presentation outline based on the user's request.

**Design Generation:**
- Based on the presentation topic, you MUST create a cohesive design theme.
- Provide a hex color code for the 'backgroundColor', a contrasting 'textColor', and a vibrant 'accentColor' for titles.
- You MUST also provide a 'backgroundPrompt'. This should be a prompt for an AI image generator to create a subtle, abstract, and professional background image that is visually related to the topic but not distracting.

**Content Generation:**
- **Tone and Style**: The content must be professional but also sound natural and human-written. Avoid jargon and robotic phrasing. Write in an engaging, clear, and authoritative tone.
- For each slide, you MUST provide:
  1. A short, engaging title.
  2. A set of 2-3 CONCISE bullet points. Each bullet point should be a short phrase or sentence that flows well.
  3. A descriptive prompt for an AI image generator that is a direct visual representation of the bullet points.

**Structure Generation Instructions:**
- If the user provides a "Custom Structure," you MUST use those slide titles in the exact order given. For each title, generate detailed bullet points and a relevant image prompt.
- If the content type is "Project Proposal," generate a presentation with exactly 8 slides using this structure: 1. Introduction, 2. Objectives, 3. Problem Statement / Need Analysis, 4. Target Group / Area, 5. Proposed Activities, 6. Methodology, 7. Expected Outcomes, 8. Conclusion.
- If the content type is "General," generate a presentation with a logical flow of exactly {{{numSlides}}} slides, including a title slide and a conclusion slide.

**User Input Details:**
- Topic: {{{topic}}}
- Content Type: {{{contentType}}}
- Number of Slides (for General type): {{{numSlides}}}
- Custom Structure (if provided): {{{customStructure}}}
`,
});


const generatePresentationFlow = ai.defineFlow(
  {
    name: 'generatePresentationFlow',
    inputSchema: GeneratePresentationInputSchema,
    outputSchema: PresentationOutlineSchema,
  },
  async (input) => {
    // 1. Generate the text outline and design first.
    const { output: outline } = await outlinePrompt(input);
    if (!outline) {
      throw new Error('Failed to generate presentation outline.');
    }

    // 2. Generate background and slide images in parallel
    const imageGenerationPromises = [
        // Background Image
        ai.generate({
            model: 'googleai/gemini-2.0-flash-preview-image-generation',
            prompt: outline.design.backgroundPrompt,
            config: { responseModalities: ['TEXT', 'IMAGE'] },
        }).then(result => ({ type: 'background', url: result.media?.url })),

        // Slide Images
        ...outline.slides.map((slide, index) => {
            let fullImagePrompt = slide.imagePrompt;
            if (input.imageStyle) {
                fullImagePrompt += `, in a ${input.imageStyle} style`;
            }
            return ai.generate({
                model: 'googleai/gemini-2.0-flash-preview-image-generation',
                prompt: fullImagePrompt,
                config: { responseModalities: ['TEXT', 'IMAGE'] },
            }).then(result => ({ type: 'slide', index, url: result.media?.url }));
        })
    ];
    
    const results = await Promise.allSettled(imageGenerationPromises);

    results.forEach(result => {
        if (result.status === 'fulfilled' && result.value) {
            const { type, url } = result.value;
            if (type === 'background') {
                outline.backgroundImageUrl = url;
            } else if (type === 'slide' && result.value.index !== undefined) {
                outline.slides[result.value.index].imageUrl = url;
            }
        } else if (result.status === 'rejected') {
            console.error('An image generation request failed:', result.reason);
        }
    });

    return outline;
  }
);
