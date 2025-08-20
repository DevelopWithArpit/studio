
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
    title: z.string().describe("The user's professional title or headline (e.g., 'Social Media Marketing Specialist | Digital Strategy')."),
    contact: z.object({
        phone: z.string().optional().describe("The user's phone number."),
        email: z.string().optional().describe("The user's email address."),
        linkedin: z.string().optional().describe("The user's LinkedIn profile URL."),
        github: z.string().optional().describe("The user's GitHub profile URL."),
        location: z.string().optional().describe("The user's city and country."),
    }).describe("The user's contact information."),
    summary: z.string().describe("A 2-3 sentence professional summary."),
    experience: z.array(z.object({
        title: z.string().describe("The job title."),
        company: z.string().describe("The company name."),
        location: z.string().optional().describe("The location of the company."),
        dates: z.string().describe("The dates of employment (e.g., '02/2022 - Present')."),
        bullets: z.array(z.string()).describe("A list of bullet points describing achievements and responsibilities, starting with strong action verbs and quantifying results where possible.")
    })).describe("A list of professional experiences."),
    education: z.array(z.object({
        degree: z.string().describe("The degree obtained (e.g., 'Master of Business Administration')."),
        school: z.string().describe("The name of the university or school."),
        location: z.string().optional().describe("The location of the school."),
        dates: z.string().describe("The dates of attendance."),
    })).describe("A list of educational qualifications."),
    projects: z.array(z.object({
        title: z.string().describe("The project title."),
        description: z.string().describe("A brief description of the project."),
        link: z.string().optional().describe("A URL link to the project (e.g., GitHub).")
    })).describe("A list of relevant projects, typically placed in the sidebar."),
    skills: z.array(z.string()).describe("A list of key skills relevant to the job, comma-separated."),
    keyAchievements: z.array(z.object({
        title: z.string().describe("The title of the achievement (e.g., 'Boosted Brand Engagement')."),
        description: z.string().describe("A short description of the achievement with metrics.")
    })).describe("A list of 3-4 key achievements with descriptions, suitable for a sidebar."),
    training: z.array(z.object({
        title: z.string().describe("The title of the training or course (e.g., 'Social Media Marketing Certificate')."),
        description: z.string().describe("A brief description of the course or certification.")
    })).describe("A list of relevant training or courses taken."),
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
      prompt: `You are an expert career coach and professional resume writer with deep knowledge of Applicant Tracking Systems (ATS). Your task is to provide a comprehensive review of the user's resume and rewrite it into a structured JSON format that perfectly matches the provided schema, based on the two-column resume template seen in the user's request.

{{#if targetJobRole}}The user is targeting the role of: {{{targetJobRole}}}. You must tailor your feedback and rewritten resume to align with keywords and qualifications for this role.{{/if}}
{{#if additionalInfo}}Additional context from the user: {{{additionalInfo}}}{{/if}}

${documentPrompt}

Please perform the following two tasks:

1.  **Provide Detailed Feedback:** In the 'feedback' field, analyze the resume for clarity, impact, formatting, and ATS compatibility. Give constructive feedback in Markdown format, with clear sections for "Strengths", "Areas for Improvement", and "Actionable Suggestions for ATS Optimization". Your suggestions should focus on keyword alignment, quantifying achievements, and using standard, machine-readable formatting.

2.  **Rewrite the Resume into JSON:** In the 'rewrittenResume' field, provide a professionally rewritten version of the resume by populating the structured JSON object. Adhere strictly to the following structure, mirroring the visual template:
    - **Header**: Extract the full name, professional title, and all contact details (phone, email, linkedin, location).
    - **Main Column (Right Side)**:
        - **Summary**: A concise professional summary.
        - **Experience**: List all work experiences with title, company, location, dates, and detailed, metric-driven bullet points.
        - **Education**: List all educational qualifications with degree, school, location, and dates.
    - **Sidebar (Left Side)**:
        - **Projects**: Extract 2-3 key projects with a title, a short description, and a URL if available.
        - **Key Achievements**: Identify 3-4 major career achievements. For each, create a short title (e.g., "Increased Conversions") and a description with a quantifiable metric.
        - **Skills**: Compile a list of all relevant skills.
        - **Training/Courses**: List any relevant certifications or courses with a title and a brief description.
    - **General Rules**: Start every bullet point under 'Experience' with a strong action verb. Quantify achievements with specific metrics wherever possible (e.g., "Increased user engagement by 30%" instead of "Improved user engagement"). Ensure all data is extracted accurately.
`,
    });

    const { output } = await prompt(promptInput);
    return output!;
  }
);

    