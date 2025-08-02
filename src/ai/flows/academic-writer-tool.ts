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


const webSearchTool = ai.defineTool(
    {
      name: 'webSearch',
      description: 'Performs a web search to find information on a given topic.',
      inputSchema: z.object({
        query: z.string().describe('The search query.'),
      }),
      outputSchema: z.string().describe('A summary of the search results.'),
    },
    async (input) => {
        // This is a placeholder. In a real application, you would integrate a search API.
        // For this example, we'll return a string indicating that the search was performed.
        // The LLM will use its own knowledge to supplement this.
        return `Web search conducted for: "${input.query}". Key findings include... (LLM to fill in details based on its knowledge).`;
    }
);


const GenerateAcademicDocumentInputSchema = z.object({
  topic: z.string().describe('The main topic or title of the academic document.'),
  structure: z.string().describe('The outline or structure of the document (e.g., chapter headings, section titles).'),
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
  prompt: `You are an expert academic writer and researcher. Your task is to generate a well-structured academic document based on the provided topic and structure.

**Topic:**
{{{topic}}}

**Structure / Outline:**
{{{structure}}}

**Instructions:**
1.  **Research:** Use the web search tool to gather relevant information, key points, and data about the topic.
2.  **Title:** Use the provided topic as the main title for the document.
3.  **Introduction:** Write a comprehensive introduction that sets the stage for the topic, states the problem or thesis, and outlines the document's structure.
4.  **Body Chapters/Sections:** Generate the body based on the provided structure. Flesh out each section with detailed, well-organized content, incorporating the research you have gathered.
5.  **Conclusion:** Write a strong conclusion that summarizes the key findings, restates the thesis, and suggests areas for future research.
6.  **Formatting:** All content for the introduction, chapters, and conclusion must be written in Markdown format, using headings, lists, and bold text as appropriate for academic writing.

Generate the complete document now.`,
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
