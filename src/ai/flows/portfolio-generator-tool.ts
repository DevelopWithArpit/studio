'use server';

/**
 * @fileOverview Generates a single-page portfolio website.
 *
 * - generatePortfolio - A function that generates HTML and CSS for a portfolio.
 * - GeneratePortfolioInput - The input type for the function.
 * - GeneratePortfolioOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GeneratePortfolioInputSchema = z.object({
  resumeText: z.string().describe('The structured resume text containing sections like Summary, Experience, Education, Skills.'),
});
export type GeneratePortfolioInput = z.infer<typeof GeneratePortfolioInputSchema>;

const GeneratePortfolioOutputSchema = z.object({
  html: z.string().describe('The full HTML content for the single-page portfolio.'),
  css: z.string().describe('The full CSS content for styling the portfolio.'),
});
export type GeneratePortfolioOutput = z.infer<typeof GeneratePortfolioOutputSchema>;

export async function generatePortfolio(input: GeneratePortfolioInput): Promise<GeneratePortfolioOutput> {
  return generatePortfolioFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePortfolioPrompt',
  input: { schema: GeneratePortfolioInputSchema },
  output: { schema: GeneratePortfolioOutputSchema },
  prompt: `You are an expert web developer. Your task is to create a single-page resume HTML and CSS document based on the provided resume text. The output must be a perfect, single-page replica of the structure and format described in the instructions. Do not miss any sections.

**Resume Content:**
---
{{{resumeText}}}
---

**Mandatory Instructions (Non-negotiable):**

1.  **Overall Layout:**
    *   The entire resume must be on a **single page**.
    *   It must have a full-width header at the top, followed by a two-column layout for the main content.

2.  **Header Section (Full Width):**
    *   Display the person's name ('ARPIT PISE') in a large, bold, black font.
    *   Below the name, display the job title ('AI Engineer / Robotics Software Engineer') in a smaller font with a professional blue color.
    *   Below the title, display all contact information horizontally: phone, email, LinkedIn, and location. Each piece of information must be preceded by a simple, appropriate icon (e.g., phone icon, email icon).

3.  **Main Content (Two-Column Layout):**
    *   The area below the header must be split into two columns.
    *   **Left Column (Wider - approx. 65% width):** This column MUST contain the following sections, in this exact order, separated by a solid horizontal line:
        *   \`SUMMARY\`
        *   \`EXPERIENCE\`
        *   \`EDUCATION\`
    *   **Right Column (Narrower - approx. 35% width):** This column MUST contain the following sections, in this exact order:
        *   At the very top, a large, circular, blue placeholder for a profile picture with the initials 'AP' inside.
        *   \`KEY ACHIEVEMENTS\` section, with its content below it.
        *   \`SKILLS\` section, with each skill displayed as a separate tag with a light-gray background and rounded corners.
        *   \`PROJECTS\` section, with its content below it.

4.  **Styling Details:**
    *   **Fonts:** Use a clean, modern, sans-serif font family (like Arial, Helvetica).
    *   **Colors:** Use black or very dark gray for the main text. Section headings ('SUMMARY', 'EXPERIENCE', etc.) must be bold and black. The job title and any links or highlighted school names should be in a professional blue color (e.g., #007BFF).
    *   **Code:** The output must be pure, vanilla HTML and CSS. Do not use any external libraries, frameworks (like Bootstrap, Tailwind), or external font imports. All styling must be self-contained in the CSS block.
    *   **Responsiveness:** Ensure the layout is reasonably responsive, stacking to a single column on smaller screens if necessary.

Generate the complete HTML and CSS code now. Do not omit any sections from the resume content provided.`,
});


const generatePortfolioFlow = ai.defineFlow(
  {
    name: 'generatePortfolioFlow',
    inputSchema: GeneratePortfolioInputSchema,
    outputSchema: GeneratePortfolioOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
