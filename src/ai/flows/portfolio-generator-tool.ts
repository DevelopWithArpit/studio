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
  prompt: `You are an expert web developer specializing in creating stylish, modern, single-page portfolios.
Your task is to generate the complete HTML and CSS for a portfolio website based on the provided resume text.

Resume Content:
---
{{{resumeText}}}
---

**Requirements:**
1.  **HTML Structure:**
    *   Create a clean, semantic HTML structure.
    *   Include a header with the person's name and title.
    *   Create sections for "About Me", "Work Experience", "Education", and "Skills".
    *   Use appropriate tags (e.g., \`<header>\`, \`<section>\`, \`<h2>\`, \`<p>\`, \`<ul>\`).
2.  **CSS Styling:**
    *   Generate all necessary CSS. Do NOT use any external frameworks like Tailwind or Bootstrap.
    *   The design should be modern, professional, and fully responsive.
    *   Use a dark theme with a color palette of your choice (e.g., dark grays, blues, and a highlight color).
    *   Style all elements, including typography, spacing, and layout.
    *   Ensure the final output is visually appealing.

Generate the full HTML and CSS code. The code should be ready to be dropped into files and rendered in a browser.`,
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
