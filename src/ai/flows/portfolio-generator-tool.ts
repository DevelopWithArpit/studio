
'use server';

/**
 * @fileOverview Generates a complete portfolio website from structured data.
 * 
 * - generatePortfolioWebsite - A function that generates HTML, CSS, and JS for a portfolio.
 * - extractPortfolioDataFromText - A function that extracts structured portfolio data from a text blob.
 * - GeneratePortfolioWebsiteInput - The input type for the function.
 * - GeneratePortfolioWebsiteOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const PortfolioDataSchema = z.object({
  name: z.string().describe("The user's full name."),
  headline: z.string().describe("The user's professional headline (e.g., 'Software Engineer | AI Enthusiast')."),
  contact: z.object({
      email: z.string().describe("The user's email address."),
      phone: z.string().optional(),
      linkedin: z.string().optional(),
      github: z.string().optional(),
      socials: z.array(z.object({
          network: z.string(),
          url: z.string(),
      })).optional().describe("An array of social media links.")
  }),
  about: z.string().describe("A detailed 'About Me' section."),
  experience: z.array(z.object({
      title: z.string(),
      company: z.string(),
      dates: z.string(),
      description: z.string(),
  })),
  education: z.array(z.object({
      degree: z.string(),
      school: z.string(),
      dates: z.string(),
  })),
  projects: z.array(z.object({
      title: z.string(),
      description: z.string(),
      link: z.string().url().optional(),
      imageUrl: z.string().url().optional(),
  })),
  skills: z.array(z.string()),
  achievements: z.array(z.string()).optional(),
});
export type GeneratePortfolioWebsiteInput = z.infer<typeof PortfolioDataSchema>;


const GeneratePortfolioWebsiteOutputSchema = z.object({
  html: z.string().describe('The complete HTML code for the portfolio website.'),
  css: z.string().describe('The complete CSS code for styling the portfolio.'),
  javascript: z.string().describe('The JavaScript code for animations and interactivity.'),
});
export type GeneratePortfolioWebsiteOutput = z.infer<typeof GeneratePortfolioWebsiteOutputSchema>;

export async function generatePortfolioWebsite(input: GeneratePortfolioWebsiteInput): Promise<GeneratePortfolioWebsiteOutput> {
  return generatePortfolioWebsiteFlow(input);
}


const extractPortfolioDataPrompt = ai.definePrompt({
    name: 'extractPortfolioDataPrompt',
    input: { schema: z.object({ text: z.string() }) },
    output: { schema: PortfolioDataSchema },
    prompt: `You are an expert at parsing unstructured text and extracting structured information. Analyze the following document, which could be a resume, a LinkedIn profile, or an article about building a portfolio. Your task is to extract all relevant information and structure it according to the provided JSON schema.

- If the document is a guide or article, create a realistic and compelling portfolio for a fictional person (e.g., Alex Doe, a Full-Stack Developer) based on the principles and examples in the text.
- Infer missing information where it makes sense. For instance, if a job title is "Software Engineer," you can create plausible project descriptions or skill sets.
- For projects, if no image URL is provided, use a placeholder from 'https://placehold.co/600x400'.
- Ensure all fields in the schema are populated with high-quality, realistic data.

Document to analyze:
---
{{{text}}}
---

Extract the data now.`,
});

export async function extractPortfolioDataFromText(text: string): Promise<GeneratePortfolioWebsiteInput> {
    const { output } = await extractPortfolioDataPrompt({ text });
    if (!output) {
        throw new Error("Failed to extract portfolio data from the provided text.");
    }
    return output;
}


const prompt = ai.definePrompt({
    name: 'generatePortfolioWebsitePrompt',
    input: { schema: PortfolioDataSchema },
    output: { schema: GeneratePortfolioWebsiteOutputSchema },
    prompt: `You are an expert web developer specializing in creating sleek, single-page portfolio websites with a futuristic, dark theme.

Your task is to take the user's structured data and generate the complete HTML, CSS, and JavaScript for the portfolio.

**Design & Animation Requirements:**
- **Theme:** A sleek, futuristic dark theme. The primary background color should be a dark tech-blue (#0A192F). Accent colors should be a vibrant cyan or electric green for a high-tech feel.
- **On-Scroll Animations:** As the user scrolls, entire sections (like "Experience" or "Projects") must fade and slide into view. This should be powered by the **Intersection Observer API** in JavaScript to add a 'visible' class to the element, which then triggers a **pure CSS transition**.
- **Typography:** Use 'Space Grotesk' for all text. Import it from Google Fonts in the HTML file's <head>.
- **Code Structure:**
  - Generate a single, clean HTML file. Do not add comments.
  - All CSS must be inside a <style> tag in the HTML's <head>.
  - All JavaScript must be inside a <script> tag at the end of the <body>. The JavaScript should ONLY be used for the Intersection Observer to trigger the CSS animations.

**User's Portfolio Data:**
---
- Name: {{{name}}}
- Headline: {{{headline}}}
- Contact Email: {{{contact.email}}}
{{#if contact.phone}}- Contact Phone: {{{contact.phone}}}{{/if}}
{{#if contact.socials}}
- Socials:
{{#each contact.socials}}
  - {{network}}: {{url}}
{{/each}}
{{/if}}
- About Me: {{{about}}}
- Experience:
{{#each experience}}
  - Title: {{title}}, Company: {{company}}, Dates: {{dates}}
  - Description: {{description}}
{{/each}}
- Education:
{{#each education}}
  - Degree: {{degree}}, School: {{school}}, Dates: {{dates}}
{{/each}}
- Projects:
{{#each projects}}
  - Title: {{title}}, Link: {{link}}, Image: {{imageUrl}}
  - Description: {{description}}
{{/each}}
- Skills:
{{#each skills}}
  - {{this}}
{{/each}}{{#if achievements}}
- Achievements:
{{#each achievements}}
  - {{this}}
{{/each}}
{{/if}}
---

Generate the complete, ready-to-use portfolio code now. Ensure the implementation is stable, performant, and follows all styling requirements precisely.`,
});


const generatePortfolioWebsiteFlow = ai.defineFlow(
  {
    name: 'generatePortfolioWebsiteFlow',
    inputSchema: PortfolioDataSchema,
    outputSchema: GeneratePortfolioWebsiteOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
