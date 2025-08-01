'use server';

/**
 * @fileOverview Generates a structured thesis based on a topic and research notes.
 * 
 * - generateThesis - A function that generates thesis content.
 * - GenerateThesisInput - The input type for the function.
 * - GenerateThesisOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateThesisInputSchema = z.object({
  topic: z.string().describe('The central topic or title of the thesis.'),
  researchNotes: z.string().optional().describe('User-provided research notes, sources, or key points to include.'),
  numChapters: z.number().int().min(1).max(10).describe('The number of chapters to generate for the thesis body.'),
});
export type GenerateThesisInput = z.infer<typeof GenerateThesisInputSchema>;

const ChapterSchema = z.object({
  title: z.string().describe('The title of the chapter.'),
  content: z.string().describe('The full content of the chapter, written in well-structured Markdown format.'),
});

const GenerateThesisOutputSchema = z.object({
  title: z.string().describe('The main title of the generated thesis.'),
  introduction: z.string().describe('The content of the introduction chapter in Markdown format.'),
  chapters: z.array(ChapterSchema).describe('An array of generated chapters for the thesis body.'),
  conclusion: z.string().describe('The content of the conclusion chapter in Markdown format.'),
});
export type GenerateThesisOutput = z.infer<typeof GenerateThesisOutputSchema>;

export async function generateThesis(input: GenerateThesisInput): Promise<GenerateThesisOutput> {
  return generateThesisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateThesisPrompt',
  input: { schema: GenerateThesisInputSchema },
  output: { schema: GenerateThesisOutputSchema },
  prompt: `You are an expert academic writer and thesis generator. Your task is to generate a well-structured thesis based on the user's topic and research notes.

**Thesis Topic:** {{{topic}}}

**Number of Body Chapters:** {{{numChapters}}}

{{#if researchNotes}}
**User's Research Notes & Key Points:**
---
{{{researchNotes}}}
---
You must incorporate these notes and points into the thesis content where appropriate.
{{/if}}

**Instructions:**
1.  **Title:** Create a compelling and academic title for the thesis.
2.  **Introduction:** Write a comprehensive introduction that sets the stage, states the problem or thesis statement, and outlines the structure of the document.
3.  **Body Chapters:** Generate exactly {{{numChapters}}} body chapters. Each chapter must have a clear title and substantial, well-organized content. The content should flow logically from one chapter to the next.
4.  **Conclusion:** Write a strong conclusion that summarizes the key findings, restates the thesis, and suggests areas for future research.
5.  **Formatting:** All content for the introduction, chapters, and conclusion must be written in Markdown format, using headings, lists, and bold text as appropriate for academic writing.

Generate the complete thesis structure now.`,
});

const generateThesisFlow = ai.defineFlow(
  {
    name: 'generateThesisFlow',
    inputSchema: GenerateThesisInputSchema,
    outputSchema: GenerateThesisOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
