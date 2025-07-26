'use server';

/**
 * @fileOverview Generates a complete portfolio website.
 * 
 * - generatePortfolioWebsite - A function that generates HTML, CSS, and JS for a portfolio.
 * - GeneratePortfolioWebsiteInput - The input type for the function.
 * - GeneratePortfolioWebsiteOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ProjectSchema = z.object({
    title: z.string().describe('The title of the project.'),
    description: z.string().describe('A brief description of the project.'),
    imageUrl: z.string().url().describe('A URL to an image for the project.'),
    projectUrl: z.string().url().describe('A URL to the live project or its repository.'),
});

const GeneratePortfolioWebsiteInputSchema = z.object({
  fullName: z.string().describe('The full name of the user.'),
  headline: z.string().describe('A professional headline (e.g., "Full-Stack Developer | AI Enthusiast").'),
  about: z.string().describe('A short "About Me" paragraph.'),
  projects: z.array(ProjectSchema).describe('An array of the user\'s projects.'),
  skills: z.array(z.string()).describe('A list of the user\'s key technical skills.'),
  contactEmail: z.string().email().describe('The user\'s contact email address.'),
});
export type GeneratePortfolioWebsiteInput = z.infer<typeof GeneratePortfolioWebsiteInputSchema>;

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
  input: { schema: GeneratePortfolioWebsiteInputSchema },
  output: { schema: GeneratePortfolioWebsiteOutputSchema },
  prompt: `You are an expert web developer specializing in creating stunning, professional, and modern single-page portfolio websites.

Your task is to generate the complete HTML, CSS, and JavaScript code for a portfolio website based on the user's information.

**Design Requirements:**
- **Visuals:** Clean, modern aesthetic with a dark theme. Use a professional font like 'Inter' or 'Poppins'.
- **Animations:** Implement subtle on-scroll reveal animations for sections and project cards. Add a gentle particle effect to the hero section background.
- **Layout:** The website must be fully responsive and look great on all screen sizes (desktop, tablet, and mobile).
- **Structure:** Create a single HTML file with sections for Hero (introduction), About, Projects, Skills, and a Contact footer.
- **Code:** Generate clean, well-commented, and separate HTML, CSS, and JavaScript code. The CSS should be self-contained and not rely on external frameworks like Tailwind or Bootstrap. The JS should be vanilla JavaScript, not using jQuery or other libraries.

**User Information:**
- **Full Name:** {{{fullName}}}
- **Headline:** {{{headline}}}
- **About Me:** {{{about}}}
- **Contact Email:** {{{contactEmail}}}

**Skills:**
{{#each skills}}
- {{{this}}}
{{/each}}

**Projects:**
{{#each projects}}
- **Title:** {{{title}}}
  - **Description:** {{{description}}}
  - **Image URL:** {{{imageUrl}}}
  - **Project URL:** {{{projectUrl}}}
{{/each}}

Generate the complete, ready-to-use code now.`,
});

const generatePortfolioWebsiteFlow = ai.defineFlow(
  {
    name: 'generatePortfolioWebsiteFlow',
    inputSchema: GeneratePortfolioWebsiteInputSchema,
    outputSchema: GeneratePortfolioWebsiteOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
