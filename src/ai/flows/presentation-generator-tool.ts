
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { googleAI } from '@genkit-ai/googleai';

const getCompanyLogoTool = ai.defineTool(
    {
        name: 'getCompanyLogoTool',
        description: 'Get the logo for a given company.',
        inputSchema: z.object({
            companyName: z.string().describe('The name of the company to get the logo for.'),
        }),
        outputSchema: z.string().describe('A URL pointing to the company logo.'),
    },
    async (input) => {
        return `https://logo.clearbit.com/${input.companyName.toLowerCase()}.com`;
    }
);

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
  logoUrl: z.string().nullable().describe('The URL of a company logo to display on the slide.'),
  slideLayout: z.enum(['title', 'contentWithImage', 'titleOnly']).describe("The best layout for this slide."),
  imageUrl: z.string().optional(),
});

const DesignSchema = z.object({
  backgroundColor: z.string().describe('A hex color code for the slide background (e.g., "#0B192E").'),
  textColor: z.string().describe('A hex color code for the main text (e.g., "#E6F1FF").'),
  accentColor: z.string().describe('A hex color code for titles and accents (e.g., "#64FFDA").'),
  backgroundPrompt: z.string().describe("A prompt for an AI image generator to create a subtle, professional background image related to the presentation topic."),
});

const PresentationOutlineSchema = z.object({
  title: z.string().describe('The main title of the presentation.'),
  slides: z.array(SlideSchema).describe('An array of slide objects.'),
  design: DesignSchema.describe('A design theme for the presentation, inspired by the topic.'),
  backgroundImageUrl: z.string().optional(),
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
    tools: [getCompanyLogoTool],
    prompt: `You are an expert presentation creator and visual designer. Your task is to generate a detailed presentation outline based on the user's request.

**Core Principles:**
- **Visuals First**: For each slide, first conceive a powerful, memorable visual, then write a short title and content to complement it.
- **One Idea Per Slide**: Each slide must focus on a single, core idea.
- **Layout Intelligence**: For each slide, choose the most appropriate layout: 'title', 'contentWithImage', 'titleOnly'.

**Language Requirement:**
- Generate all text content (titles and bullet points) in the requested language: **{{#if language}}{{language}}{{else}}English{{/if}}**.

**Design & Narrative Style: {{style}}**
- Create a cohesive design theme (colors and a background prompt) based on the chosen style.
    - **Default:** Clean and professional.
    - **Tech Pitch:** Dark, cinematic theme.
    - **Creative:** Vibrant, light theme.
- Provide hex color codes for 'backgroundColor', 'textColor', and 'accentColor'.
- Provide an English 'backgroundPrompt' for a subtle, high-quality background image.

**Content Generation:**
- The tone must be professional, authoritative, and clear. Avoid jargon.
- If a slide mentions a company, you MUST use the \`getCompanyLogoTool\` to include the company's logo URL in the 'logoUrl' field.
- For each slide, you MUST provide: a title, content, an English image prompt, the slide layout, and a logoUrl if applicable. The image prompt should ONLY describe the visual content.

**Structure Generation Instructions:**
- The first slide must always be the main title slide with the layout 'title'.
- If the user provides a "Custom Structure," you MUST use it. The 'numSlides' parameter should be IGNORED.
- If content type is "Project Proposal," use this structure: 1. Introduction, 2. Objectives, 3. Background/Literature, 4. Methodology/Approach, 5. Project Work/Implementation, 6. Results/Findings, 7. Discussion/Analysis, 8. Conclusion & Suggestions, 9. Acknowledgement.
- If content type is "Pitch Deck," use this narrative: 1. Title, 2. The Problem, 3. The Solution, 4. Market Size, 5. The Product, 6. Team, 7. Financials/Ask, 8. Thank You/Contact.
- If content type is "General," generate a logical presentation of exactly {{{numSlides}}} slides, including an introduction and conclusion.

**User Input:**
- Topic: {{{topic}}}
{{#if presenterName}}- Presenter: {{{presenterName}}}{{/if}}
{{#if rollNumber}}- Roll Number: {{{rollNumber}}}{{/if}}
{{#if department}}- Department: {{{department}}}{{/if}}
- Content Type: {{{contentType}}}
- Presentation Style: {{{style}}}
{{#if customStructure}}- Custom Structure: {{{customStructure}}}{{/if}}
`,
});

const applyStyle = (prompt: string, style: string) => {
    let styledPrompt = prompt;
    if (style && style.toLowerCase() !== 'photorealistic') {
      styledPrompt = `${prompt}, in a ${style} style`;
    }
    return `${styledPrompt}. CRITICAL: This image must not contain any text or words.`;
};

const generatePresentationFlow = ai.defineFlow(
  {
    name: 'generatePresentationFlow',
    inputSchema: GeneratePresentationInputSchema,
    outputSchema: PresentationOutlineSchema,
  },
  async (input) => {
    // 1. Generate the text-only outline first.
    const { output: outline } = await outlinePrompt(input);
    if (!outline) {
      throw new Error('Failed to generate presentation outline.');
    }
    
    // 2. Create a unified list of all prompts that need an image.
    const allPrompts: { type: 'background' | 'slide'; index?: number; prompt: string }[] = [];
    
    if (outline.design.backgroundPrompt) {
        allPrompts.push({ type: 'background', prompt: outline.design.backgroundPrompt });
    }

    outline.slides.forEach((slide, index) => {
        if (slide.imagePrompt) {
            allPrompts.push({ type: 'slide', index, prompt: slide.imagePrompt });
        }
    });

    // 3. Generate all images in parallel.
    const imageGenerationPromises = allPrompts.map(item => 
        ai.generate({
            model: 'googleai/imagen-4.0-ultra-generate-001',
            prompt: applyStyle(item.prompt, input.imageStyle || 'photorealistic'),
        })
    );
    
    const imageResults = await Promise.allSettled(imageGenerationPromises);

    // 4. Assign the generated URLs back to the corresponding sections in the original outline.
    imageResults.forEach((result, i) => {
        const correspondingPromptItem = allPrompts[i];
        const imageUrl = result.status === 'fulfilled' && result.value.media?.url ? result.value.media.url : '';
        
        if (!imageUrl) {
             console.error(`Image generation failed for prompt: "${correspondingPromptItem.prompt}"`, result.status === 'rejected' ? result.reason : 'No URL returned');
        }

        if (correspondingPromptItem.type === 'background') {
            outline.backgroundImageUrl = imageUrl;
        } else if (correspondingPromptItem.type === 'slide' && correspondingPromptItem.index !== undefined) {
            // Ensure the slide exists before trying to assign to it.
            if(outline.slides[correspondingPromptItem.index]) {
                outline.slides[correspondingPromptItem.index].imageUrl = imageUrl;
            }
        }
    });

    // 5. Return the fully populated outline.
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
            model: 'googleai/imagen-4.0-ultra-generate-001',
            prompt: applyStyle(input.imagePrompt, input.imageStyle),
        });

        if (!media?.url) {
            throw new Error('Failed to generate image.');
        }

        return { imageUrl: media.url };
    }
);
