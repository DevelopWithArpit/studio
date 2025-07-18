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
  prompt: `You are an expert web developer creating a single-page portfolio from resume text. Generate complete, standalone HTML and CSS.

**Resume Content:**
---
{{{resumeText}}}
---

**Instructions:**
1.  **Layout:** Create a professional two-column layout.
    *   **Header:** Start with a full-width header containing the Name, Job Title, and contact info (Phone, Email, LinkedIn, Location) with icons.
    *   **Left Column (Wider):** Place the 'Summary', 'Experience', 'Education', and 'Projects' sections here.
    *   **Right Column (Narrower):** Place a circular profile picture placeholder at the top, followed by 'Key Achievements' and 'Skills' sections.
2.  **Styling:**
    *   Use a clean, sans-serif font.
    *   Use black for text, a professional blue for headings/links, and light grey for backgrounds on skill tags.
    *   Use thin horizontal lines to separate major sections in the left column.
    *   The code must be vanilla HTML and CSS without external libraries.
    *   Ensure the layout is responsive and stacks to a single column on smaller screens.

Generate the full HTML and CSS code.`,
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
