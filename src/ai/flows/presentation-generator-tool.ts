
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
        // In a real application, you would implement a logo fetching service here.
        // For this example, we'll return a placeholder. The model is taught to handle this.
        return `https://logo.clearbit.com/${input.companyName.toLowerCase()}.com`;
    }
);

// We define schemas for the flow's internal use here.
const GeneratePresentationInputSchema = z.object({
  topic: z.string(),
  presenterName: z.string().optional(),
  rollNumber: z.string().optional(),
  department: z.string().optional(),
  numSlides: z.number().int().min(2).max(20),
  contentType: z.enum(['general', 'projectProposal', 'pitchDeck', 'custom']),
  customStructure: z.string().optional(),
  imageStyle: z.string().optional(),
  language: z.string().optional(),
  style: z.enum(['Default', 'Tech Pitch', 'Creative']),
});

const SlideSchema = z.object({
  title: z.string().describe('The title of the slide.'),
  content: z.array(z.string()).describe('An array of exactly 4 short bullet points for the slide content. Each bullet point must have around 8 words. This can be an empty array for title-only slides.'),
  imagePrompt: z.string().describe('A text prompt to generate a relevant image for this slide. Can be an empty string if no image is needed. This prompt should ONLY describe the visual content of the image.'),
  logoUrl: z.string().optional().describe('The URL of a company logo to display on the slide, fetched using the getCompanyLogoTool.'),
  slideLayout: z.enum(['title', 'contentWithImage', 'titleOnly']).describe("The best layout for this slide. Use 'title' for the main title slide, 'contentWithImage' for slides with bullet points and a visual, and 'titleOnly' for section headers or simple, impactful statements."),
  imageUrl: z.string().optional(),
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
  backgroundImageUrl: z.string().optional(),
});
export type GeneratePresentationOutput = z.infer<typeof PresentationOutlineSchema>;


export async function generatePresentation(input: z.infer<typeof GeneratePresentationInputSchema>): Promise<GeneratePresentationOutput> {
  return generatePresentationFlow(input);
}

const outlinePrompt = ai.definePrompt({
    name: 'generatePresentationOutlinePrompt',
    input: { schema: GeneratePresentationInputSchema },
    output: { schema: PresentationOutlineSchema },
    tools: [getCompanyLogoTool],
    prompt: `You are an expert presentation creator and visual designer. Your task is to generate a detailed presentation outline in a valid JSON format based on the user's request.

**Core Principles:**
- **Visuals First**: For each slide, first conceive a powerful, memorable visual, then write a short title and content to complement it.
- **One Idea Per Slide**: Each slide must focus on a single, core idea.
- **Strict Content Rules**: Each content slide must have exactly 4 bullet points of about 8 words each. For 'titleOnly' slides, the content array must be empty.
- **Layout Intelligence**: For each slide, choose the most appropriate layout: 'title', 'contentWithImage', or 'titleOnly'.

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
- **The first slide must always be the main title slide with the layout 'title'.**
- If the user provides a "Custom Structure," you MUST use it. The 'numSlides' parameter should be IGNORED.
  - **Parsing Custom Structure**: Treat each line starting with a number or bullet (e.g., "1. About", "- Key Features") as a slide title. Use all text following that title as context for that slide.
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

CRITICAL: Your entire output MUST be a single, valid JSON object that conforms to the schema.
`,
});


const generatePresentationFlow = ai.defineFlow(
  {
    name: 'generatePresentationFlow',
    inputSchema: GeneratePresentationInputSchema,
    outputSchema: PresentationOutlineSchema,
  },
  async (input) => {
    const { output: outline } = await outlinePrompt(input);
    if (!outline) {
      throw new Error('Failed to generate presentation outline.');
    }

    const applyStyle = (prompt: string) => {
      let styledPrompt = prompt;
      if (input.imageStyle && input.imageStyle.toLowerCase() !== 'photorealistic') {
        styledPrompt = `${prompt}, in a ${input.imageStyle} style`;
      }
      return `${styledPrompt}. CRITICAL: If you include any text or words in the image, you MUST ensure they are spelled correctly.`;
    };
    
    const slideImagePrompts = new Map<number, string>();
    outline.slides.forEach((slide, index) => {
        if (slide.imagePrompt) {
            slideImagePrompts.set(index, slide.imagePrompt);
        }
    });

    const imageGenerationPromises = [];

    if (outline.design.backgroundPrompt) {
        imageGenerationPromises.push(
            ai.generate({
                model: 'googleai/imagen-4.0-generate-001',
                prompt: applyStyle(outline.design.backgroundPrompt),
            })
        );
    } else {
        imageGenerationPromises.push(Promise.resolve({ media: { url: '' } }));
    }

    for (const prompt of slideImagePrompts.values()) {
        imageGenerationPromises.push(
            ai.generate({
                model: 'googleai/imagen-4.0-generate-001',
                prompt: applyStyle(prompt),
            })
        );
    }

    const results = await Promise.allSettled(imageGenerationPromises);

    const backgroundResult = results[0];
    if (backgroundResult.status === 'fulfilled' && backgroundResult.value.media?.url) {
        outline.backgroundImageUrl = backgroundResult.value.media.url;
    } else {
        console.error('Background image generation failed:', backgroundResult.status === 'rejected' ? backgroundResult.reason : 'No URL returned');
        outline.backgroundImageUrl = ''; 
    }
    
    const slideImageResults = results.slice(1);
    const slidePromptKeys = Array.from(slideImagePrompts.keys());

    for (let i = 0; i < slideImageResults.length; i++) {
        const result = slideImageResults[i];
        const slideIndex = slidePromptKeys[i];
        
        if (result.status === 'fulfilled' && result.value.media?.url) {
            outline.slides[slideIndex].imageUrl = result.value.media.url;
        } else {
            console.error(`Slide ${slideIndex + 1} image generation failed:`, result.status === 'rejected' ? result.reason : 'No URL returned');
            outline.slides[slideIndex].imageUrl = '';
        }
    }

    return outline;
  }
);
