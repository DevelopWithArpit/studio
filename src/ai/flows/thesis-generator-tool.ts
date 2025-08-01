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
  documentDataUri: z.string().describe("A document containing the thesis topic, outline, and research notes, as a data URI. Format: 'data:<mimetype>;base64,<encoded_data>'."),
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
  prompt: `You are an expert academic writer and thesis generator. Your task is to generate a well-structured thesis based on the user's uploaded document, which contains the topic, an outline, and research notes.

**Uploaded Document:**
{{media url=documentDataUri}}

**Instructions:**
1.  **Analyze the Document:** Carefully analyze the provided document to identify the main topic, the chapter structure, headings, and any key research points or data.
2.  **Title:** Extract or create a compelling and academic title for the thesis based on the document's content.
3.  **Introduction:** Write a comprehensive introduction that sets the stage, states the problem or thesis statement, and outlines the structure of the document, following the provided outline.
4.  **Body Chapters:** Generate the body chapters based on the structure and headings found in the uploaded document. Flesh out each section with detailed, well-organized content, incorporating the research notes and key points provided.
5.  **Conclusion:** Write a strong conclusion that summarizes the key findings, restates the thesis, and suggests areas for future research.
6.  **Formatting:** All content for the introduction, chapters, and conclusion must be written in Markdown format, using headings, lists, and bold text as appropriate for academic writing.

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
