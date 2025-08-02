'use server';

/**
 * @fileOverview Generates a structured academic document based on a topic and research notes.
 * 
 * - generateAcademicDocument - A function that generates academic document content.
 * - GenerateAcademicDocumentInput - The input type for the function.
 * - GenerateAcademicDocumentOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateAcademicDocumentInputSchema = z.object({
  documentDataUri: z.string().describe("A document containing the topic, outline, and research notes for the academic paper, as a data URI. Format: 'data:<mimetype>;base64,<encoded_data>'."),
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
  prompt: `You are an expert academic writer. Your task is to generate a well-structured academic document based on the user's uploaded file, which contains the topic, an outline, and research notes.

**Uploaded Document:**
{{media url=documentDataUri}}

**Instructions:**
1.  **Analyze the Document:** Carefully analyze the provided document to identify the main topic, the structure (chapters, sections), headings, and any key research points or data. You will adapt the tone and format based on the content of the document.
2.  **Title:** Extract or create a compelling and academic title for the document based on its content.
3.  **Introduction:** Write a comprehensive introduction that sets the stage, states the problem or thesis statement, and outlines the structure of the document, following the provided outline.
4.  **Body Chapters/Sections:** Generate the body based on the structure and headings found in the uploaded document. Flesh out each section with detailed, well-organized content, incorporating the research notes and key points provided.
5.  **Conclusion:** Write a strong conclusion that summarizes the key findings, restates the thesis, and suggests areas for future research.
6.  **Formatting:** All content for the introduction, chapters, and conclusion must be written in Markdown format, using headings, lists, and bold text as appropriate for academic writing.

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
