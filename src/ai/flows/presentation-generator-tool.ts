
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { googleAI } from '@genkit-ai/googleai';


const GeneratePresentationInputSchema = z.object({
  topic: z.string(),
  presenterName: z.string().optional(),
  rollNumber: z.string().optional(),
  department: z.string().optional(),
  numSlides: z.coerce.number().int().min(2).max(20),
  contentType: z.enum(['general', 'projectProposal', 'pitchDeck', 'custom']),
  customStructure: z.string().optional(),
  imageStyle: z.string().optional(),
  language: z.string().optional(),
  style: z.enum(['Default', 'Tech Pitch', 'Creative']),
});

export type GeneratePresentationInput = z.infer<typeof GeneratePresentationInputSchema>;

const SlideSchema = z.object({
  title: z.string().describe('The title of the slide.'),
  content: z.array(z.string()).describe('An array of short bullet points for the slide content.'),
  imagePrompt: z.string().describe('A text prompt to generate a relevant image for this slide.'),
  imageUrl: z.string().optional(),
});

const PresentationOutlineSchema = z.object({
  title: z.string().describe('The main title of the presentation.'),
  slides: z.array(SlideSchema).describe('An array of slide objects.'),
});
export type GeneratePresentationOutput = z.infer<typeof PresentationOutlineSchema>;

const GenerateSingleImageInputSchema = z.object({
    imagePrompt: z.string(),
    imageStyle: z.string(),
});
export type GenerateSingleImageInput = z.infer<typeof GenerateSingleImageInputSchema>;

const GenerateSingleImageOutputSchema = z.object({
    imageUrl: z.string(),
});
export type GenerateSingleImageOutput = z.infer<typeof GenerateSingleImageOutputSchema>;

export async function generatePresentation(input: z.infer<typeof GeneratePresentationInputSchema>): Promise<GeneratePresentationOutput> {
  return generatePresentationFlow(input);
}

export async function generateSingleImage(input: GenerateSingleImageInput): Promise<GenerateSingleImageOutput> {
    return generateSingleImageFlow(input);
}

const outlinePrompt = ai.definePrompt({
    name: 'generatePresentationOutlinePrompt',
    input: { schema: GeneratePresentationInputSchema },
    output: { schema: PresentationOutlineSchema },
    prompt: `You are an expert presentation creator. Your task is to generate a presentation outline based on the user's request.

**Language Requirement:**
- Generate all text content (titles and bullet points) in the requested language: **{{#if language}}{{language}}{{else}}English{{/if}}**.

**Content Generation:**
- The tone must be professional, authoritative, and clear. Avoid jargon.
- For each slide, you MUST provide: a title, content (as an array of bullet points), and an English image prompt for an AI image generator. The image prompt should ONLY describe the visual content. DO NOT generate an imageUrl.

**Structure Generation Instructions:**
- If the user provides a "Custom Structure," you MUST use it. The 'numSlides' parameter should be IGNORED.
- If content type is "Project Proposal," use this structure: 1. Introduction, 2. Objectives, 3. Background/Literature, 4. Methodology/Approach, 5. Project Work/Implementation, 6. Results/Findings, 7. Discussion/Analysis, 8. Conclusion & Suggestions, 9. Acknowledgement.
- If content type is "Pitch Deck," use this narrative: 1. Title, 2. The Problem, 3. The Solution, 4. Market Size, 5. The Product, 6. Team, 7. Financials/Ask, 8. Thank You/Contact.
- If content type is "General," generate a logical presentation of exactly {{{numSlides}}} slides, including an introduction and conclusion.

**User Input:**
- Topic: {{{topic}}}
- Style: {{{style}}}
{{#if presenterName}}- Presenter: {{{presenterName}}}{{/if}}
{{#if rollNumber}}- Roll Number: {{{rollNumber}}}{{/if}}
{{#if department}}- Department: {{{department}}}{{/if}}
- Content Type: {{{contentType}}}
{{#if customStructure}}- Custom Structure: {{{customStructure}}}{{/if}}

Generate the presentation outline now.
`,
});

const applyStyle = (prompt: string, style: string) => {
    let styledPrompt = prompt;
    if (style && style.toLowerCase() !== 'photorealistic') {
      styledPrompt = `${prompt}, in a ${style} style`;
    }
    return `${styledPrompt}. This image must not contain any text or words. High quality, professional, illustrative.`;
};


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

    const imageStyle = input.imageStyle || 'photorealistic';

    // 2. Generate all images sequentially to avoid rate limiting
    for (const slide of outline.slides) {
      if (!slide.imagePrompt || !slide.imagePrompt.trim()) {
        continue;
      }
      try {
        const imageGenPrompt = applyStyle(slide.imagePrompt, imageStyle);
        
        const {media} = await ai.generate({
          model: googleAI.model('gemini-2.0-flash-preview-image-generation'),
          prompt: imageGenPrompt,
          config: {
            responseModalities: ['TEXT', 'IMAGE'],
          },
        });
        
        if (media && media.url) {
            slide.imageUrl = media.url;
        }
      } catch (error) {
        console.error(`Image generation failed for slide: "${slide.title}". Error: ${error}`);
        // Leave imageUrl as undefined, the frontend will handle it
      }
    }
    
    return outline;
  }
);


const generateSingleImageFlow = ai.defineFlow(
    {
        name: 'generateSingleImageFlow',
        inputSchema: GenerateSingleImageInputSchema,
        outputSchema: GenerateSingleImageOutputSchema,
    },
    async (input) => {
        const { media } = await ai.generate({
          model: googleAI.model('gemini-2.0-flash-preview-image-generation'),
          prompt: applyStyle(input.imagePrompt, input.imageStyle),
          config: {
            responseModalities: ['TEXT', 'IMAGE'],
          },
        });

        if (!media?.url) {
            throw new Error('Failed to generate image.');
        }

        return { imageUrl: media.url };
    }
);
