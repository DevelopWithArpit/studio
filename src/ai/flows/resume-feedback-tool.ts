'use server';

/**
 * @fileOverview Provides AI-powered feedback on a user's resume.
 * 
 * - getResumeFeedback - Analyzes a resume and provides feedback and a rewritten version.
 * - GetResumeFeedbackInput - The input type for the function.
 * - GetResumeFeedbackOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GetResumeFeedbackInputSchema = z.object({
  resume: z.string().describe("The user's resume content, either as plain text or a data URI for a document (data:<mimetype>;base64,<encoded_data>)."),
  targetJobRole: z.string().optional().describe('The specific job role the user is targeting.'),
  additionalInfo: z.string().optional().describe('Any other information or context the user wants to provide.'),
});
export type GetResumeFeedbackInput = z.infer<typeof GetResumeFeedbackInputSchema>;

const GetResumeFeedbackOutputSchema = z.object({
  feedback: z.string().describe('Detailed, constructive feedback on the resume, formatted as Markdown. Include sections for strengths, weaknesses, and specific suggestions for improvement.'),
  rewrittenResume: z.string().describe('A professionally rewritten version of the resume, structured and formatted for clarity and impact.'),
});
export type GetResumeFeedbackOutput = z.infer<typeof GetResumeFeedbackOutputSchema>;

export async function getResumeFeedback(input: GetResumeFeedbackInput): Promise<GetResumeFeedbackOutput> {
  return getResumeFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getResumeFeedbackPrompt',
  input: { schema: GetResumeFeedbackInputSchema },
  output: { schema: GetResumeFeedbackOutputSchema },
  prompt: `You are an expert career coach and professional resume writer. Your task is to provide a comprehensive review of the user's resume.

The user's resume is provided below.
{{#if targetJobRole}}The user is targeting the role of: {{{targetJobRole}}}{{/if}}
{{#if additionalInfo}}Additional context from the user: {{{additionalInfo}}}{{/if}}

Resume content:
{{#if resume}}
  {{#if (startsWith resume "data:")}}
    {{media url=resume}}
  {{else}}
    {{{resume}}}
  {{/if}}
{{/if}}

Please perform the following two tasks:
1.  **Provide Detailed Feedback:** Analyze the resume for clarity, impact, formatting, and relevance to the target role (if provided). Give constructive feedback in Markdown format, with clear sections for "Strengths", "Areas for Improvement", and "Actionable Suggestions".
2.  **Rewrite the Resume:** Provide a professionally rewritten version of the resume. Structure it logically with clear headings (e.g., "Summary", "Experience", "Education", "Skills"). Use action verbs and quantify achievements where possible. Ensure the output is clean, well-formatted text.
`,
});

// Helper for handlebars
function startsWith(str: string, prefix: string) {
  return str.startsWith(prefix);
}

const getResumeFeedbackFlow = ai.defineFlow(
  {
    name: 'getResumeFeedbackFlow',
    inputSchema: GetResumeFeedbackInputSchema,
    outputSchema: GetResumeFeedbackOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input, { custom: { startsWith } });
    return output!;
  }
);
