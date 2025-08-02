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
  prompt: `You are an expert document editor. Your task is to edit an existing Summer Internship Project (SIP) report for a student who interned at {{{companyName}}}.

You will be given:
1.  The **Existing SIP Report**.
2.  A collection of **New Documents** containing additional information (e.g., feedback, updated project details, new learnings, images).
3.  **Specific Instructions** on what changes to make.

Your goal is to intelligently integrate the information from all the **New Documents** into the **Existing SIP Report** according to the user's **Instructions**. You must maintain the original tone and structure of the report unless the instructions specify otherwise.

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

Carefully follow the instructions and provide the complete, final version of the edited report in the 'editedReportContent' field. Do not just summarize the changes; provide the full, rewritten document.`,
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
