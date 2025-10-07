
'use server';

/**
 * @fileOverview Summarizes one or more uploaded documents.
 * 
 * - summarizeDocument - A function that generates a summary of documents.
 * - SummarizeDocumentInput - The input type for the function.
 * - SummarizeDocumentOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const SummarizeDocumentInputSchema = z.object({
  documentDataUris: z.array(z.string()).describe("An array of documents, each as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
  length: z.enum(['Short', 'Medium', 'Long']).describe('The desired length of the summary.'),
  style: z.enum(['Bulleted List', 'Paragraph']).describe('The desired style of the summary.'),
});
export type SummarizeDocumentInput = z.infer<typeof SummarizeDocumentInputSchema>;

const SummarizeDocumentOutputSchema = z.object({
  summary: z.string().describe('The generated summary of the documents.'),
});
export type SummarizeDocumentOutput = z.infer<typeof SummarizeDocumentOutputSchema>;

export async function summarizeDocument(input: SummarizeDocumentInput): Promise<SummarizeDocumentOutput> {
  return summarizeDocumentFlow(input);
}

const summarizeDocumentFlow = ai.defineFlow(
  {
    name: 'summarizeDocumentFlow',
    inputSchema: SummarizeDocumentInputSchema,
    outputSchema: SummarizeDocumentOutputSchema,
  },
  async (input) => {
    const mediaParts = input.documentDataUris.map(uri => ({ media: { url: uri } }));

    const llmResponse = await ai.generate({
      prompt: [
        { text: `You are an expert document summarizer. Analyze the following documents and generate a single, unified summary based on the specified length and style.
        
Summary Length: ${input.length}
Summary Style: ${input.style}

Generate a concise and accurate summary.`},
        ...mediaParts,
      ],
      output: { schema: SummarizeDocumentOutputSchema },
    });

    if (!llmResponse.output) {
      throw new Error("Failed to generate summary.");
    }

    return llmResponse.output;
  }
);

    