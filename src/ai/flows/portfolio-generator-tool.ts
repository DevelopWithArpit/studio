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
  prompt: `You are an expert web developer specializing in creating stylish, modern, single-page portfolios based on a provided resume text. Your task is to generate the complete HTML and CSS to replicate the layout and style of the professional resume seen in the example.

Resume Content to use:
---
{{{resumeText}}}
---

**Design & Layout Requirements:**

1.  **Overall Layout:**
    *   Create a two-column layout.
    *   The left column should be wider (approx. 65-70%) and contain the main content.
    *   The right column should be narrower (approx. 30-35%) and act as a sidebar.
    *   The entire page should have a white background.

2.  **Header Section (Spanning both columns):**
    *   Display the full name in a large, bold, black font (e.g., 'ARPIT PISE').
    *   Below the name, display the job title(s) in a smaller, blue font (e.g., 'AI Engineer / Robotics Software Engineer').
    *   Below the titles, list contact information horizontally: phone, email, LinkedIn, and location. Use small icons (Unicode or SVG) next to each item.

3.  **Left Column Content:**
    *   **SUMMARY:** A section with a heading. The paragraph text should follow.
    *   **EXPERIENCE:** A section with a main heading. Each job should be a sub-section with the job title, company name (in blue), dates, and location. Use bullet points for responsibilities.
    *   **EDUCATION:** A section with a main heading. List each degree with the institution name (in blue), dates, and location.
    *   **PROJECTS:** A section with a main heading, following the same structure as EXPERIENCE.

4.  **Right Column Content:**
    *   **Profile Picture:** A circular placeholder for a profile picture at the top. You can represent this with a simple div with a background color and the initials 'AP' in the center.
    *   **KEY ACHIEVEMENTS:** A section with a heading. List achievements with a small icon next to each.
    *   **SKILLS:** A section with a heading. Display skills as tags or badges with a light grey background.

5.  **Styling (CSS):**
    *   **Typography:** Use a clean, sans-serif font like Arial or Helvetica.
    *   **Colors:** Use black for main text, a professional blue (e.g., #007BFF) for headings, links, and titles, and grey for borders and backgrounds of skill tags.
    *   **Separators:** Use thin, black horizontal lines under each major section heading (SUMMARY, EXPERIENCE, etc.).
    *   **No External Libraries:** Do not use any external CSS frameworks like Bootstrap or Tailwind. Generate all necessary vanilla CSS.
    *   **Responsiveness:** Ensure the layout is reasonably responsive, stacking to a single column on smaller screens.

Generate the full, ready-to-use HTML and CSS code based on these precise instructions.`,
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
