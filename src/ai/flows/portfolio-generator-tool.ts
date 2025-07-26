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
      socials: z.array(z.object({
          network: z.string().describe("The social network name (e.g., 'LinkedIn', 'GitHub')."),
          url: z.string().url().describe("The URL to the user's profile."),
      })).optional().describe("An array of social media links.")
  }),
  about: z.string().describe("A detailed 'About Me' section."),
  experience: z.array(z.object({
      title: z.string(),
      company: z.string(),
      dates: z.string(),
      description: z.string()
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
    prompt: `You are an expert web developer specializing in creating stunning, professional, and modern single-page portfolio websites.

Your task is to take the user's structured data and generate the complete HTML, CSS, and JavaScript code for a portfolio website.

**Design Requirements:**
- **Visuals:** Clean, modern aesthetic with a dark theme. Use a professional font like 'Inter' or 'Poppins'.
- **Animations:** Implement subtle on-scroll reveal animations for sections and project cards. Add a gentle particle effect to the hero section background.
- **Layout:** The website must be fully responsive and look great on all screen sizes (desktop, tablet, and mobile).
- **Structure:** Create a single HTML file with a sticky navigation bar and clearly defined sections for:
    1.  **Homepage (Hero):** A brief introduction with name and headline.
    2.  **About:** The user's biography.
    3.  **Experience:** A timeline or list of professional roles.
    4.  **Education:** A list of educational qualifications.
    5.  **Projects:** A grid of project cards, each with a title, description, and link. Use placeholder images (e.g., https://placehold.co/600x400) if no image URL is provided.
    6.  **Skills:** A section to display technical skills.
    7.  **Contact:** A footer with contact email and social media links.
- **Code:** Generate clean, well-commented, and separate HTML, CSS, and JavaScript code. The CSS should be self-contained and not rely on external frameworks like Bootstrap. The JS should be vanilla JavaScript, not using jQuery or other libraries.

**User's Portfolio Data:**
---
- Name: {{{name}}}
- Headline: {{{headline}}}
- Contact Email: {{{contact.email}}}
{{#if contact.socials}}
- Social Links: 
{{#each contact.socials}}
  - {{network}}: {{url}}
{{/each}}
{{/if}}
- About Me: {{{about}}}
- Experience:
{{#each experience}}
  - Title: {{title}}, Company: {{company}}, Dates: {{dates}}, Description: {{description}}
{{/each}}
- Education:
{{#each education}}
  - Degree: {{degree}}, School: {{school}}, Dates: {{dates}}
{{/each}}
- Projects:
{{#each projects}}
  - Title: {{title}}, Description: {{description}}, Link: {{link}}, Image: {{imageUrl}}
{{/each}}
- Skills:
{{#each skills}}
  - {{this}}
{{/each}}
---

Generate the complete, ready-to-use code now.`,
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
