'use server';

/**
 * @fileOverview Summarizes an uploaded document.
 * 
 * - summarizeDocument - A function that generates a summary of a document.
 * - SummarizeDocumentInput - The input type for the function.
 * - SummarizeDocumentOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const SummarizeDocumentInputSchema = z.object({
  documentDataUri: z.string().describe("A document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
  length: z.enum(['Short', 'Medium', 'Long']).describe('The desired length of the summary.'),
  style: z.enum(['Bulleted List', 'Paragraph']).describe('The desired style of the summary.'),
});
export type SummarizeDocumentInput = z.infer<typeof SummarizeDocumentInputSchema>;

const SummarizeDocumentOutputSchema = z.object({
  summary: z.string().describe('The generated summary of the document.'),
});
export type SummarizeDocumentOutput = z.infer<typeof SummarizeDocumentOutputSchema>;

export async function summarizeDocument(input: SummarizeDocumentInput): Promise<SummarizeDocumentOutput> {
  return summarizeDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeDocumentPrompt',
  input: { schema: SummarizeDocumentInputSchema },
  output: { schema: SummarizeDocumentOutputSchema },
  prompt: `You are an expert document summarizer. Analyze the following document and generate a summary based on the specified length and style.

Document:
{{media url=documentDataUri}}

Summary Length: {{{length}}}
Summary Style: {{{style}}}

Generate a concise and accurate summary.`,
});

const summarizeDocumentFlow = ai.defineFlow(
  {
    name: 'summarizeDocumentFlow',
    inputSchema: SummarizeDocumentInputSchema,
    outputSchema: SummarizeDocumentOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
