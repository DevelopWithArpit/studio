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
  prompt: `You are an expert web developer creating a single-page portfolio from resume text. Generate complete, standalone HTML and CSS that precisely matches the provided structure and styling instructions. All sections from the resume content must be present in the output.

**Resume Content:**
---
{{{resumeText}}}
---

**Mandatory Instructions:**
1.  **Overall Layout:** Create a professional, clean, single-page layout. The entire resume must fit on a single page.
2.  **Header Section (Full Width):**
    *   Start with a full-width header.
    *   Display the person's name in a large, bold font.
    *   Below the name, display the job title in a smaller font with a professional blue color.
    *   Below the title, display all contact information (phone, email, LinkedIn, location) horizontally, each with a simple icon.
3.  **Main Content (Two-Column Layout):**
    *   Below the header, the page must split into a two-column layout.
    *   **Left Column (Wider - approx. 65% width):** This column must contain the 'SUMMARY', 'EXPERIENCE', and 'EDUCATION' sections. Use horizontal lines to separate these main sections.
    *   **Right Column (Narrower - approx. 35% width):** This column must contain a circular placeholder for a profile picture/initials at the top. Below the placeholder, include the 'KEY ACHIEVEMENTS', 'SKILLS', and 'PROJECTS' sections.
4.  **Styling:**
    *   Use a modern, clean, sans-serif font (like Arial or Helvetica).
    *   Use black or very dark gray for standard text.
    *   Use a professional blue color (e.g., #007BFF) for section headings and links.
    *   For the 'SKILLS' section, display each skill as a light-gray-background tag with rounded corners.
    *   The code must be vanilla HTML and CSS without any external libraries or frameworks (like Bootstrap or Tailwind).
    *   Ensure the layout is reasonably responsive, stacking to a single column on smaller screens.

Generate the full HTML and CSS code now.`,
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
