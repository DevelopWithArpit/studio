'use server';

/**
 * @fileOverview Provides AI-powered feedback on a user's resume, focusing on ATS optimization.
 * 
 * - getResumeFeedback - Analyzes a resume and provides feedback and a rewritten version.
 * - GetResumeFeedbackInput - The input type for the function.
 * - GetResumeFeedbackOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GetResumeFeedbackInputSchema = z.object({
  resume: z.string().describe("The user's resume content, either as plain text or a data URI for a document (data:<mimetype>;base64,<encoded_data>)."),
  targetJobRole: z.string().optional().describe('The specific job role the user is targeting.'),
  additionalInfo: z.string().optional().describe('Any other information or context the user wants to provide.'),
});
export type GetResumeFeedbackInput = z.infer<typeof GetResumeFeedbackInputSchema>;

const RewrittenResumeSchema = z.object({
    name: z.string().describe("The user's full name."),
    contact: z.object({
        phone: z.string().describe("The user's phone number."),
        email: z.string().describe("The user's email address."),
        linkedin: z.string().describe("The user's LinkedIn profile URL."),
        github: z.string().optional().describe("The user's GitHub profile URL."),
        location: z.string().describe("The user's city and country."),
    }).describe("The user's contact information."),
    summary: z.string().describe("A 2-3 sentence professional summary."),
    experience: z.array(z.object({
        title: z.string().describe("The job title."),
        company: z.string().describe("The company name."),
        dates: z.string().describe("The dates of employment (e.g., 'June 2023 - Present')."),
        bullets: z.array(z.string()).describe("A list of 2-4 bullet points describing achievements and responsibilities, starting with strong action verbs and quantifying results where possible.")
    })).describe("A list of professional experiences."),
    education: z.array(z.object({
        degree: z.string().describe("The degree obtained (e.g., 'B.Tech in Robotics and Artificial Intelligence')."),
        school: z.string().describe("The name of the university or school."),
        dates: z.string().describe("The dates of attendance."),
        location: z.string().describe("The location of the school."),
    })).describe("A list of educational qualifications."),
    projects: z.array(z.object({
        title: z.string().describe("The project title."),
        bullets: z.array(z.string()).describe("A list of bullet points describing the project.")
    })).describe("A list of relevant projects."),
    skills: z.object({
        technical: z.array(z.string()).describe("A list of technical skills (e.g., programming languages, tools, frameworks)."),
        other: z.array(z.string()).optional().describe("A list of other relevant skills."),
    }).describe("A categorized list of skills."),
    achievements: z.array(z.string()).describe("A list of key achievements."),
});

const GetResumeFeedbackOutputSchema = z.object({
  feedback: z.string().describe('Detailed, constructive feedback on the resume, formatted as Markdown. Include sections for strengths, weaknesses, and specific suggestions for improvement.'),
  rewrittenResume: RewrittenResumeSchema.describe('A professionally rewritten version of the resume, structured as a JSON object.'),
});
export type GetResumeFeedbackOutput = z.infer<typeof GetResumeFeedbackOutputSchema>;

export async function getResumeFeedback(input: GetResumeFeedbackInput): Promise<GetResumeFeedbackOutput> {
  return getResumeFeedbackFlow(input);
}

const getResumeFeedbackFlow = ai.defineFlow(
  {
    name: 'getResumeFeedbackFlow',
    inputSchema: GetResumeFeedbackInputSchema,
    outputSchema: GetResumeFeedbackOutputSchema,
  },
  async (input) => {
    
    let documentPrompt = '';
    let promptInput: Record<string, any> = {
      targetJobRole: input.targetJobRole,
      additionalInfo: input.additionalInfo,
    };

    if (input.resume.startsWith('data:')) {
      documentPrompt = 'Document: {{media url=resume}}';
      promptInput.resume = input.resume;
    } else {
      documentPrompt = 'Document:\n{{{resumeText}}}';
      promptInput.resumeText = input.resume;
    }
    
    const prompt = ai.definePrompt({
      name: 'getResumeFeedbackPrompt',
      output: { schema: GetResumeFeedbackOutputSchema },
      prompt: `You are an expert career coach and professional resume writer with deep knowledge of Applicant Tracking Systems (ATS). Your task is to provide a comprehensive review of the user's resume and rewrite it into a structured JSON format.

{{#if targetJobRole}}The user is targeting the role of: {{{targetJobRole}}}. You must tailor your feedback and rewritten resume to align with keywords and qualifications for this role.{{/if}}
{{#if additionalInfo}}Additional context from the user: {{{additionalInfo}}}{{/if}}

${documentPrompt}

Please perform the following two tasks:
1.  **Provide Detailed Feedback:** In the 'feedback' field, analyze the resume for clarity, impact, formatting, and ATS compatibility. Give constructive feedback in Markdown format, with clear sections for "Strengths", "Areas for Improvement", and "Actionable Suggestions for ATS Optimization".
2.  **Rewrite the Resume into JSON:** In the 'rewrittenResume' field, provide a professionally rewritten version of the resume by populating the structured JSON object. Extract all contact information, including phone, email, LinkedIn, and GitHub profile URLs if present. Use strong action verbs, quantify achievements, and integrate relevant keywords. Ensure every field in the JSON schema is populated accurately based on the source resume.
`,
    });

    const { output } = await prompt(promptInput);
    return output!;
  }
);
