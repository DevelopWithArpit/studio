'use server';

/**
 * @fileOverview Smart Search Tool flow. Analyzes a document to extract key information.
 *
 * - smartSearch - A function that handles the document analysis process.
 * - SmartSearchInput - The input type for the smartSearch function.
 * - SmartSearchOutput - The return type for the smartSearch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartSearchInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "A document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  query: z.string().describe('The user query for extracting specific information from the document.'),
});
export type SmartSearchInput = z.infer<typeof SmartSearchInputSchema>;

const SmartSearchOutputSchema = z.object({
  summary: z.string().describe('A summary of the key information extracted from the document based on the user query.'),
});
export type SmartSearchOutput = z.infer<typeof SmartSearchOutputSchema>;

// Define a tool for getting the weather
const getWeatherTool = ai.defineTool(
    {
      name: 'getWeatherTool',
      description: 'Get the weather forecast for a given location.',
      inputSchema: z.object({
        location: z.string().describe('The location to get the weather for.'),
      }),
      outputSchema: z.string(),
    },
    async (input) => {
      // In a real application, you would call a weather API here.
      // For this example, we'll return mock data.
      return `The weather in ${input.location} is 72°F and sunny.`;
    }
);


export async function smartSearch(input: SmartSearchInput): Promise<SmartSearchOutput> {
  return smartSearchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartSearchPrompt',
  input: {schema: SmartSearchInputSchema},
  output: {schema: SmartSearchOutputSchema},
  tools: [getWeatherTool],
  prompt: `You are an expert document analyzer. Your task is to extract key information from the document provided, based on the user's query.

If the user asks about the weather, use the getWeatherTool to provide a weather forecast. Otherwise, analyze the provided document.

Document: {{media url=documentDataUri}}

User Query: {{{query}}}

Provide a concise summary of the key information that answers the user's query.`,
});

const smartSearchFlow = ai.defineFlow(
  {
    name: 'smartSearchFlow',
    inputSchema: SmartSearchInputSchema,
    outputSchema: SmartSearchOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
