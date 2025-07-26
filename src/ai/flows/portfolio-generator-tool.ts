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
    prompt: `You are an expert web developer specializing in creating ultimate, top-tier, and stunning single-page portfolio websites with the most modern and impressive visuals and animations.

Your task is to take the user's structured data and generate the complete HTML, CSS, and JavaScript code for a portfolio website that will leave a lasting impression.

**Design Requirements:**
- **Visuals & Theme:**
  - **Theme:** Use a sleek, professional dark theme.
  - **Hero Background:** Create a stunning, slowly animating gradient mesh background for the hero section. It should feel like a subtle, flowing aurora.
  - **Typography:** Use a professional and clean font pairing like 'Poppins' for headings and 'Inter' for body text. Use Google Fonts.
- **Animations & Interactivity:**
  - **Custom Cursor:** Implement a custom "spotlight" cursor effect where a soft, radial gradient follows the mouse, illuminating the content behind it.
  - **On-Scroll Animations:** Implement smooth, elegant 'reveal' animations (fade-in and slide-up) for all sections as the user scrolls.
  - **Interactive Project Cards:** Project cards should have a modern, interactive 3D tilt effect on hover.
  - **Hover Effects:** Buttons and links should have subtle, polished hover effects (e.g., lift, glow, or gradient shift).
- **Layout:**
  - The website must be fully responsive and look exceptional on all screen sizes.
  - Create a single HTML file with a sticky navigation bar that smoothly scrolls to the corresponding sections.
  - **Project Section:** Use a modern "bento grid" layout to display the projects. This layout uses different-sized grid items to create a visually interesting and organized presentation.
- **Structure:**
  - **Homepage (Hero):** A powerful introduction with name and headline.
  - **About:** The user's biography.
  - **Experience:** A timeline or list of professional roles.
  - **Education:** A list of educational qualifications.
  - **Projects:** A bento grid of project cards. Each card should have a title, description, and link. Use placeholder images (e.g., https://placehold.co/600x400) if no image URL is provided.
  - **Skills:** A section to display technical skills.
  - **Contact:** A footer with contact email and social media links.
- **Code:**
  - Generate clean, well-commented, and separate HTML, CSS, and JavaScript files.
  - The CSS should be self-contained and not rely on external frameworks.
  - The JavaScript should be vanilla, without external libraries like jQuery.

**User's Portfolio Data:**
---
- Name: {{{name}}}
- Headline: {{{headline}}}
- Contact Email: {{{contact.email}}}
- Contact Phone: {{{contact.phone}}}
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
