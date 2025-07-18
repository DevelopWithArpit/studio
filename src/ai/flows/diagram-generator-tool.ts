'use server';

/**
 * @fileOverview Generates diagrams from a textual description.
 *
 * - generateDiagram - A function that generates a diagram image.
 * - GenerateDiagramInput - The input type for the function.
 * - GenerateDiagramOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateDiagramInputSchema = z.object({
  description: z.string().describe('A detailed textual description of the diagram to be generated. Include nodes, connections, and labels.'),
});
export type GenerateDiagramInput = z.infer<typeof GenerateDiagramInputSchema>;

const GenerateDiagramOutputSchema = z.object({
  diagramUrl: z.string().describe('The data URI of the generated diagram image.'),
});
export type GenerateDiagramOutput = z.infer<typeof GenerateDiagramOutputSchema>;

export async function generateDiagram(input: GenerateDiagramInput): Promise<GenerateDiagramOutput> {
  return generateDiagramFlow(input);
}

const generateDiagramFlow = ai.defineFlow(
  {
    name: 'generateDiagramFlow',
    inputSchema: GenerateDiagramInputSchema,
    outputSchema: GenerateDiagramOutputSchema,
  },
  async ({ description }) => {
    const prompt = `Generate a clear, high-quality diagram based on the following description. The diagram should be visually clean and easy to understand, suitable for a technical presentation.

Description: "${description}"

Ensure the output is a well-structured diagram. For example, for a flowchart, use standard shapes for start/end, process, and decision points. For a system architecture, use clear icons and labels for components.`;

    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: prompt,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media?.url) {
      throw new Error('Failed to generate diagram.');
    }

    return { diagramUrl: media.url };
  }
);
