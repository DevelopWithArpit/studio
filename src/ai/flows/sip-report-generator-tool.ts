'use server';

/**
 * @fileOverview Generates a structured SIP (Summer Internship Project) report.
 * 
 * - generateSipReport - A function that generates the report content.
 * - GenerateSipReportInput - The input type for the function.
 * - GenerateSipReportOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const webSearchTool = ai.defineTool(
    {
      name: 'webSearch',
      description: 'Performs a web search to find information on a given topic.',
      inputSchema: z.object({
        query: z.string().describe('The search query for the topic to be researched.'),
      }),
      outputSchema: z.string().describe('A summary of the search results.'),
    },
    async (input) => {
        // This is a mock implementation. In a real scenario, this would call a search API.
        return `Web search conducted for: "${input.query}". Key findings include... (LLM to fill in details based on its knowledge).`;
    }
);


const GenerateSipReportInputSchema = z.object({
  studentName: z.string().describe("The student's full name."),
  studentId: z.string().describe("The student's ID number."),
  companyName: z.string().describe("The name of the company where the internship was completed."),
  internshipRole: z.string().describe("The student's role or title during the internship."),
  internshipPeriod: z.string().describe("The start and end dates of the internship (e.g., 'June 2023 - August 2023')."),
  companyOverview: z.string().describe("A brief overview of the company."),
  projectTitle: z.string().describe("The title of the main project worked on."),
  projectObjectives: z.string().describe("The objectives and goals of the project."),
  tasksAndResponsibilities: z.string().describe("The key tasks and responsibilities of the intern."),
  keyLearnings: z.string().describe("The key skills and knowledge gained during the internship."),
  challengesFaced: z.string().describe("Any challenges faced and how they were overcome."),
  conclusion: z.string().describe("A summary of the internship experience and its impact."),
});
export type GenerateSipReportInput = z.infer<typeof GenerateSipReportInputSchema>;

const SectionSchema = z.object({
  title: z.string().describe('The title of the report section.'),
  content: z.string().describe('The full content of the section, written in well-structured Markdown format.'),
});

const GenerateSipReportOutputSchema = z.object({
  title: z.string().describe('The main title of the SIP report.'),
  executiveSummary: z.string().describe('A brief executive summary of the report.'),
  sections: z.array(SectionSchema).describe('An array of generated sections for the report body.'),
});
export type GenerateSipReportOutput = z.infer<typeof GenerateSipReportOutputSchema>;

export async function generateSipReport(input: GenerateSipReportInput): Promise<GenerateSipReportOutput> {
  return generateSipReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSipReportPrompt',
  input: { schema: GenerateSipReportInputSchema },
  output: { schema: GenerateSipReportOutputSchema },
  tools: [webSearchTool],
  prompt: `You are an expert in creating professional Summer Internship Project (SIP) reports. Your task is to generate a complete, well-researched, and detailed report based on the information provided by the student.

**Student & Internship Details:**
- Name: {{{studentName}}} (ID: {{{studentId}}})
- Company: {{{companyName}}}
- Role: {{{internshipRole}}}
- Period: {{{internshipPeriod}}}

**User-Provided Information (use this as the primary source):**
1.  **Company Overview:** {{{companyOverview}}}
2.  **Project Title:** {{{projectTitle}}}
3.  **Project Objectives:** {{{projectObjectives}}}
4.  **Tasks & Responsibilities:** {{{tasksAndResponsibilities}}}
5.  **Key Learnings:** {{{keyLearnings}}}
6.  **Challenges Faced:** {{{challengesFaced}}}
7.  **Conclusion:** {{{conclusion}}}

**Instructions:**
1.  **Title:** Create a formal title for the report, such as "Summer Internship Project Report at {{{companyName}}}".
2.  **Executive Summary:** Write a concise executive summary (1-2 paragraphs) that provides an overview of the internship and the report's key contents.
3.  **Research and Expand:** For each section below, use the web search tool to gather additional information to enrich the user's provided points. Do not just repeat the user's input; expand upon it with researched details.
    - **Introduction:** Research the company '{{{companyName}}}' and combine it with the user's overview to create a comprehensive introduction.
    - **Project Description:** Research the concepts in '{{{projectTitle}}}' and '{{{projectObjectives}}}' to write a detailed project description.
    - **Roles and Responsibilities:** Elaborate on the '{{{tasksAndResponsibilities}}}' by researching standard industry practices for the '{{{internshipRole}}}' role.
    - **Key Learnings and Skill Development:** Expand on the '{{{keyLearnings}}}' by researching their importance and application in the industry.
    - **Challenges and Solutions:** For the '{{{challengesFaced}}}', research common solutions and strategies for those types of challenges.
    - **Conclusion:** Summarize the expanded findings and the user's provided '{{{conclusion}}}' to create a powerful closing statement.
4.  **Report Sections:** Generate the body of the report as a series of sections. Use the user's input plus your research to create the content for each section.
5.  **Formatting:** Ensure all content is formatted in clear, professional Markdown. Use headings, lists, and bold text appropriately.

Generate the complete, researched SIP report now.`,
});

const generateSipReportFlow = ai.defineFlow(
  {
    name: 'generateSipReportFlow',
    inputSchema: GenerateSipReportInputSchema,
    outputSchema: GenerateSipReportOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
