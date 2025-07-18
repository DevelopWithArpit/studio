'use server';

/**
 * @fileOverview Suggests career paths based on user interests and skills.
 * 
 * - suggestCareerPaths - A function that suggests career paths.
 * - SuggestCareerPathsInput - The input type for the function.
 * - SuggestCareerPathsOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const SuggestCareerPathsInputSchema = z.object({
  interests: z.string().describe('A description of the user\'s interests and passions.'),
  skills: z.string().describe('A description of the user\'s existing skills and experience.'),
});
export type SuggestCareerPathsInput = z.infer<typeof SuggestCareerPathsInputSchema>;

const CareerPathSchema = z.object({
  title: z.string().describe('The title of the suggested career path.'),
  description: z.string().describe('A detailed description of the career path, including day-to-day responsibilities and why it fits the user\'s profile.'),
  requiredSkills: z.array(z.string()).describe('A list of key skills required for this career.'),
});

const SuggestCareerPathsOutputSchema = z.object({
  careerPaths: z.array(CareerPathSchema).describe('An array of suggested career paths.'),
});
export type SuggestCareerPathsOutput = z.infer<typeof SuggestCareerPathsOutputSchema>;

export async function suggestCareerPaths(input: SuggestCareerPathsInput): Promise<SuggestCareerPathsOutput> {
  return suggestCareerPathsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCareerPathsPrompt',
  input: { schema: SuggestCareerPathsInputSchema },
  output: { schema: SuggestCareerPathsOutputSchema },
  prompt: `You are an expert career counselor. Based on the user's interests and skills, suggest three distinct and relevant career paths.

User Interests:
{{{interests}}}

User Skills:
{{{skills}}}

For each suggested career path, provide a title, a detailed description, and a list of essential skills.`,
});

const suggestCareerPathsFlow = ai.defineFlow(
  {
    name: 'suggestCareerPathsFlow',
    inputSchema: SuggestCareerPathsInputSchema,
    outputSchema: SuggestCareerPathsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
