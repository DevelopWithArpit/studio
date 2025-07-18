'use server';

/**
 * @fileOverview Provides a code analysis tool that identifies potential errors, performance issues, and security vulnerabilities.
 *
 * - analyzeCode - Analyzes the given code and returns a report of identified issues.
 * - AnalyzeCodeInput - The input type for the analyzeCode function.
 * - AnalyzeCodeOutput - The return type for the analyzeCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCodeInputSchema = z.object({
  code: z.string().describe('The code to be analyzed.'),
  language: z.string().describe('The programming language of the code.'),
  constraints: z.string().optional().describe('Constraints to apply during evaluation, e.g., maximum memory usage, execution time limits.'),
});

export type AnalyzeCodeInput = z.infer<typeof AnalyzeCodeInputSchema>;

const AnalyzeCodeOutputSchema = z.object({
  report: z.string().describe('A report of identified errors, performance problems, and security issues.'),
});

export type AnalyzeCodeOutput = z.infer<typeof AnalyzeCodeOutputSchema>;

export async function analyzeCode(input: AnalyzeCodeInput): Promise<AnalyzeCodeOutput> {
  return analyzeCodeFlow(input);
}

const analyzeCodePrompt = ai.definePrompt({
  name: 'analyzeCodePrompt',
  input: {schema: AnalyzeCodeInputSchema},
  output: {schema: AnalyzeCodeOutputSchema},
  prompt: `You are a code analyzer expert. Analyze the following code and provide a report of any errors, possible performance problems, and security issues.

Language: {{{language}}}
Code:
{{{code}}}

Constraints: {{constraints}}

Report:
`,
});

const analyzeCodeFlow = ai.defineFlow(
  {
    name: 'analyzeCodeFlow',
    inputSchema: AnalyzeCodeInputSchema,
    outputSchema: AnalyzeCodeOutputSchema,
  },
  async input => {
    const {output} = await analyzeCodePrompt(input);
    return output!;
  }
);
