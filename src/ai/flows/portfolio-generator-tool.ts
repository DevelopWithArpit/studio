'use server';

/**
 * @fileOverview Generates a complete portfolio website from structured data.
 * 
 * - generatePortfolioWebsite - A function that generates HTML, CSS, and JS for a portfolio.
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
          url: z.string().url(),
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

const prompt = ai.definePrompt({
    name: 'generatePortfolioWebsitePrompt',
    input: { schema: PortfolioDataSchema },
    output: { schema: GeneratePortfolioWebsiteOutputSchema },
    prompt: `You are an expert web developer specializing in creating elegant, professional, single-page portfolio websites with modern visuals and smooth animations.

Your task is to take the user's structured data and generate the complete HTML, CSS, and JavaScript code for a portfolio website.

**Design & Animation Requirements:**
- **Theme:** A sleek, professional dark theme. The primary background color must be #0A0A0A.
- **On-Scroll Staggered Reveal Animations:**
  - All sections (About, Experience, Projects, etc.) must have a smooth 'reveal' animation as the user scrolls them into view.
  - Use the Intersection Observer API for performance.
  - Importantly, items within a section (like experience entries, project cards, or skill tags) must have a staggered reveal. They should animate in one after the other with a slight delay (e.g., 100ms), creating a fluid, cascading effect.
- **Glassmorphism Project Cards in Bento Grid:**
  - Display projects in a modern "bento grid" layout.
  - Project cards must have a "glassmorphism" effect: a semi-transparent, blurred background (\`backdrop-filter: blur(10px)\`) and a subtle white border.
  - On hover, the card's border must have a glowing effect, and the card should scale up slightly (e.g., \`transform: scale(1.03)\`).
- **Typography:** Use a professional and clean font pairing. Use 'Poppins' for headings and 'Inter' for body text. Import them from Google Fonts in the HTML file's <head>.
- **Code Structure:**
  - Generate a single, clean HTML file. Do not add comments.
  - All CSS must be inside a <style> tag in the HTML's <head>.
  - All JavaScript must be inside a <script> tag at the end of the <body>. Use vanilla JavaScript only.
  - The JavaScript must correctly handle the on-scroll staggered reveals.
  - Call the reveal function on page load to show elements already in view.

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
{{/each}}
{{#if achievements}}
- Achievements:
{{#each achievements}}
  - {{this}}
{{/each}}
{{/if}}
---

Generate the complete, ready-to-use portfolio code now.`,
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
