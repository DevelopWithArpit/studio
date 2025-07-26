
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
    prompt: `You are an expert web developer specializing in creating ultimate, top-of-the-line, single-page portfolio websites with a "Cosmic Universe" theme, featuring god-tier, supreme, and stunning visuals and animations.

Your task is to take the user's structured data and generate the complete HTML, CSS, and JavaScript for a portfolio website.

**Design & Animation Requirements (GOD TIER):**
- **Theme:** A sleek, futuristic "Cosmic Universe" dark theme. The primary background color must be pure black (#0A0A0A). Accent colors should be a vibrant cyan or electric blue for a high-tech feel.
- **Ultimate Animated "Cosmic Aurora" Background:**
  - The background must be a dynamic, multi-color, slowly shifting gradient that resembles a cosmic aurora or nebula. This must be implemented using a large, fixed-position pseudo-element (\`::before\`) on the body, with a CSS animation that continuously transforms the background gradients. This creates a mesmerizing, high-end visual that is also extremely performant. It should not be a static image or a simple two-color gradient.
- **Hero Section with "Decode" Animation:**
  - The user's name and headline must appear with a high-tech "decode" or "text shuffle" effect. The text should rapidly cycle through random characters before smoothly settling on the final letters. This must be implemented with JavaScript and should be visually smooth and elegant, not jarring.
- **Holographic Bento Grid for Projects:**
  - Projects should be displayed in a clean, modern bento grid.
  - Each project card must have a "glassmorphism" effect (semi-transparent background with a backdrop-filter blur).
  - On hover, each project card must have a "holographic" effect: a glowing, animated border and a subtle 3D tilt. This should be implemented with CSS for performance.
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
