
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const files: Record<string, string> = {
  ".env": `GEMINI_API_KEY="YOUR_API_KEY_HERE"
`,
  "README.md": `# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.
`,
  "apphosting.yaml": `# Settings to manage and configure a Firebase App Hosting backend.
# https://firebase.google.com/docs/app-hosting/configure
runConfig:
  # Increase this value if you'd like to automatically spin up
  # more instances in response to increased traffic.
  maxInstances: 1
build:
  # This command is run on the server to build your app.
  - npm run build
entrypoint:
  # This command is run on the server to start your app.
  - npm run start
`,
  "components.json": `{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
`,
  "next.config.ts": `
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  serverActions: {
    maxDuration: 120, // 2 minutes
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'logo.clearbit.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
`,
  "package.json": `{
  "name": "nextn",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 9002",
    "genkit:dev": "genkit start -- tsx src/ai/dev.ts",
    "genkit:watch": "genkit start -- tsx --watch src/ai/dev.ts",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@genkit-ai/firebase": "^1.15.5",
    "@genkit-ai/googleai": "^1.15.5",
    "@genkit-ai/next": "^1.15.5",
    "@hookform/resolvers": "^4.1.3",
    "@radix-ui/react-accordion": "^1.2.3",
    "@radix-ui/react-alert-dialog": "^1.1.6",
    "@radix-ui/react-avatar": "^1.1.3",
    "@radix-ui/react-checkbox": "^1.1.4",
    "@radix-ui/react-collapsible": "^1.1.11",
    "@radix-ui/react-dialog": "^1.1.6",
    "@radix-ui/react-dropdown-menu": "^2.1.6",
    "@radix-ui/react-label": "^2.1.2",
    "@radix-ui/react-menubar": "^1.1.6",
    "@radix-ui/react-popover": "^1.1.6",
    "@radix-ui/react-progress": "^1.1.2",
    "@radix-ui/react-radio-group": "^1.2.3",
    "html2canvas": "^1.4.1",
    "@radix-ui/react-scroll-area": "^1.2.3",
    "@radix-ui/react-select": "^2.1.6",
    "@radix-ui/react-separator": "^1.1.2",
    "@radix-ui/react-slider": "^1.2.3",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-switch": "^1.1.3",
    "@radix-ui/react-tabs": "^1.1.3",
    "@radix-ui/react-toast": "^1.2.6",
    "@radix-ui/react-tooltip": "^1.1.8",
    "@tailwindcss/typography": "^0.5.13",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "date-fns": "^3.6.0",
    "docx": "^8.5.0",
    "dotenv": "^16.5.0",
    "embla-carousel-react": "^8.6.0",
    "file-saver": "^2.0.5",
    "firebase": "^11.9.1",
    "genkit": "^1.15.5",
    "jszip": "^3.10.1",
    "jspdf": "^2.5.1",
    "lucide-react": "^0.475.0",
    "next": "15.3.3",
    "patch-package": "^8.0.0",
    "pptxgenjs": "^3.12.0",
    "react": "^18.3.1",
    "react-day-picker": "^8.10.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.54.2",
    "recharts": "^2.15.1",
    "tailwind-merge": "^3.0.1",
    "tailwindcss-animate": "^1.0.7",
    "wav": "^1.0.2",
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "@types/file-saver": "^2.0.7",
    "@types/jszip": "^3.4.1",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "@types/wav": "^1.0.3",
    "genkit-cli": "^1.15.5",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "typescript": "^5"
  }
}
`,
  "src/ai/dev.ts": `
'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/smart-search-tool.ts';
import '@/ai/flows/ai-explanation-tool.ts';
import '@/ai/flows/code-generator-tool.ts';
import '@/ai/flows/code-analyzer-tool.ts';
import '@/ai/flows/interview-question-generator-tool.ts';
import '@/ai/flows/resume-feedback-tool.ts';
import '@/ai/flows/diagram-generator-tool.ts';
import '@/ai/flows/text-to-speech-tool.ts';
import '@/ai/flows/cover-letter-assistant-tool.ts';
import '@/ai/flows/career-path-suggester-tool.ts';
import '@/ai/flows/document-summarizer-tool.ts';
import '@/ai/flows/presentation-generator-tool.ts';
import '@/ai/flows/linkedin-visuals-generator-tool.ts';
import '@/ai/flows/watermark-remover-tool.ts';
import '@/ai/flows/image-text-manipulation-tool.ts';
import '@/ai/flows/portfolio-generator-tool.ts';
import '@/ai/flows/text-humanizer-tool.ts';
import '@/ai/flows/thesis-generator-tool.ts';
`,
  "src/ai/flows/ai-explanation-tool.ts": `
'use server';

/**
 * @fileOverview Provides an AI explanation for complex topics or concepts.
 *
 * - explainTopic - A function that explains a complex topic or concept.
 * - ExplainTopicInput - The input type for the explainTopic function.
 * - ExplainTopicOutput - The return type for the explainTopic function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainTopicInputSchema = z.object({
  topic: z.string().describe('The complex topic or concept to be explained.'),
});
export type ExplainTopicInput = z.infer<typeof ExplainTopicInputSchema>;

const ExplainTopicOutputSchema = z.object({
  explanation: z.string().describe('A clear and concise explanation of the topic.'),
});
export type ExplainTopicOutput = z.infer<typeof ExplainTopicOutputSchema>;

export async function explainTopic(input: ExplainTopicInput): Promise<ExplainTopicOutput> {
  return explainTopicFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainTopicPrompt',
  input: {schema: ExplainTopicInputSchema},
  output: {schema: ExplainTopicOutputSchema},
  prompt: \`You are an expert in explaining complex topics in a clear and concise manner.

  Please provide a clear and concise explanation of the following topic:

  {{{topic}}}\`,
});

const explainTopicFlow = ai.defineFlow(
  {
    name: 'explainTopicFlow',
    inputSchema: ExplainTopicInputSchema,
    outputSchema: ExplainTopicOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
`,
  "src/ai/flows/career-path-suggester-tool.ts": `
'use server';

/**
 * @fileOverview Suggests career paths based on user interests and skills.
 * 
 * - suggestCareerPaths - A function that suggests career paths.
 * - SuggestCareerPathsInput - The input type for the function.
 * - SuggestCareerPathsOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const SuggestCareerPathsInputSchema = z.object({
  interests: z.string().describe('A description of the user\\'s interests and passions.'),
  skills: z.string().describe('A description of the user\\'s existing skills and experience.'),
});
export type SuggestCareerPathsInput = z.infer<typeof SuggestCareerPathsInputSchema>;

const CareerPathSchema = z.object({
  title: z.string().describe('The title of the suggested career path.'),
  description: z.string().describe('A detailed description of the career path, including day-to-day responsibilities and why it fits the user\\'s profile.'),
  requiredSkills: z.array(z.string()).describe('A list of key skills required for this career.'),
});

const SuggestCareerPathsOutputSchema = z.object({
  careerPaths: z.array(CareerPathSchema).describe('An array of suggested career paths.'),
});
export type SuggestCareerPathsOutput = z.infer<typeof SuggestCareerPathsOutputSchema>;

export async function suggestCareerPaths(input: SuggestCareerPathsInput): Promise<SuggestCareerPathsOutput> {
  return suggestCareerPathsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCareerPathsPrompt',
  input: { schema: SuggestCareerPathsInputSchema },
  output: { schema: SuggestCareerPathsOutputSchema },
  prompt: \`You are an expert career counselor. Based on the user's interests and skills, suggest three distinct and relevant career paths.

User Interests:
{{{interests}}}

User Skills:
{{{skills}}}

For each suggested career path, provide a title, a detailed description, and a list of essential skills.\`,
});

const suggestCareerPathsFlow = ai.defineFlow(
  {
    name: 'suggestCareerPathsFlow',
    inputSchema: SuggestCareerPathsInputSchema,
    outputSchema: SuggestCareerPathsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
`,
  "src/ai/flows/code-analyzer-tool.ts": `
'use server';

/**
 * @fileOverview Provides a code analysis tool that identifies potential errors, performance issues, and security vulnerabilities.
 *
 * - analyzeCode - Analyzes the given code and returns a report of identified issues.
 * - AnalyzeCodeInput - The input type for the analyzeCode function.
 * - AnalyzeCodeOutput - The return type for the analyzeCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCodeInputSchema = z.object({
  code: z.string().describe('The code to be analyzed.'),
  language: z.string().describe('The programming language of the code.'),
  constraints: z.string().optional().describe('Constraints to apply during evaluation, e.g., maximum memory usage, execution time limits.'),
});

export type AnalyzeCodeInput = z.infer<typeof AnalyzeCodeInputSchema>;

const AnalyzeCodeOutputSchema = z.object({
  report: z.string().describe('A report of identified errors, performance problems, and security issues.'),
});

export type AnalyzeCodeOutput = z.infer<typeof AnalyzeCodeOutputSchema>;

export async function analyzeCode(input: AnalyzeCodeInput): Promise<AnalyzeCodeOutput> {
  return analyzeCodeFlow(input);
}

const analyzeCodePrompt = ai.definePrompt({
  name: 'analyzeCodePrompt',
  input: {schema: AnalyzeCodeInputSchema},
  output: {schema: AnalyzeCodeOutputSchema},
  prompt: \`You are a code analyzer expert. Analyze the following code and provide a report of any errors, possible performance problems, and security issues.

Language: {{{language}}}
Code:
{{{code}}}

Constraints: {{constraints}}

Report:
\`,
});

const analyzeCodeFlow = ai.defineFlow(
  {
    name: 'analyzeCodeFlow',
    inputSchema: AnalyzeCodeInputSchema,
    outputSchema: AnalyzeCodeOutputSchema,
  },
  async input => {
    const {output} = await analyzeCodePrompt(input);
    return output!;
  }
);
`,
  "src/ai/flows/code-generator-tool.ts": `
'use server';

/**
 * @fileOverview Code Generator Tool.
 *
 * - generateCode - A function that generates code based on instructions and specifications.
 * - GenerateCodeInput - The input type for the generateCode function.
 * - GenerateCodeOutput - The return type for the generateCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CodeConstraintsSchema = z.object({
  language: z.string().describe('The programming language for the code.'),
  frameworks: z.string().describe('The frameworks for the code.'),
  libraries: z.string().describe('The libraries the code needs to use.'),
});

export type CodeConstraints = z.infer<typeof CodeConstraintsSchema>;

const GenerateCodeInputSchema = z.object({
  instructions: z.string().describe('Instructions and specifications for the code.'),
  constraints: CodeConstraintsSchema.optional().describe('Any constraints or special considerations that apply to the code.'),
});

export type GenerateCodeInput = z.infer<typeof GenerateCodeInputSchema>;

const GenerateCodeOutputSchema = z.object({
  code: z.string().describe('The generated code.'),
});

export type GenerateCodeOutput = z.infer<typeof GenerateCodeOutputSchema>;

export async function generateCode(input: GenerateCodeInput): Promise<GenerateCodeOutput> {
  return generateCodeFlow(input);
}

const codeGeneratorPrompt = ai.definePrompt({
  name: 'codeGeneratorPrompt',
  input: {schema: GenerateCodeInputSchema},
  output: {schema: GenerateCodeOutputSchema},
  prompt: \`You are an expert code generator. Generate code according to the instructions and specifications provided. Consider any constraints that apply to the code, and apply them in your answer.

Instructions: {{{instructions}}}

{{#if constraints}}
Constraints:
Language: {{{constraints.language}}}
Frameworks: {{{constraints.frameworks}}}
Libraries: {{{constraints.libraries}}}
{{/if}}

Generated Code:\`, 
});

const generateCodeFlow = ai.defineFlow(
  {
    name: 'generateCodeFlow',
    inputSchema: GenerateCodeInputSchema,
    outputSchema: GenerateCodeOutputSchema,
  },
  async input => {
    const {output} = await codeGeneratorPrompt(input);
    return output!;
  }
);
`,
  "src/ai/flows/cover-letter-assistant-tool.ts": `
'use server';

/**
 * @fileOverview Assists users in generating a cover letter.
 * 
 * - generateCoverLetter - A function that generates a cover letter.
 * - GenerateCoverLetterInput - The input type for the function.
 * - GenerateCoverLetterOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateCoverLetterInputSchema = z.object({
  jobDescription: z.string().describe('The full job description the user is applying for.'),
  userInfo: z.string().describe('Information about the user, such as their resume, key skills, and relevant experience.'),
  tone: z.enum(['Professional', 'Enthusiastic', 'Formal', 'Creative']).describe('The desired tone for the cover letter.'),
});
export type GenerateCoverLetterInput = z.infer<typeof GenerateCoverLetterInputSchema>;

const GenerateCoverLetterOutputSchema = z.object({
  coverLetter: z.string().describe('The generated cover letter text, formatted in Markdown.'),
});
export type GenerateCoverLetterOutput = z.infer<typeof GenerateCoverLetterOutputSchema>;

export async function generateCoverLetter(input: GenerateCoverLetterInput): Promise<GenerateCoverLetterOutput> {
  return generateCoverLetterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCoverLetterPrompt',
  input: { schema: GenerateCoverLetterInputSchema },
  output: { schema: GenerateCoverLetterOutputSchema },
  prompt: \`You are an expert career coach specializing in writing compelling cover letters. Your task is to generate a cover letter based on the provided job description and user information.

The tone of the cover letter should be: {{{tone}}}.

Tailor the letter to highlight how the user's skills and experience match the requirements in the job description. The letter should be professional, engaging, and concise.

Job Description:
---
{{{jobDescription}}}
---

User Information / Resume:
---
{{{userInfo}}}
---

Generate the cover letter now.\`,
});

const generateCoverLetterFlow = ai.defineFlow(
  {
    name: 'generateCoverLetterFlow',
    inputSchema: GenerateCoverLetterInputSchema,
    outputSchema: GenerateCoverLetterOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
`,
  "src/ai/flows/diagram-generator-tool.ts": `
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
    const prompt = \`Generate a clear, high-quality diagram based on the following description. The diagram should be visually clean and easy to understand, suitable for a technical presentation.

Description: "\${description}"

Ensure the output is a well-structured diagram. For example, for a flowchart, use standard shapes for start/end, process, and decision points. For a system architecture, use clear icons and labels for components.\`;

    const { media } = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: prompt,
    });

    if (!media?.url) {
      throw new Error('Failed to generate diagram.');
    }

    return { diagramUrl: media.url };
  }
);
`,
  "src/ai/flows/document-summarizer-tool.ts": `
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
  prompt: \`You are an expert document summarizer. Analyze the following document and generate a summary based on the specified length and style.

Document:
{{media url=documentDataUri}}

Summary Length: {{{length}}}
Summary Style: {{{style}}}

Generate a concise and accurate summary.\`,
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
`,
  "src/ai/flows/image-text-manipulation-tool.ts": `
'use server';

/**
 * @fileOverview Edits text directly within an image based on instructions.
 *
 * - manipulateImageText - A function that performs text manipulation on an image.
 * - ManipulateImageTextInput - The input type for the function.
 * - ManipulateImageTextOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ManipulateImageTextInputSchema = z.object({
  imageDataUri: z.string().describe("An image containing text, as a data URI. Format: 'data:<mimetype>;base64,<encoded_data>'."),
  instructions: z.string().describe('Detailed instructions on how to manipulate the text in the image (e.g., "Change the headline to \\'New Title\\'").'),
});
export type ManipulateImageTextInput = z.infer<typeof ManipulateImageTextInputSchema>;

const ManipulateImageTextOutputSchema = z.object({
  processedImageUrl: z.string().describe('The data URI of the image after text manipulation.'),
});
export type ManipulateImageTextOutput = z.infer<typeof ManipulateImageTextOutputSchema>;

export async function manipulateImageText(input: ManipulateImageTextInput): Promise<ManipulateImageTextOutput> {
  return manipulateImageTextFlow(input);
}

const manipulateImageTextFlow = ai.defineFlow(
  {
    name: 'manipulateImageTextFlow',
    inputSchema: ManipulateImageTextInputSchema,
    outputSchema: ManipulateImageTextOutputSchema,
  },
  async ({ imageDataUri, instructions }) => {
    const prompt = [
        { media: { url: imageDataUri } },
        { text: \`You are an expert image editor. Your task is to manipulate the text within the provided image based on the following instructions, while seamlessly blending the changes with the original image style, font, and background. Instructions: "\${instructions}"\` },
    ];
    
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image-preview',
      prompt: prompt,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media?.url) {
      throw new Error('Failed to process the image.');
    }

    return { processedImageUrl: media.url };
  }
);
`,
  "src/ai/flows/interview-question-generator-tool.ts": `
'use server';

/**
 * @fileOverview Generates interview questions for a specified job role or topic.
 * 
 * - generateInterviewQuestions - A function that generates interview questions.
 * - GenerateInterviewQuestionsInput - The input type for the function.
 * - GenerateInterviewQuestionsOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateInterviewQuestionsInputSchema = z.object({
  topic: z.string().describe('The job role, technology, or topic for the interview questions (e.g., "Senior Frontend Developer", "React Hooks").'),
  count: z.number().int().positive().describe('The number of questions to generate.'),
  category: z.enum(['Technical', 'Behavioral', 'Situational', 'Brain-Teaser']).describe('The category of questions to generate.'),
});
export type GenerateInterviewQuestionsInput = z.infer<typeof GenerateInterviewQuestionsInputSchema>;

const QuestionSchema = z.object({
  question: z.string().describe('The interview question.'),
  expectedAnswer: z.string().describe('A brief description of what a good answer should include.'),
});

const GenerateInterviewQuestionsOutputSchema = z.object({
  questions: z.array(QuestionSchema).describe('An array of generated interview questions.'),
});
export type GenerateInterviewQuestionsOutput = z.infer<typeof GenerateInterviewQuestionsOutputSchema>;

export async function generateInterviewQuestions(input: GenerateInterviewQuestionsInput): Promise<GenerateInterviewQuestionsOutput> {
  return generateInterviewQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInterviewQuestionsPrompt',
  input: { schema: GenerateInterviewQuestionsInputSchema },
  output: { schema: GenerateInterviewQuestionsOutputSchema },
  prompt: \`You are an expert interviewer and hiring manager. Your task is to generate a list of insightful interview questions.

Generate {{{count}}} {{{category}}} interview questions for the topic: "{{{topic}}}".

For each question, provide the question itself and a brief summary of what you would expect in a strong answer.
\`,
});

const generateInterviewQuestionsFlow = ai.defineFlow(
  {
    name: 'generateInterviewQuestionsFlow',
    inputSchema: GenerateInterviewQuestionsInputSchema,
    outputSchema: GenerateInterviewQuestionsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
`,
  "src/ai/flows/linkedin-visuals-generator-tool.ts": `
'use server';

/**
 * @fileOverview Generates a professional profile picture and cover banner for LinkedIn.
 *
 * - generateLinkedInVisuals - A function that creates a LinkedIn visuals.
 * - GenerateLinkedInVisualsInput - The input type for the function.
 * - GenerateLinkedInVisualsOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateLinkedInVisualsInputSchema = z.object({
  resumeDataUri: z.string().optional().describe("The user's resume as a data URI. Format: 'data:<mimetype>;base64,<encoded_data>'."),
  resumeText: z.string().optional().describe("The user's resume as plain text."),
  userPhotoUri: z.string().optional().describe("An optional photo of the user, as a data URI. If provided, it will be used as the base for the profile picture. Format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type GenerateLinkedInVisualsInput = z.infer<typeof GenerateLinkedInVisualsInputSchema>;

const GenerateLinkedInVisualsOutputSchema = z.object({
  profilePictureUrl: z.string().describe('The data URI of the generated professional profile picture.'),
  coverBannerUrl: z.string().describe('The data URI of the generated professional cover banner.'),
});
export type GenerateLinkedInVisualsOutput = z.infer<typeof GenerateLinkedInVisualsOutputSchema>;

export async function generateLinkedInVisuals(input: GenerateLinkedInVisualsInput): Promise<GenerateLinkedInVisualsOutput> {
  return generateLinkedInVisualsFlow(input);
}

const generateLinkedInVisualsFlow = ai.defineFlow(
  {
    name: 'generateLinkedInVisualsFlow',
    inputSchema: GenerateLinkedInVisualsInputSchema,
    outputSchema: GenerateLinkedInVisualsOutputSchema,
  },
  async ({ resumeDataUri, resumeText, userPhotoUri }) => {
    
    let resumeContextPart;
    if (resumeDataUri) {
        resumeContextPart = { media: { url: resumeDataUri } };
    } else if (resumeText) {
        resumeContextPart = { text: \`Here is the resume text:\\n\\n\${resumeText}\` };
    } else {
        throw new Error("Either resumeDataUri or resumeText must be provided.");
    }

    const profilePictureModel = userPhotoUri ? 'googleai/gemini-2.5-flash-image-preview' : 'googleai/imagen-4.0-fast-generate-001';

    const profilePicturePrompt = userPhotoUri
      ? [
          { media: { url: userPhotoUri } },
          { text: \`Based on the user's photo and their resume content, create a professional, high-quality headshot suitable for a LinkedIn profile picture. The background should be simple and professional, not distracting. The person should look friendly and approachable.\` },
          resumeContextPart,
        ]
      : [
          { text: \`Generate a professional, high-quality headshot suitable for a LinkedIn profile picture for a person in the software engineering industry. The person should look friendly and approachable. The background should be simple and professional. Use the resume content to guide the style.\` },
          resumeContextPart,
        ];

    const coverBannerPrompt = [
        { text: \`Analyze the user's resume content provided. Based on their industry, skills, and experience, generate a professional and abstract background image suitable for a LinkedIn cover banner (1584 x 396 pixels). The design should be modern, clean, and visually represent the user's professional field. For example, for a software engineer, it might incorporate subtle code-like patterns or abstract representations of data. For a graphic designer, it could be more artistic. The banner should not contain any text and should be visually appealing but not distracting.\` },
        resumeContextPart,
    ];

    const [profilePicResult, coverBannerResult] = await Promise.all([
      ai.generate({
        model: profilePictureModel,
        prompt: profilePicturePrompt,
        config: { responseModalities: ['TEXT', 'IMAGE'] },
      }),
      ai.generate({
        model: 'googleai/imagen-4.0-fast-generate-001',
        prompt: coverBannerPrompt,
      }),
    ]);

    const profilePictureUrl = profilePicResult.media?.url;
    const coverBannerUrl = coverBannerResult.media?.url;

    if (!profilePictureUrl || !coverBannerUrl) {
      throw new Error('Failed to generate one or more LinkedIn visuals.');
    }

    return { profilePictureUrl, coverBannerUrl };
  }
);
`,
  "src/ai/flows/portfolio-generator-tool.ts": `
'use server';

/**
 * @fileOverview Generates a complete portfolio website from structured data.
 * 
 * - generatePortfolioWebsite - A function that generates HTML, CSS, and JS for a portfolio.
 * - extractPortfolioDataFromText - A function that extracts structured portfolio data from a text blob.
 * - GeneratePortfolioWebsiteInput - The input type for the function.
 * - GeneratePortfolioWebsiteOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const PortfolioDataSchema = z.object({
  name: z.string().describe("The user's full name."),
  headline: z.string().describe("The user's professional headline (e.g., 'Software Engineer | AI Enthusiast')."),
  profession: z.string().describe("The user's profession or industry (e.g., 'Software Engineer', 'Graphic Designer', 'Marine Biologist')."),
  contact: z.object({
      email: z.string().describe("The user's email address."),
      phone: z.string().optional(),
      linkedin: z.string().optional(),
      github: z.string().optional(),
      socials: z.array(z.object({
          network: z.string(),
          url: z.string(),
      })).optional().describe("An array of social media links.")
  }),
  about: z.string().describe("A detailed 'About Me' section."),
  experience: z.array(z.object({
      title: z.string(),
      company: z.string(),
      dates: z.string(),
      description: z.string(),
  })),
  education: z.array(z.object({
      degree: z.string(),
      school: z.string(),
      dates: z.string(),
  })),
  projects: z.array(z.object({
      title: z.string(),
      description: z.string(),
      link: z.string().optional(),
      imageUrl: z.string().optional(),
  })),
  skills: z.array(z.string()),
  achievements: z.array(z.string()).optional(),
  certificateDataUri: z.string().optional().describe("An optional internship certificate as a data URI. If provided, analyze it and add an entry to the achievements section."),
});
export type GeneratePortfolioWebsiteInput = z.infer<typeof PortfolioDataSchema>;


const GeneratePortfolioWebsiteOutputSchema = z.object({
  html: z.string().describe('The complete HTML code for the portfolio website.'),
  css: z.string().describe('The complete CSS code for styling the portfolio.'),
  javascript: z.string().describe('The JavaScript code for animations and interactivity.'),
});
export type GeneratePortfolioWebsiteOutput = z.infer<typeof GeneratePortfolioWebsiteOutputSchema>;

export async function generatePortfolioWebsite(input: GeneratePortfolioWebsiteInput): Promise<GeneratePortfolioWebsiteOutput> {
  return generatePortfolioWebsiteFlow(input);
}


const extractPortfolioDataPrompt = ai.definePrompt({
    name: 'extractPortfolioDataPrompt',
    input: { schema: z.object({ text: z.string() }) },
    output: { schema: PortfolioDataSchema },
    prompt: \`You are an expert at parsing unstructured text and extracting structured information. Analyze the following document, which could be a resume, a LinkedIn profile, or an article about building a portfolio. Your task is to extract all relevant information and structure it according to the provided JSON schema.

- Based on the content, determine the person's profession (e.g., 'Software Engineer', 'Graphic Designer') and populate the 'profession' field.
- If the document is a guide or article, create a realistic and compelling portfolio for a fictional person (e.g., Alex Doe, a Full-Stack Developer) based on the principles and examples in the text.
- Infer missing information where it makes sense. For instance, if a job title is "Software Engineer," you can create plausible project descriptions or skill sets.
- For projects, if no image URL is provided, use a placeholder from 'https://placehold.co/600x400'.
- Ensure all fields in the schema are populated with high-quality, realistic data.

Document to analyze:
---
{{{text}}}
---

Extract the data now.\`,
});

export async function extractPortfolioDataFromText(text: string): Promise<GeneratePortfolioWebsiteInput> {
    const { output } = await extractPortfolioDataPrompt({ text });
    if (!output) {
        throw new Error("Failed to extract portfolio data from the provided text.");
    }
    return output;
}


const prompt = ai.definePrompt({
    name: 'generatePortfolioWebsitePrompt',
    input: { schema: PortfolioDataSchema },
    output: { schema: GeneratePortfolioWebsiteOutputSchema },
    prompt: \`You are an expert web developer and designer, specializing in creating modern, animated portfolio websites. Your task is to generate the complete HTML, CSS, and JavaScript for a portfolio, visually tailored to the user's profession.

**User's Profession:** {{{profession}}}

{{#if certificateDataUri}}
**Certificate Analysis:** An internship certificate has been provided. Analyze its contents (text, logos, dates) to verify it and extract the key achievement. Create a concise, one-sentence achievement summary (e.g., "Completed a 3-month web development internship at ExampleCorp") and add it to the beginning of the achievements list.
Certificate: {{media url=certificateDataUri}}
{{/if}}

**Instructions:**
1.  **Theme Adaptation:**
    *   Based on the user's profession, adapt the visual theme in the CSS.
    *   **For technical roles (e.g., Software Engineer, Data Scientist):** Use a dark theme with a tech-inspired font like 'Space Grotesk'. Use an accent color like teal or electric blue. The overall feel should be modern and clean.
    *   **For creative roles (e.g., Graphic Designer, Artist):** Use a more creative layout, perhaps with a lighter theme or more vibrant colors. Choose fonts that reflect creativity (e.g., a stylish serif or sans-serif).
    *   **For other professions (e.g., Marketing, Finance):** Choose a professional, clean, and appropriate theme. A light theme with a standard sans-serif font like 'Inter' is a safe and professional choice.
2.  **Content Injection:** Populate the provided HTML template with the user's structured data.
3.  **Animations & Interactivity:** 
    * Ensure the CSS and JavaScript create a smooth, "assembled by AI" experience. Sections should fade in on scroll. The hero text must have a "typing" animation.
    * An interactive particle network background must be implemented using the HTML canvas.
4.  **Structure:** Do not change the fundamental structure of the HTML (sections, IDs). Only populate it with data and adapt the styles in the CSS.
5.  **Output:** Return the complete HTML, CSS, and JavaScript as a single JSON object.

**User's Portfolio Data:**
- Name: {{{name}}}
- Headline: {{{headline}}}
- Profession: {{{profession}}}
- About Me: {{{about}}}
- Contact Email: {{{contact.email}}}
{{#if contact.phone}}- Contact Phone: {{{contact.phone}}}{{/if}}
- Socials:
{{#each contact.socials}}
  - {{network}}: {{url}}
{{/each}}
- Experience:
{{#each experience}}
  - Title: {{title}}, Company: {{company}}, Dates: {{dates}}, Description: {{description}}
{{/each}}
- Education:
{{#each education}}
  - Degree: {{degree}}, School: {{school}}, Dates: {{dates}}
{{/each}}
- Projects:
{{#each projects}}
  - Title: {{title}}, Description: {{description}}, Link: {{link}}, Image: {{imageUrl}}
{{/each}}
- Skills:
{{#each skills}}
  - {{this}}
{{/each}}
{{#if achievements}}
- Achievements:
{{#each achievements}}
  - {{this}}
{{/each}}
{{/if}}


**Template:**

**HTML:**
\\\`\\\`\\\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio</title>
    <link rel="stylesheet" href="style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Inter:wght@400;500;700&display=swap" rel="stylesheet">
</head>
<body>
    <canvas id="interactive-bg"></canvas>

    <header class="header">
        <nav class="nav">
            <a href="#about">About</a>
            <a href="#experience">Experience</a>
            <a href="#projects">Projects</a>
            <a href="#contact">Contact</a>
        </nav>
    </header>

    <main>
        <section id="hero" class="hero">
            <div class="hero-content">
                <h1 class="hero-name">{{{name}}}</h1>
                <p class="hero-headline">{{{headline}}}</p>
            </div>
        </section>

        <section id="about" class="scroll-target">
            <h2>About Me</h2>
            <p>{{{about}}}</p>
        </section>

        <section id="experience" class="scroll-target">
            <h2>Work Experience</h2>
            <div class="experience-list">
                {{#each experience}}
                <div class="experience-item">
                    <h3>{{title}}</h3>
                    <h4>{{company}} | {{dates}}</h4>
                    <p>{{description}}</p>
                </div>
                {{/each}}
            </div>
        </section>

        <section id="projects" class="scroll-target">
            <h2>Projects</h2>
            <div class="project-grid">
                {{#each projects}}
                <div class="project-card">
                    <img src="{{#if imageUrl}}{{imageUrl}}{{else}}https://placehold.co/600x400{{/if}}" alt="Project image for {{title}}">
                    <div class="project-card-content">
                        <h3>{{title}}</h3>
                        <p>{{description}}</p>
                        {{#if link}}<a href="{{link}}" target="_blank">View Project</a>{{/if}}
                    </div>
                </div>
                {{/each}}
            </div>
        </section>

        <section id="skills" class="scroll-target">
            <h2>Skills</h2>
            <div class="skills-list">
                {{#each skills}}<span class="skill-badge">{{this}}</span>{{/each}}
            </div>
        </section>

        {{#if achievements.length}}
        <section id="achievements" class="scroll-target">
            <h2>Achievements</h2>
            <ul class="achievements-list">
                {{#each achievements}}
                <li>{{this}}</li>
                {{/each}}
            </ul>
        </section>
        {{/if}}
    </main>

    <footer id="contact" class="footer">
        <h2>Contact Me</h2>
        <p>Email: <a href="mailto:{{{contact.email}}}">{{{contact.email}}}</a></p>
        {{#if contact.phone}}<p>Phone: {{contact.phone}}</p>{{/if}}
        <div class="social-links">
            {{#each contact.socials}}
            <a href="{{url}}" target="_blank">{{network}}</a>
            {{/each}}
        </div>
    </footer>

    <script src="script.js"></script>
</body>
</html>
\\\`\\\`\\\`

**CSS:**
\\\`\\\`\\\`css
:root {
    /* DEFAULT THEME (Dark, Tech-focused) - ADAPT THIS BASED ON PROFESSION */
    --bg-color: #0A192F;
    --text-color: #ccd6f6;
    --accent-color: #64ffda;
    --card-bg-color: #112240;
    --font-family: 'Space Grotesk', sans-serif;
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    font-family: var(--font-family);
    background-color: var(--bg-color);
    color: var(--text-color);
    line-height: 1.6;
    transition: background-color 0.5s ease, color 0.5s ease;
}

#interactive-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
}

main, .header, .footer {
    position: relative;
    z-index: 1;
}

h1, h2, h3 {
    color: var(--accent-color);
    line-height: 1.2;
}

h2 {
    font-size: 2.5rem;
    margin-bottom: 2rem;
    text-align: center;
}

h3 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
}

a {
    color: var(--accent-color);
    text-decoration: none;
    transition: color 0.3s ease;
}

a:hover {
    color: white;
}

section {
    padding: 6rem 2rem;
    max-width: 1000px;
    margin: 0 auto;
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    background-color: rgba(10, 25, 47, 0.8); /* Semi-transparent background for content sections */
    backdrop-filter: blur(2px);
    border-radius: 12px;
    margin-bottom: 2rem;
}

section.visible {
    opacity: 1;
    transform: translateY(0);
}

.header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    padding: 1rem 2rem;
    z-index: 100;
    background-color: rgba(10, 25, 47, 0.85);
    backdrop-filter: blur(10px);
    transition: top 0.3s;
}

.nav {
    display: flex;
    justify-content: flex-end;
    gap: 1.5rem;
}

.hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    background: none;
    backdrop-filter: none;
    border-radius: 0;
}

@keyframes typing {
    from { width: 0; }
    to { width: 100%; }
}

@keyframes blink-caret {
    from, to { border-color: transparent; }
    50% { border-color: var(--accent-color); }
}

.hero-name {
    font-size: 5rem;
    font-weight: 700;
    overflow: hidden;
    border-right: .15em solid var(--accent-color);
    white-space: nowrap;
    margin: 0 auto;
    letter-spacing: .1em;
    animation:
        typing 3.5s steps(30, end),
        blink-caret .75s step-end infinite;
}

.hero-headline {
    font-size: 1.5rem;
    margin-top: 1rem;
    opacity: 0;
    animation: fadeIn 2s ease-in-out 3.5s forwards;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}


.experience-list .experience-item {
    background-color: var(--card-bg-color);
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    border: 1px solid #1d2d50;
}

.project-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
}

.project-card {
    background-color: var(--card-bg-color);
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.3s ease;
    border: 1px solid #1d2d50;
}

.project-card:hover {
    transform: translateY(-5px);
}

.project-card img {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

.project-card-content {
    padding: 1.5rem;
}

.skills-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
}

.skill-badge {
    background-color: var(--card-bg-color);
    color: var(--accent-color);
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
    border: 1px solid var(--accent-color);
}

.footer {
    text-align: center;
    padding: 3rem 1rem;
    background-color: rgba(10, 25, 47, 0.85);
    backdrop-filter: blur(10px);
}

.social-links {
    margin-top: 1rem;
    display: flex;
    justify-content: center;
    gap: 1.5rem;
}

.achievements-list {
    list-style: disc;
    padding-left: 20px;
    text-align: left;
    max-width: 600px;
    margin: 0 auto;
}
\\\`\\\`\\\`

**JavaScript:**
\\\`\\\`\\\`javascript
document.addEventListener('DOMContentLoaded', () => {
    // Scroll animations
    const scrollTargets = document.querySelectorAll('.scroll-target');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    scrollTargets.forEach(target => observer.observe(target));

    // Header visibility on scroll
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop) {
            header.style.top = '-80px';
        } else {
            header.style.top = '0';
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, false);

    // Interactive background
    const canvas = document.getElementById('interactive-bg');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray = [];
    const numberOfParticles = 100;
    const mouse = { x: null, y: null };

    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    });
    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    })


    class Particle {
        constructor(x, y, size, color, weight) {
            this.x = x;
            this.y = y;
            this.size = size;
            this.color = color;
            this.weight = weight; // Speed
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        update() {
            // Movement
            this.x += (Math.random() - 0.5) * this.weight;
            this.y += (Math.random() - 0.5) * this.weight;

            // Bounce off edges
            if (this.x > canvas.width || this.x < 0) this.x = Math.random() * canvas.width;
            if (this.y > canvas.height || this.y < 0) this.y = Math.random() * canvas.height;
            
            // Mouse interaction
            if (mouse.x && mouse.y) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx*dx + dy*dy);
                if (distance < 100) {
                     this.x -= dx / 20;
                     this.y -= dy / 20;
                }
            }

            this.draw();
        }
    }

    function init() {
        particlesArray = [];
        for (let i = 0; i < numberOfParticles; i++) {
            let x = Math.random() * canvas.width;
            let y = Math.random() * canvas.height;
            let size = Math.random() * 1.5 + 1;
            let color = 'rgba(167, 196, 224, 0.7)';
            let weight = Math.random() * 0.5 + 0.1;
            particlesArray.push(new Particle(x, y, size, color, weight));
        }
    }

    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                               ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                    opacityValue = 1 - (distance / 20000);
                    ctx.strokeStyle = 'rgba(167, 196, 224,' + opacityValue + ')';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connect();
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init();
    });

    init();
    animate();
});
\\\`\\\`\\\`
\`,
});


const generatePortfolioWebsiteFlow = ai.defineFlow(
  {
    name: 'generatePortfolioWebsiteFlow',
    inputSchema: PortfolioDataSchema,
    outputSchema: GeneratePortfolioWebsiteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
`,
  "src/lib/utils.ts": `
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`,
  "src/tailwind.config.ts": `
import type {Config} from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
        body: ['Inter', 'sans-serif'],
        headline: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      typography: (theme: (arg0: string) => any) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': 'hsl(var(--foreground))',
            '--tw-prose-headings': 'hsl(var(--primary))',
            '--tw-prose-lead': 'hsl(var(--muted-foreground))',
            '--tw-prose-links': 'hsl(var(--primary))',
            '--tw-prose-bold': 'hsl(var(--foreground))',
            '--tw-prose-counters': 'hsl(var(--muted-foreground))',
            '--tw-prose-bullets': 'hsl(var(--border))',
            '--tw-prose-hr': 'hsl(var(--border))',
            '--tw-prose-quotes': 'hsl(var(--foreground))',
            '--tw-prose-quote-borders': 'hsl(var(--border))',
            '--tw-prose-captions': 'hsl(var(--muted-foreground))',
            '--tw-prose-code': 'hsl(var(--foreground))',
            '--tw-prose-pre-code': 'hsl(var(--foreground))',
            '--tw-prose-pre-bg': 'hsl(var(--muted))',
            '--tw-prose-th-borders': 'hsl(var(--border))',
            '--tw-prose-td-borders': 'hsl(var(--border))',
            '--tw-prose-invert-body': 'hsl(var(--foreground))',
            '--tw-prose-invert-headings': 'hsl(var(--primary))',
            '--tw-prose-invert-lead': 'hsl(var(--muted-foreground))',
            '--tw-prose-invert-links': 'hsl(var(--primary))',
            '--tw-prose-invert-bold': 'hsl(var(--foreground))',
            '--tw-prose-invert-counters': 'hsl(var(--muted-foreground))',
            '--tw-prose-invert-bullets': 'hsl(var(--border))',
            '--tw-prose-invert-hr': 'hsl(var(--border))',
            '--tw-prose-invert-quotes': 'hsl(var(--foreground))',
            '--tw-prose-invert-quote-borders': 'hsl(var(--border))',
            '--tw-prose-invert-captions': 'hsl(var(--muted-foreground))',
            '--tw-prose-invert-code': 'hsl(var(--foreground))',
            '--tw-prose-invert-pre-code': 'hsl(var(--foreground))',
            '--tw-prose-invert-pre-bg': 'hsl(var(--muted))',
            '--tw-prose-invert-th-borders': 'hsl(var(--border))',
            '--tw-prose-invert-td-borders': 'hsl(var(--border))',
          },
        },
      }),
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
} satisfies Config

export default config;
`,
  "tailwind.config.ts": `
import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['Inter', 'sans-serif'],
        headline: ['Space Grotesk', 'sans-serif'],
        code: ['monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
       typography: (theme: (arg0: string) => any) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.foreground'),
            '--tw-prose-headings': theme('colors.primary'),
            '--tw-prose-lead': theme('colors.muted.foreground'),
            '--tw-prose-links': theme('colors.accent.DEFAULT'),
            '--tw-prose-bold': theme('colors.foreground'),
            '--tw-prose-counters': theme('colors.muted.foreground'),
            '--tw-prose-bullets': theme('colors.border'),
            '--tw-prose-hr': theme('colors.border'),
            '--tw-prose-quotes': theme('colors.foreground'),
            '--tw-prose-quote-borders': theme('colors.border'),
            '--tw-prose-captions': theme('colors.muted.foreground'),
            '--tw-prose-code': theme('colors.foreground'),
            '--tw-prose-pre-code': theme('colors.foreground'),
            '--tw-prose-pre-bg': theme('colors.muted.DEFAULT'),
            '--tw-prose-th-borders': theme('colors.border'),
            '--tw-prose-td-borders': theme('colors.border'),
            '--tw-prose-invert-body': theme('colors.foreground'),
            '--tw-prose-invert-headings': theme('colors.primary'),
            '--tw-prose-invert-lead': theme('colors.muted.foreground'),
            '--tw-prose-invert-links': theme('colors.accent.DEFAULT'),
            '--tw-prose-invert-bold': theme('colors.foreground'),
            '--tw-prose-invert-counters': theme('colors.muted.foreground'),
            '--tw-prose-invert-bullets': theme('colors.border'),
            '--tw-prose-invert-hr': theme('colors.border'),
            '--tw-prose-invert-quotes': theme('colors.foreground'),
            '--tw-prose-invert-quote-borders': theme('colors.border'),
            '--tw-prose-invert-captions': theme('colors.muted.foreground'),
            '--tw-prose-invert-code': theme('colors.foreground'),
            '--tw-prose-invert-pre-code': theme('colors.foreground'),
            '--tw-prose-invert-pre-bg': theme('colors.muted.DEFAULT'),
            '--tw-prose-invert-th-borders': theme('colors.border'),
            '--tw-prose-invert-td-borders': theme('colors.border'),
          },
        },
      }),
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
} satisfies Config;
`,
  "tsconfig.json": `{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
`,
};

export const downloadProject = () => {
  const zip = new JSZip();
  for (const [path, content] of Object.entries(files)) {
    zip.file(path, content);
  }
  zip.generateAsync({ type: 'blob' }).then((content) => {
    saveAs(content, 'ai-mentor-project.zip');
  });
};
