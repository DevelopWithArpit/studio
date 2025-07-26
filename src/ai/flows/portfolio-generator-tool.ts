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

const GeneratePortfolioWebsiteInputSchema = z.object({
  resumeContent: z.string().describe("The user's full resume content, either as plain text or a data URI for a document (data:<mimetype>;base64,<encoded_data>)."),
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

const generatePortfolioWebsiteFlow = ai.defineFlow(
  {
    name: 'generatePortfolioWebsiteFlow',
    inputSchema: GeneratePortfolioWebsiteInputSchema,
    outputSchema: GeneratePortfolioWebsiteOutputSchema,
  },
  async (input) => {
    let documentPrompt = '';
    let promptInput: Record<string, any> = {};

    if (input.resumeContent.startsWith('data:')) {
      documentPrompt = 'Resume Document: {{media url=resumeContent}}';
      promptInput.resumeContent = input.resumeContent;
    } else {
      documentPrompt = 'Resume Text:\n{{{resumeContent}}}';
      promptInput.resumeContent = input.resumeContent;
    }

    const prompt = ai.definePrompt({
        name: 'generatePortfolioWebsitePrompt',
        output: { schema: GeneratePortfolioWebsiteOutputSchema },
        prompt: `You are an expert web developer specializing in creating stunning, professional, and modern single-page portfolio websites.

Your task is to analyze the provided resume content and generate the complete HTML, CSS, and JavaScript code for a portfolio website.

**Design Requirements:**
- **Visuals:** Clean, modern aesthetic with a dark theme. Use a professional font like 'Inter' or 'Poppins'.
- **Animations:** Implement subtle on-scroll reveal animations for sections and project cards. Add a gentle particle effect to the hero section background.
- **Layout:** The website must be fully responsive and look great on all screen sizes (desktop, tablet, and mobile).
- **Structure:** Create a single HTML file with a sticky navigation bar and clearly defined sections for:
    1.  **Hero (Homepage):** A brief introduction with name, headline, and a call-to-action button to the projects section.
    2.  **About:** A detailed section with biography and personal interests.
    3.  **Experience:** A timeline or list of professional roles.
    4.  **Education:** A list of educational qualifications.
    5.  **Projects:** A grid of project cards, each with an image, title, description, and link. Use placeholder images if none are provided in the resume. For project links, use the user's GitHub profile if available, otherwise link to github.com.
    6.  **Skills:** A section to display technical and professional skills.
    7.  **Contact:** A footer with contact email and social media links.
- **Code:** Generate clean, well-commented, and separate HTML, CSS, and JavaScript code. The CSS should be self-contained and not rely on external frameworks like Tailwind or Bootstrap. The JS should be vanilla JavaScript, not using jQuery or other libraries.

**Resume Content to Analyze:**
---
${documentPrompt}
---

From the resume content, extract all the necessary information: Full Name, Headline, About Me, Contact Email, Social Links (LinkedIn, GitHub, Twitter), Experience, Education, Skills, and Projects. If project details are sparse, create a sample project based on the user's skills and experience.

Generate the complete, ready-to-use code now.`,
    });

    const { output } = await prompt(promptInput);
    return output!;
  }
);
