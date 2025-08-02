'use server';

/**
 * @fileOverview Generates a structured academic document based on a topic, structure, and research notes.
 *
 * - generateAcademicDocument - A function that generates academic document content.
 * - GenerateAcademicDocumentInput - The input type for the function.
 * - GenerateAcademicDocumentOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateAcademicDocumentInputSchema = z.object({
  topic: z.string().describe('The main topic or title of the academic document.'),
  structure: z.string().describe('The outline or structure of the document (e.g., chapter headings, section titles).'),
  researchNotes: z.string().describe('The research notes, key points, and data to be included in the document.'),
});
export type GenerateAcademicDocumentInput = z.infer<typeof GenerateAcademicDocumentInputSchema>;

const ChapterSchema = z.object({
  title: z.string().describe('The title of the chapter or section.'),
  content: z.string().describe('The full content of the chapter/section, written in well-structured Markdown format.'),
});

const GenerateAcademicDocumentOutputSchema = z.object({
  title: z.string().describe('The main title of the generated document.'),
  introduction: z.string().describe('The content of the introduction chapter in Markdown format.'),
  chapters: z.array(ChapterSchema).describe('An array of generated chapters or sections for the document body.'),
  conclusion: z.string().describe('The content of the conclusion chapter in Markdown format.'),
});
export type GenerateAcademicDocumentOutput = z.infer<typeof GenerateAcademicDocumentOutputSchema>;

export async function generateAcademicDocument(input: GenerateAcademicDocumentInput): Promise<GenerateAcademicDocumentOutput> {
  return generateAcademicDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAcademicDocumentPrompt',
  input: { schema: GenerateAcademicDocumentInputSchema },
  output: { schema: GenerateAcademicDocumentOutputSchema },
  prompt: `You are an expert academic writer. Your task is to generate a well-structured academic document (e.g., Thesis, Research Paper, Essay) based on the provided topic, structure, and research notes.

**Topic:**
{{{topic}}}

**Structure / Outline:**
{{{structure}}}

**Research Notes & Key Points:**
{{{researchNotes}}}

**Instructions:**
1.  **Title:** Use the provided topic as the main title for the document.
2.  **Introduction:** Write a comprehensive introduction that sets the stage for the topic, states the problem or thesis, and outlines the document's structure.
3.  **Body Chapters/Sections:** Generate the body based on the provided structure. Flesh out each section with detailed, well-organized content, incorporating the research notes and key points.
4.  **Conclusion:** Write a strong conclusion that summarizes the key findings, restates the thesis, and suggests areas for future research.
5.  **Formatting:** All content for the introduction, chapters, and conclusion must be written in Markdown format, using headings, lists, and bold text as appropriate for academic writing.

Generate the complete document structure now.`,
});

const generateAcademicDocumentFlow = ai.defineFlow(
  {
    name: 'generateAcademicDocumentFlow',
    inputSchema: GenerateAcademicDocumentInputSchema,
    outputSchema: GenerateAcademicDocumentOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
