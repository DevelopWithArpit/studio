
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
  content: z.array(z.string()).describe('An array of exactly 4 short bullet points for the slide content. Each bullet point must have around 8 words.'),
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
    prompt: `You are an expert presentation creator and visual designer. Your task is to generate a stunning and detailed presentation outline based on the user's request, following modern presentation best practices. Your output must be exceptionally professional.

**Core Principles (Non-negotiable):**
- **Visuals > Text**: Your primary goal is to create a powerful, memorable visual for each slide. The text is secondary and only supports the visual. For every slide, you must first conceive the visual and then write a short title and content to complement it.
- **One Idea per Slide**: Each slide must focus on a single, core idea. If a point is complex, it MUST be broken down into multiple slides.
- **Strict Content Rules**: Each content slide must have exactly 4 bullet points. Each bullet point MUST have around 8 words.

**Design Generation:**
- Based on the presentation topic, create a cohesive and professional design theme that is visually representative of the subject.
- You MUST derive and provide hex color codes for 'backgroundColor', 'textColor', and 'accentColor' that are visually harmonious and reflect the topic's mood.
- You MUST also provide a 'backgroundPrompt'. This prompt should describe a stunning, high-quality, professional background image (e.g., abstract, subtle, cinematic) that is visually related to the topic but does not distract from the content.

**Content Generation:**
- **Tone and Style**: The content must be professional and authoritative, yet sound natural and human-written. It should be engaging, clear, and concise. Avoid jargon.
- For each slide, you MUST provide:
  1. A short, impactful title.
  2. A set of exactly 4 extremely CONCISE bullet points, strictly adhering to the content rules (around 8 words per point).
  3. A descriptive prompt for an AI image generator. This prompt must describe a **stunning, high-quality, and cinematic visual** that powerfully represents the slide's core idea. **Crucially, the generated image should NOT contain any text or words to avoid spelling errors.**

**Structure Generation Instructions:**
- **The very first slide must always be an introduction slide.** Its title should be "Introduction" and it should introduce the main topic and include the phrase "Presented by: [Username]".
- If the user provides a "Custom Structure," you MUST use those slide titles in the exact order given for the subsequent slides.
- If the content type is "Project Proposal," generate the subsequent presentation slides using this structure: 1. Introduction, 2. Objectives, 3. Problem Statement / Need Analysis, 4. Target Group / Area, 5. Proposed Activities, 6. Methodology, 7. Expected Outcomes, 8. Conclusion.
- If the content type is "General," generate a logical presentation of exactly {{{numSlides}}} slides, which must include a conclusion slide at the end. The introduction slide is extra.

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
            } else if (type === 'slide' && result.value.index !== undefined && url) {
                outline.slides[result.value.index].imageUrl = url;
            }
        } else if (result.status === 'rejected') {
            console.error('An image generation request failed:', result.reason);
        }
    });

    return outline;
  }
);
