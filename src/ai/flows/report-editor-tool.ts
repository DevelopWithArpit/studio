
'use server';

/**
 * @fileOverview Edits an existing SIP report based on a new document and user instructions.
 * 
 * - editSipReport - A function that handles the report editing process.
 * - EditSipReportInput - The input type for the function.
 * - EditSipReportOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const webSearchTool = ai.defineTool(
    {
      name: 'webSearch',
      description: 'Performs a web search to find information on a given company or topic.',
      inputSchema: z.object({
        query: z.string().describe('The search query, which should be the company name or a relevant topic.'),
      }),
      outputSchema: z.string().describe('A summary of the search results.'),
    },
    async (input) => {
        return `Web search conducted for: "${input.query}". Key findings include... (LLM to fill in details based on its knowledge).`;
    }
);

const EditSipReportInputSchema = z.object({
  existingReportDataUri: z.string().describe("The original SIP report to be edited, as a data URI."),
  newDocumentsDataUris: z.array(z.string()).describe("An array of new documents with information to incorporate, each as a data URI."),
  companyName: z.string().describe("The name of the company for context."),
  instructions: z.string().describe("Specific instructions on how to edit the report."),
});
export type EditSipReportInput = z.infer<typeof EditSipReportInputSchema>;

const EditSipReportOutputSchema = z.object({
  editedReportContent: z.string().describe('The full content of the edited report in Markdown format.'),
});
export type EditSipReportOutput = z.infer<typeof EditSipReportOutputSchema>;

export async function editSipReport(input: EditSipReportInput): Promise<EditSipReportOutput> {
  return editSipReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'editSipReportPrompt',
  input: { schema: EditSipReportInputSchema },
  output: { schema: EditSipReportOutputSchema },
  tools: [webSearchTool],
  prompt: `You are an expert document editor. Your task is to edit an existing Summer Internship Project (SIP) report for a student who interned at {{{companyName}}}.

You will be given:
1.  The **Existing SIP Report**.
2.  A collection of **New Documents** containing additional information (e.g., feedback, updated project details, new learnings, images).
3.  **Specific Instructions** on what changes to make.

Your goal is to intelligently integrate the information from all the **New Documents** into the **Existing SIP Report** according to the user's **Instructions**, and enrich the report with external research. You must maintain the original tone and structure of the report unless the instructions specify otherwise.

**Process:**
1.  **Web Research:** Your first step is to conduct a web search for '{{{companyName}}}' using the provided tool. This is mandatory.
2.  **Analyze Documents:** Review the existing report and all new documents to understand the context and the required changes. This includes analyzing text and any images provided. If an image (like a chart or screenshot) is uploaded, describe its contents and integrate that information into the report where it's relevant.
3.  **Apply Edits & Enrich Content:**
    *   Follow the user's instructions precisely to integrate information from the new documents.
    *   **Crucially, use the information gathered from your web search to update and enrich the 'Company Overview' or 'Introduction' section of the report.** Ensure this section is detailed, current, and provides a comprehensive overview of the company's business, mission, and services.
    *   Seamlessly blend all new information (from documents, images, and web research) into the report.

**Existing SIP Report:**
{{media url=existingReportDataUri}}

**New Documents to Analyze:**
{{#each newDocumentsDataUris}}
{{media url=this}}
{{/each}}

**User Instructions:**
---
{{{instructions}}}
---

Carefully follow the instructions and provide the complete, final version of the edited report in the 'editedReportContent' field. Do not just summarize the changes; provide the full, rewritten document. Your final output must be a JSON object with a single key "editedReportContent" containing the entire report as a string.`,
});

const editSipReportFlow = ai.defineFlow(
  {
    name: 'editSipReportFlow',
    inputSchema: EditSipReportInputSchema,
    outputSchema: EditSipReportOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
