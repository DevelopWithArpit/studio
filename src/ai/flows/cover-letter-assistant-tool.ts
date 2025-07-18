'use server';

/**
 * @fileOverview Assists users in generating a cover letter.
 * 
 * - generateCoverLetter - A function that generates a cover letter.
 * - GenerateCoverLetterInput - The input type for the function.
 * - GenerateCoverLetterOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateCoverLetterInputSchema = z.object({
  jobDescription: z.string().describe('The full job description the user is applying for.'),
  userInfo: z.string().describe('Information about the user, such as their resume, key skills, and relevant experience.'),
  tone: z.enum(['Professional', 'Enthusiastic', 'Formal', 'Creative']).describe('The desired tone for the cover letter.'),
});
export type GenerateCoverLetterInput = z.infer<typeof GenerateCoverLetterInputSchema>;

const GenerateCoverLetterOutputSchema = z.object({
  coverLetter: z.string().describe('The generated cover letter text, formatted in Markdown.'),
});
export type GenerateCoverLetterOutput = z.infer<typeof GenerateCoverLetterOutputSchema>;

export async function generateCoverLetter(input: GenerateCoverLetterInput): Promise<GenerateCoverLetterOutput> {
  return generateCoverLetterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCoverLetterPrompt',
  input: { schema: GenerateCoverLetterInputSchema },
  output: { schema: GenerateCoverLetterOutputSchema },
  prompt: `You are an expert career coach specializing in writing compelling cover letters. Your task is to generate a cover letter based on the provided job description and user information.

The tone of the cover letter should be: {{{tone}}}.

Tailor the letter to highlight how the user's skills and experience match the requirements in the job description. The letter should be professional, engaging, and concise.

Job Description:
---
{{{jobDescription}}}
---

User Information / Resume:
---
{{{userInfo}}}
---

Generate the cover letter now.`,
});

const generateCoverLetterFlow = ai.defineFlow(
  {
    name: 'generateCoverLetterFlow',
    inputSchema: GenerateCoverLetterInputSchema,
    outputSchema: GenerateCoverLetterOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
