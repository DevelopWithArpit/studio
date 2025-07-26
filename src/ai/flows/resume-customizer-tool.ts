'use server';

/**
 * @fileOverview Customizes a resume's layout and style.
 * 
 * - customizeResume - A function that generates a styled resume.
 * - CustomizeResumeInput - The input type for the function.
 * - CustomizeResumeOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ResumeDataSchema = z.object({
  name: z.string().describe("The user's full name."),
  contact: z.object({
      phone: z.string(),
      email: z.string(),
      linkedin: z.string(),
      github: z.string().optional(),
      location: z.string(),
  }),
  summary: z.string(),
  experience: z.array(z.object({
      title: z.string(),
      company: z.string(),
      dates: z.string(),
      bullets: z.array(z.string())
  })),
  education: z.array(z.object({
      degree: z.string(),
      school: z.string(),
      dates: z.string(),
      location: z.string(),
  })),
  projects: z.array(z.object({
      title: z.string(),
      bullets: z.array(z.string())
  })),
  skills: z.object({
      technical: z.array(z.string()),
      other: z.array(z.string()).optional(),
  }),
  achievements: z.array(z.string()),
});


const CustomizeResumeInputSchema = z.object({
  resumeData: ResumeDataSchema.describe("The structured JSON data of the resume."),
  template: z.enum(['Modern', 'Classic', 'Creative']).describe("The chosen layout template for the resume."),
  primaryColor: z.string().describe("A hex color code (e.g., '#4A90E2') for the primary color of the resume design."),
});
export type CustomizeResumeInput = z.infer<typeof CustomizeResumeInputSchema>;

const CustomizeResumeOutputSchema = z.object({
  html: z.string().describe('The complete HTML code for the styled resume.'),
});
export type CustomizeResumeOutput = z.infer<typeof CustomizeResumeOutputSchema>;

export async function customizeResume(input: CustomizeResumeInput): Promise<CustomizeResumeOutput> {
  return customizeResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'customizeResumePrompt',
  input: { schema: CustomizeResumeInputSchema },
  output: { schema: CustomizeResumeOutputSchema },
  prompt: `You are an expert web developer and designer specializing in creating professional, visually appealing resume templates.

Your task is to generate the complete HTML for a resume based on the user's structured data and their chosen customization options.

**Design Requirements:**
- **Template:** The design must adhere to the '{{{template}}}' template style.
  - **Modern:** Clean, sans-serif fonts (like Inter or Lato), single-column or two-column layout with clear headings and good whitespace. Professional and sleek.
  - **Classic:** Serif fonts (like Garamond or Georgia), a more traditional single-column layout, and a timeless, formal feel.
  - **Creative:** More unique fonts, potentially a non-traditional layout, and a focus on visual flair suitable for designers, artists, etc.
- **Color:** The primary color for accents (like headings, links, or borders) must be '{{{primaryColor}}}'. All other colors should be neutral (e.g., shades of gray for text, white for background).
- **Code:**
  - Generate a **single HTML file** with all CSS embedded in a '<style>' tag in the '<head>'.
  - Use inline styles sparingly. The majority of the styling should be in the style tag.
  - Ensure the HTML is clean, semantic, and well-structured.
  - The final output should be suitable for printing and converting to PDF. Aim for a standard A4 or Letter page size.

**Resume Data:**
- **Name:** {{{resumeData.name}}}
- **Contact:**
  - Email: {{{resumeData.contact.email}}}
  - Phone: {{{resumeData.contact.phone}}}
  - LinkedIn: {{{resumeData.contact.linkedin}}}
  {{#if resumeData.contact.github}}- GitHub: {{{resumeData.contact.github}}}{{/if}}
  - Location: {{{resumeData.contact.location}}}
- **Summary:** {{{resumeData.summary}}}

**Experience:**
{{#each resumeData.experience}}
- **{{title}}** at {{company}} ({{dates}})
{{#each bullets}}
  - {{this}}
{{/each}}
{{/each}}

**Education:**
{{#each resumeData.education}}
- **{{degree}}** from {{school}} ({{dates}})
{{/each}}

**Projects:**
{{#each resumeData.projects}}
- **{{title}}**
{{#each bullets}}
  - {{this}}
{{/each}}
{{/each}}

**Skills:**
- **Technical:** {{#each resumeData.skills.technical}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
{{#if resumeData.skills.other}}- **Other:** {{#each resume.skills.other}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}

**Achievements:**
{{#each resumeData.achievements}}
- {{this}}
{{/each}}

Generate the complete HTML code now.
`,
});

const customizeResumeFlow = ai.defineFlow(
  {
    name: 'customizeResumeFlow',
    inputSchema: CustomizeResumeInputSchema,
    outputSchema: CustomizeResumeOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
