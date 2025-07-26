
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
    prompt: `You are an expert web developer specializing in creating ultimate, top-of-the-line, single-page portfolio websites with a "Digital Cyberspace" theme, featuring god-tier, supreme, and stunning visuals and animations.

Your task is to take the user's structured data and generate the complete HTML, CSS, and JavaScript for a portfolio website.

**Design & Animation Requirements (GOD TIER):**
- **Theme:** A sleek, futuristic "Digital Cyberspace" dark theme. The primary background color must be a dark tech-blue (#0A192F). Accent colors should be a vibrant cyan or electric green for a high-tech, neon feel.
- **Ultimate Animated "Digital Grid" Background:**
  - The background must be a dynamic, animated grid of faint, glowing lines that slowly move, creating a sense of being within a digital matrix or on a futuristic blueprint. This must be implemented with performant CSS background gradients and animations.
- **Hero Section with "Decode" Animation:**
  - The user's name and headline must appear with a high-tech "decode" or "text shuffle" effect. The text should rapidly cycle through random characters before smoothly settling on the final letters. This must be implemented with JavaScript and should be visually smooth and elegant, not jarring.
- **"Glassmorphism" Bento Grid with Scanline Effect:**
  - Projects should be displayed in a clean, modern bento grid.
  - Each project card must have a "glassmorphism" effect (semi-transparent background with a backdrop-filter blur) and a subtle glowing border.
  - On hover, a faint horizontal "scan line" should animate vertically down the card, as if a futuristic scanner is analyzing it.
- **On-Scroll Animations:**
  - All sections must have a smooth 'fade-in-up' animation as the user scrolls them into view. Use the Intersection Observer API for performance.
  - Items within sections (like experience entries or project cards) should have a staggered animation delay to appear one after another.
- **Typography:** Use 'Space Grotesk' for all text. Import it from Google Fonts in the HTML file's <head>.
- **Code Structure:**
  - Generate a single, clean HTML file. Do not add comments.
  - All CSS must be inside a <style> tag in the HTML's <head>.
  - All JavaScript must be inside a <script> tag at the end of the <body>. Use vanilla JavaScript only.
  - The JavaScript must correctly handle the hero text decode animation and the on-scroll reveal animations using the Intersection Observer API.

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

Generate the complete, ready-to-use portfolio code now. Ensure the JavaScript implementation is robust and correct for all animations.`,
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
