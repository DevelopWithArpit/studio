
'use server';

/**
 * @fileOverview Generates a structured academic document from a topic and either a text-based structure or an uploaded document.
 *
 * - generateAcademicDocument - A function that generates academic document content.
 * - GenerateAcademicDocumentInput - The input type for the function.
 * - GenerateAcademicDocumentOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const webSearchTool = ai.defineTool(
    {
      name: 'webSearch',
      description: 'Performs a web search to find information on a given topic.',
      inputSchema: z.object({
        query: z.string().describe('The search query, which should be the main topic of the document.'),
      }),
      outputSchema: z.string().describe('A summary of the search results.'),
    },
    async (input) => {
        return `Web search conducted for: "${input.query}". Key findings include... (LLM to fill in details based on its knowledge).`;
    }
);

const GenerateAcademicDocumentInputSchema = z.object({
  topic: z.string().describe('The main topic or title of the academic document.'),
  structureText: z.string().optional().describe('The outline or structure of the document as text.'),
  structureDataUri: z.string().optional().describe("A document containing the structure/outline, as a data URI. Format: 'data:<mimetype>;base64,<encoded_data>'."),
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
  tools: [webSearchTool],
  prompt: `You are an expert academic writer and researcher. Your task is to generate a well-structured academic document based on the provided topic and structure. Your highest priority is to replicate the provided structure with absolute precision.

**Topic:**
{{{topic}}}

**Structure / Outline Source:**
{{#if structureText}}
**From Text:**
{{{structureText}}}
{{/if}}
{{#if structureDataUri}}
**From Document:**
{{media url=structureDataUri}}
{{/if}}

**Instructions:**
1.  **Analyze Structure:** This is the most critical step. **You must strictly adhere** to the provided structure from either the text input or the uploaded document. Replicate the hierarchy of chapters, sections, and headings exactly as specified. Do not deviate, add, or remove sections. The output's organization must be a mirror of the input structure.
2.  **Research:** Use the web search tool with the topic to gather relevant information, key points, and data to flesh out the content for each section defined in the structure.
3.  **Title:** Use the provided topic as the main title for the document.
4.  **Introduction:** Write a comprehensive introduction that sets the stage for the topic, states the problem or thesis, and outlines the document's structure, following the provided structure.
5.  **Body Chapters/Sections:** Generate the body content for each section defined in the source structure. Ensure the content is detailed, well-organized, and incorporates the research you have gathered.
6.  **Conclusion:** Write a strong conclusion that summarizes the key findings, restates the thesis, and suggests areas for future research, as dictated by the structure.
7.  **Formatting:** All content for the introduction, chapters, and conclusion must be written in Markdown format.

Generate the complete document now, following the provided structure precisely.`,
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

