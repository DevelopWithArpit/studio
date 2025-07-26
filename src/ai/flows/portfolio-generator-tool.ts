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
    prompt: `You are an expert web developer specializing in creating supreme, top-of-the-line, single-page portfolio websites with the greatest of all time visuals and animations.

Your task is to take the user's structured data and generate the complete HTML, CSS, and JavaScript code for an ultimate portfolio website.

**Supreme Design & Animation Requirements:**
- **Theme:** A sleek, professional dark theme as the base. The primary background color must be #0D0D0D.
- **Aurora Background & Spotlight Cursor:**
  - Create a stunning, multi-color "aurora" style animated gradient in the background. It should be composed of several large, blurred, colored circles that slowly move and morph over time using CSS animations. The colors should be soft and modern (e.g., shades of teal, purple, and blue).
  - The body must have a spotlight cursor effect. The background of the entire page should be a radial gradient centered on the mouse position, creating a "spotlight" that follows the cursor. This interacts with the aurora effect.
- **On-Scroll Reveal Animations:** All sections (About, Experience, Projects, etc.) must have a smooth 'reveal' animation (fade-in and slide-up) as the user scrolls them into view. Use the Intersection Observer API for this for performance.
- **Glassmorphism Project Cards in Bento Grid:** Display projects in a modern "bento grid" layout. The project cards must have a "glassmorphism" effect: a semi-transparent, blurred background (using \`backdrop-filter: blur(16px)\`) and a subtle border. On hover, the cards must have a subtle 3D tilt effect using transform perspective.
- **Typography:** Use a professional and clean font pairing. Use 'Poppins' for headings and 'Inter' for body text. Import them from Google Fonts in the HTML file's <head>.
- **Code Structure:**
  - Generate a single, clean HTML file. Do not add comments.
  - All CSS must be inside a <style> tag in the HTML's <head>. Do not use external CSS files.
  - All JavaScript must be inside a <script> tag at the end of the <body>. Use vanilla JavaScript only. No jQuery or other libraries.
  - The JavaScript must correctly handle all specified animations: the spotlight cursor, the 3D tilt, and the on-scroll reveals.
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

Generate the complete, ready-to-use, ultimate portfolio code now.`,
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

    