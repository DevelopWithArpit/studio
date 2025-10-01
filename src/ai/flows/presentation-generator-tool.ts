
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

const GeneratePresentationInputSchema = z.object({
  topic: z.string().describe('The topic or title of the presentation.'),
  presenterName: z.string().optional().describe("The name of the presenter."),
  rollNumber: z.string().optional().describe("The presenter's roll number."),
  department: z.string().optional().describe("The presenter's department."),
  numSlides: z.number().int().min(2).max(20).describe('The number of slides to generate (for general topics).'),
  contentType: z.enum(['general', 'projectProposal', 'pitchDeck', 'custom']).default('general').describe('The type of content to generate.'),
  customStructure: z.string().optional().describe("A user-defined structure for the presentation, as a string of slide titles, potentially with notes for each."),
  imageStyle: z.string().optional().describe("An optional style for the images (e.g., 'photorealistic', 'cartoon')."),
  language: z.string().optional().describe("The language for the presentation content (e.g., 'English', 'Hindi', 'Marathi')."),
  style: z.enum(['Default', 'Tech Pitch', 'Creative']).default('Default').describe('The visual design and narrative style of the presentation.'),
});
export type GeneratePresentationInput = z.infer<typeof GeneratePresentationInputSchema>;

const SlideSchema = z.object({
  title: z.string().describe('The title of the slide.'),
  content: z.array(z.string()).describe('An array of exactly 4 short bullet points for the slide content. Each bullet point must have around 8 words. This can be an empty array for title-only slides.'),
  imagePrompt: z.string().describe('A text prompt to generate a relevant image for this slide. Can be an empty string if no image is needed.'),
  logoUrl: z.string().optional().describe('The URL of a company logo to display on the slide, fetched using the getCompanyLogoTool.'),
  slideLayout: z.enum(['title', 'contentWithImage', 'titleOnly']).describe("The best layout for this slide. Use 'title' for the main title slide, 'contentWithImage' for slides with bullet points and a visual, and 'titleOnly' for section headers or simple, impactful statements."),
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
    tools: [getCompanyLogoTool],
    prompt: `You are an expert presentation creator and visual designer, inspired by tools like PowerPoint Designer. Your task is to generate a stunning and detailed presentation outline based on the user's request, following modern presentation best practices.

**Core Principles (Non-negotiable):**
- **Visuals > Text**: Your primary goal is to create a powerful, memorable visual for each slide. The text is secondary and only supports the visual. For every slide, you must first conceive the visual and then write a short title and content to complement it.
- **One Idea per Slide**: Each slide must focus on a single, core idea. If a point is complex, it MUST be broken down into multiple slides.
- **Strict Content Rules**: Each content slide must have exactly 4 bullet points. Each bullet point MUST have around 8 words. For 'titleOnly' slides, the content array should be empty.
- **Layout Intelligence**: For each slide, you MUST choose the most appropriate layout: 'title' for the main title slide, 'contentWithImage' for standard content slides, and 'titleOnly' for section headers or impactful statements.

**Language Requirement:**
- You MUST generate all text content (titles and bullet points) in the requested language: **{{#if language}}{{language}}{{else}}English{{/if}}**.

**Design & Narrative Style: {{style}}**
- **Design Generation:** Based on the presentation topic and the chosen style, create a cohesive and professional design theme.
    - **Default:** A clean, professional, and versatile design suitable for most topics.
    - **Tech Pitch:** A dark, cinematic theme inspired by modern tech companies like Apple. Use bold typography and high-contrast colors (e.g., dark background, white text, electric blue/green accent).
    - **Creative:** A vibrant, colorful theme inspired by companies like Google. Use a light background, bright accent colors, and clean, friendly fonts.
- You MUST derive and provide hex color codes for 'backgroundColor', 'textColor', and 'accentColor' that are visually harmonious and reflect the chosen style.
- You MUST also provide a 'backgroundPrompt' that matches the style. This prompt should describe a stunning, high-quality, professional background image (e.g., abstract, subtle, cinematic) that is visually related to the topic but does not distract from the content. The image prompt itself must be in English.

**Content Generation:**
- **Tone and Style**: The content must be professional and authoritative, yet sound natural and human-written. It should be engaging, clear, and concise. Avoid jargon.
- **Tool Use**: If a slide discusses a specific company (e.g., 'About the Company', 'Founders', 'Competitors'), you MUST use the \`getCompanyLogoTool\` to find and include the company's logo URL in the 'logoUrl' field.
- For each slide, you MUST provide:
  1. A short, impactful title.
  2. A set of exactly 4 extremely CONCISE bullet points (or an empty array for title-only slides).
  3. A descriptive prompt for an AI image generator (or an empty string). This prompt must describe a stunning, high-quality, and cinematic visual that powerfully represents the slide's core idea. Crucially, the generated image should NOT contain any text or letters whatsoever to avoid spelling and design errors. All image prompts must be in English.
  4. The appropriate 'slideLayout'.
  5. A 'logoUrl' if a company is mentioned.

**Structure Generation Instructions:**
- **The very first slide must always be the main title slide with the layout 'title'.** It should introduce the main topic and include any presenter details provided.
- If the user provides a "Custom Structure," you MUST use it as the primary source. The 'numSlides' parameter should be IGNORED.
  - **Parsing Custom Structure**: A line starting with a number and/or bullet (e.g., "1. About the Company", "- Key Features") should be treated as a slide title. All text following that title, until the next title, should be used as the context/notes for that specific slide.
  - You MUST generate one slide for each title you identify in the custom structure.
- If the content type is "Project Proposal," generate the subsequent presentation slides using this structure: 1. Introduction, 2. Objectives, 3. Background / Literature, 4. Methodology / Approach, 5. Project Work / Implementation, 6. Results / Findings, 7. Discussion / Analysis, 8. Conclusion & Suggestions, 9. Acknowledgement. (Translated to the target language).
- If the content type is "Pitch Deck," generate a presentation with this narrative structure: 1. Title, 2. The Problem, 3. The Solution, 4. Market Size, 5. The Product, 6. Team, 7. Financials / Ask, 8. Thank You / Contact.
- If the content type is "General," generate a logical presentation of exactly {{{numSlides}}} slides, which must include a conclusion slide at the end. The introduction slide is extra.

**User Input Details:**
- Topic: {{{topic}}}
{{#if presenterName}}- Presenter: {{{presenterName}}}{{/if}}
{{#if rollNumber}}- Roll Number: {{{rollNumber}}}{{/if}}
{{#if department}}- Department: {{{department}}}{{/if}}
- Content Type: {{{contentType}}}
- Presentation Style: {{{style}}}
- Number of Slides (for General type): {{{numSlides}}}
{{#if customStructure}}
- Custom Structure:
{{{customStructure}}}
{{/if}}
- Image Style: {{{imageStyle}}}
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
      if (input.imageStyle && input.imageStyle.toLowerCase() !== 'photorealistic') {
        return `${prompt}, in a ${input.imageStyle} style`;
      }
      return prompt;
    };
    
    // Create a map of slide index to its image prompt.
    const slideImagePrompts = new Map<number, string>();
    outline.slides.forEach((slide, index) => {
        if (slide.imagePrompt) {
            slideImagePrompts.set(index, slide.imagePrompt);
        }
    });

    const imageGenerationPromises = [];

    // Background Image Promise (always at index 0)
    if (outline.design.backgroundPrompt) {
        imageGenerationPromises.push(
            ai.generate({
                model: 'googleai/imagen-4.0-fast-generate-001',
                prompt: applyStyle(outline.design.backgroundPrompt),
            })
        );
    } else {
        imageGenerationPromises.push(Promise.resolve({ media: { url: '' } }));
    }

    // Slide Image Promises
    for (const prompt of slideImagePrompts.values()) {
        imageGenerationPromises.push(
            ai.generate({
                model: 'googleai/imagen-4.0-fast-generate-001',
                prompt: applyStyle(prompt),
            })
        );
    }

    const results = await Promise.allSettled(imageGenerationPromises);

    // Process background image result (from index 0)
    const backgroundResult = results[0];
    if (backgroundResult.status === 'fulfilled' && backgroundResult.value.media?.url) {
        outline.backgroundImageUrl = backgroundResult.value.media.url;
    } else {
        console.error('Background image generation failed:', backgroundResult.status === 'rejected' ? backgroundResult.reason : 'No URL returned');
        outline.backgroundImageUrl = ''; 
    }
    
    // Process slide image results
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
