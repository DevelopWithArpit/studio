'use server';

/**
 * @fileOverview Generates interview questions for a specified job role or topic.
 * 
 * - generateInterviewQuestions - A function that generates interview questions.
 * - GenerateInterviewQuestionsInput - The input type for the function.
 * - GenerateInterviewQuestionsOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateInterviewQuestionsInputSchema = z.object({
  topic: z.string().describe('The job role, technology, or topic for the interview questions (e.g., "Senior Frontend Developer", "React Hooks").'),
  count: z.number().int().positive().describe('The number of questions to generate.'),
  category: z.enum(['Technical', 'Behavioral', 'Situational', 'Brain-Teaser']).describe('The category of questions to generate.'),
});
export type GenerateInterviewQuestionsInput = z.infer<typeof GenerateInterviewQuestionsInputSchema>;

const QuestionSchema = z.object({
  question: z.string().describe('The interview question.'),
  expectedAnswer: z.string().describe('A brief description of what a good answer should include.'),
});

const GenerateInterviewQuestionsOutputSchema = z.object({
  questions: z.array(QuestionSchema).describe('An array of generated interview questions.'),
});
export type GenerateInterviewQuestionsOutput = z.infer<typeof GenerateInterviewQuestionsOutputSchema>;

export async function generateInterviewQuestions(input: GenerateInterviewQuestionsInput): Promise<GenerateInterviewQuestionsOutput> {
  return generateInterviewQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInterviewQuestionsPrompt',
  input: { schema: GenerateInterviewQuestionsInputSchema },
  output: { schema: GenerateInterviewQuestionsOutputSchema },
  prompt: `You are an expert interviewer and hiring manager. Your task is to generate a list of insightful interview questions.

Generate {{{count}}} {{{category}}} interview questions for the topic: "{{{topic}}}".

For each question, provide the question itself and a brief summary of what you would expect in a strong answer.
`,
});

const generateInterviewQuestionsFlow = ai.defineFlow(
  {
    name: 'generateInterviewQuestionsFlow',
    inputSchema: GenerateInterviewQuestionsInputSchema,
    outputSchema: GenerateInterviewQuestionsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
