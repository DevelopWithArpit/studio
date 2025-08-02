
'use server';

/**
 * @fileOverview Generates a comprehensive SIP report from key documents and a company name.
 * 
 * - buildAutomatedReport - A function that orchestrates the report generation.
 * - BuildAutomatedReportInput - The input type for the function.
 * - BuildAutomatedReportOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const webSearchTool = ai.defineTool(
    {
      name: 'webSearch',
      description: 'Performs a web search to find information on a given topic, company, or concept.',
      inputSchema: z.object({
        query: z.string().describe('The search query.'),
      }),
      outputSchema: z.string().describe('A summary of the search results.'),
    },
    async (input) => {
        return `Web search conducted for: "${input.query}". Key findings include... (LLM to fill in details based on its knowledge).`;
    }
);

const BuildAutomatedReportInputSchema = z.object({
  companyName: z.string().describe("The name of the company where the internship was completed."),
  certificateDataUri: z.string().describe("The internship completion certificate, as a data URI."),
  feedbackFormDataUri: z.string().describe("The feedback form from the student intern, as a data URI."),
  reportFormatDataUri: z.string().describe("A document defining the SIP report format/structure, as a data URI."),
});
export type BuildAutomatedReportInput = z.infer<typeof BuildAutomatedReportInputSchema>;

const SectionSchema = z.object({
  title: z.string().describe('The title of the report section.'),
  content: z.string().describe('The full content of the section, written in well-structured Markdown format.'),
});

const BuildAutomatedReportOutputSchema = z.object({
  title: z.string().describe('The main title of the generated SIP report.'),
  executiveSummary: z.string().describe('A brief executive summary of the report.'),
  sections: z.array(SectionSchema).describe('An array of generated sections for the report body.'),
});
export type BuildAutomatedReportOutput = z.infer<typeof BuildAutomatedReportOutputSchema>;


export async function buildAutomatedReport(input: BuildAutomatedReportInput): Promise<BuildAutomatedReportOutput> {
  return buildAutomatedReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'buildAutomatedReportPrompt',
  input: { schema: BuildAutomatedReportInputSchema },
  output: { schema: BuildAutomatedReportOutputSchema },
  tools: [webSearchTool],
  prompt: `You are an expert AI research assistant tasked with creating a comprehensive and professional Summer Internship Project (SIP) report. You will be given a company name and three key documents. Your job is to analyze the documents, conduct extensive web research to fill in all missing details, and generate a complete report based on the provided format. Your tone must be confident and authoritative; do not use speculative language like "it seems," "it's likely," or "it can be assumed."

**Key Inputs:**
1.  **Company Name:** {{{companyName}}}
2.  **Internship Certificate:** {{media url=certificateDataUri}}
3.  **Intern Feedback Form:** {{media url=feedbackFormDataUri}}
4.  **Report Format/Structure Document:** {{media url=reportFormatDataUri}}

**Your Process:**

1.  **Analyze Documents & Extract Information (Internal Research):**
    *   **Certificate:** This is a critical first step. You **must** analyze the certificate to extract the student's name, their official **internship role/title**, and the internship dates. This role is essential for the next steps.
    *   **Feedback Form:** Extract detailed personal reflections, key learnings, skills gained, and challenges faced. This is your primary source for the 'Key Learnings' and 'Challenges' sections.
    *   **Report Format Document:** This is the most important document. You **must** use this as the template for the final report. Identify all the required sections and their order (e.g., Introduction, Company Overview, Project Description, Conclusion, etc.).

2.  **Synthesize and Fill Gaps (External Research):** You will likely have missing information (e.g., project title, objectives, detailed company overview, tasks and responsibilities). Your main task is to fill these gaps using the web search tool, guided by the role extracted from the certificate.
    *   **Company Overview:** Conduct a thorough search on '{{{companyName}}}' to write a detailed overview. State the company's mission and services definitively.
    *   **Infer Project Details:** Based on the intern's **role (from the certificate)** and feedback, infer a plausible and relevant project title and objectives. Use web search to research common projects for that role at that company. Present these as the actual project details.
    *   **Elaborate on Responsibilities:** Research the typical tasks and responsibilities for the **intern's role** in the industry and at '{{{companyName}}}'. Describe these responsibilities as what the intern *did*, not what they *likely* did.
    *   **Expand on Learnings & Challenges:** Use web search to provide industry context and significance for the learnings and challenges mentioned in the feedback form.

3.  **Generate the Report:**
    *   **Title:** Create a formal title for the report.
    *   **Executive Summary:** Write a concise summary of the entire internship and report.
    *   **Sections:** Generate content for **every section** defined in the Report Format Document. Combine your findings from the document analysis and web research to write detailed, professional content for each heading.
    *   **Formatting:** Ensure all content is in well-structured Markdown.

Generate the complete, researched SIP report now.`,
});

const buildAutomatedReportFlow = ai.defineFlow(
  {
    name: 'buildAutomatedReportFlow',
    inputSchema: BuildAutomatedReportInputSchema,
    outputSchema: BuildAutomatedReportOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
