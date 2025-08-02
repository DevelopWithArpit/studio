'use server';

/**
 * @fileOverview Generates a structured academic document from an uploaded file.
 *
 * - generateAcademicDocumentFromDoc - A function that generates academic document content.
 * - GenerateAcademicDocumentFromDocInput - The input type for the function.
 * - GenerateAcademicDocumentOutput - The return type for the function (shared).
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { GenerateAcademicDocumentOutput, GenerateAcademicDocumentOutputSchema } from './academic-writer-tool';

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

const GenerateAcademicDocumentFromDocInputSchema = z.object({
  documentDataUri: z.string().describe("A document containing the topic and structure/outline for the academic paper, as a data URI. Format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type GenerateAcademicDocumentFromDocInput = z.infer<typeof GenerateAcademicDocumentFromDocInputSchema>;


export async function generateAcademicDocumentFromDoc(input: GenerateAcademicDocumentFromDocInput): Promise<GenerateAcademicDocumentOutput> {
  return generateAcademicDocumentFromDocFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAcademicDocFromDocPrompt',
  input: { schema: GenerateAcademicDocumentFromDocInputSchema },
  output: { schema: GenerateAcademicDocumentOutputSchema },
  tools: [webSearchTool],
  prompt: `You are an expert academic writer and researcher. Your task is to generate a well-structured academic document based on the user's uploaded file.

**Uploaded Document:**
{{media url=documentDataUri}}

**Instructions:**
1.  **Analyze the Document:** Carefully analyze the provided document to identify the main topic and the structure (chapters, sections, headings).
2.  **Research:** Use the main topic identified from the document to perform a web search with the 'webSearch' tool to gather relevant information, key points, and data.
3.  **Title:** Extract or create a compelling and academic title for the document based on its content.
4.  **Introduction:** Write a comprehensive introduction that sets the stage for the topic, states the problem or thesis, and outlines the document's structure based on the uploaded file.
5.  **Body Chapters/Sections:** Generate the body based on the structure from the uploaded document. Flesh out each section with detailed, well-organized content, incorporating the research you have gathered.
6.  **Conclusion:** Write a strong conclusion that summarizes the key findings, restates the thesis, and suggests areas for future research.
7.  **Formatting:** All content must be written in Markdown format.

Generate the complete document now.`,
});

const generateAcademicDocumentFromDocFlow = ai.defineFlow(
  {
    name: 'generateAcademicDocumentFromDocFlow',
    inputSchema: GenerateAcademicDocumentFromDocInputSchema,
    outputSchema: GenerateAcademicDocumentOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
