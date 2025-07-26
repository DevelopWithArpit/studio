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

const ExperienceSchema = z.object({
    title: z.string().describe('The job title.'),
    company: z.string().describe('The company name.'),
    dates: z.string().describe("The dates of employment (e.g., 'June 2023 - Present')."),
    description: z.string().describe('A brief description of responsibilities and achievements.'),
});

const EducationSchema = z.object({
    degree: z.string().describe("The degree obtained (e.g., 'B.Tech in Robotics and Artificial Intelligence')."),
    school: z.string().describe("The name of the university or school."),
    dates: z.string().describe("The dates of attendance."),
});

const SocialLinksSchema = z.object({
    linkedin: z.string().url().optional().describe("URL to the user's LinkedIn profile."),
    github: z.string().url().optional().describe("URL to the user's GitHub profile."),
    twitter: z.string().url().optional().describe("URL to the user's Twitter/X profile."),
});


const GeneratePortfolioWebsiteInputSchema = z.object({
  fullName: z.string().describe('The full name of the user.'),
  headline: z.string().describe('A professional headline (e.g., "Full-Stack Developer | AI Enthusiast").'),
  about: z.string().describe('A detailed "About Me" section, including background, experience, and personal interests.'),
  experience: z.array(ExperienceSchema).describe('An array of the user\'s professional experience.'),
  education: z.array(EducationSchema).describe('An array of the user\'s educational background.'),
  projects: z.array(ProjectSchema).describe('An array of the user\'s projects.'),
  skills: z.array(z.string()).describe('A list of the user\'s key technical and professional skills.'),
  contactEmail: z.string().email().describe('The user\'s contact email address.'),
  socialLinks: SocialLinksSchema.optional().describe("The user's social media links."),
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
- **Structure:** Create a single HTML file with a sticky navigation bar and clearly defined sections for:
    1.  **Hero (Homepage):** A brief introduction with name, headline, and a call-to-action button to the projects section.
    2.  **About:** A detailed section with biography and personal interests.
    3.  **Experience:** A timeline or list of professional roles.
    4.  **Education:** A list of educational qualifications.
    5.  **Projects:** A grid of project cards, each with an image, title, description, and link.
    6.  **Skills:** A section to display technical and professional skills.
    7.  **Contact:** A footer with contact email and social media links.
- **Code:** Generate clean, well-commented, and separate HTML, CSS, and JavaScript code. The CSS should be self-contained and not rely on external frameworks like Tailwind or Bootstrap. The JS should be vanilla JavaScript, not using jQuery or other libraries.

**User Information:**
- **Full Name:** {{{fullName}}}
- **Headline:** {{{headline}}}
- **About Me:** {{{about}}}
- **Contact Email:** {{{contactEmail}}}
{{#if socialLinks}}
- **Social Links:**
  {{#if socialLinks.linkedin}}- LinkedIn: {{{socialLinks.linkedin}}}{{/if}}
  {{#if socialLinks.github}}- GitHub: {{{socialLinks.github}}}{{/if}}
  {{#if socialLinks.twitter}}- Twitter: {{{socialLinks.twitter}}}{{/if}}
{{/if}}


**Experience:**
{{#each experience}}
- **Title:** {{{title}}} at {{{company}}}
  - **Dates:** {{{dates}}}
  - **Description:** {{{description}}}
{{/each}}

**Education:**
{{#each education}}
- **Degree:** {{{degree}}}
  - **School:** {{{school}}}
  - **Dates:** {{{dates}}}
{{/each}}

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
