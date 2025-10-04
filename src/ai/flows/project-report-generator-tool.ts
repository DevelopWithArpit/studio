
'use server';

/**
 * @fileOverview Generates a structured academic document based on a topic and research notes.
 * 
 * - generateProjectReport - A function that generates project report content.
 * - GenerateProjectReportInput - The input type for the function.
 * - GenerateProjectReportOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { googleAI } from '@genkit-ai/googleai';

export type GenerateProjectReportInput = z.infer<typeof GenerateProjectReportInputSchema>;

export const GenerateProjectReportInputSchema = z.object({
  topic: z.string().describe("The main topic or title of the project."),
  collegeName: z.string().describe("The name of the student's college."),
  departmentName: z.string().describe("The name of the department."),
  semester: z.string().describe("The current semester."),
  year: z.string().describe("The academic year."),
  subject: z.string().describe("The subject of the project."),
  studentName: z.string().describe("The student's full name."),
  rollNumber: z.string().describe("The student's class roll number."),
  guideName: z.string().describe("The name of the project guide."),
  numPages: z.coerce.number().int().min(2, "Must be at least 2 pages.").max(15, "Cannot exceed 15 pages."),
  section: z.string().optional().describe("The student's section (e.g., A, B)."),
});

const ChapterSchema = z.object({
  title: z.string().describe('The title of the chapter or section.'),
  content: z.string().describe('The full content of the chapter/section, written in well-structured Markdown format.'),
  imagePrompt: z.string().describe("A descriptive text prompt for an AI image generator to create a relevant, professional-looking picture for this chapter's content. The image should be illustrative and not contain text."),
  imageUrl: z.string().optional().describe('The data URI of the generated image for this chapter.'),
});

export type GenerateProjectReportOutput = z.infer<typeof GenerateProjectReportOutputSchema>;

const GenerateProjectReportOutputSchema = z.object({
  title: z.string().describe('The main title of the generated document.'),
  introduction: z.string().describe('The content of the introduction chapter in Markdown format.'),
  chapters: z.array(ChapterSchema).describe('An array of generated chapters or sections for the document body.'),
  conclusion: z.string().describe('The content of the conclusion chapter in Markdown format.'),
});

const researchTopicTool = ai.defineTool(
    {
      name: 'researchTopicTool',
      description: 'Performs in-depth research on a given academic or technical topic and returns a detailed body of research notes, key points, and relevant data.',
      inputSchema: z.object({ topic: z.string() }),
      outputSchema: z.string().describe('A detailed string of research findings.'),
    },
    async ({ topic }) => {
      const researchPrompt = `You are a world-class research assistant. Generate a comprehensive and detailed body of research notes for the topic: "${topic}". The notes should be well-structured, containing key concepts, supporting data, potential arguments, and relevant background information suitable for an academic paper.`;
      
      const llmResponse = await ai.generate({
        prompt: researchPrompt,
      });

      return llmResponse.text;
    }
);

export async function generateProjectReport(input: GenerateProjectReportInput): Promise<GenerateProjectReportOutput> {
  return generateProjectReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProjectReportPrompt',
  input: { schema: z.object({ topic: z.string(), numPages: z.number() }) },
  output: { schema: GenerateProjectReportOutputSchema },
  tools: [researchTopicTool],
  prompt: `You are an expert academic writer. Your task is to generate a well-structured academic document (like a thesis, research paper, or SIP report) on a given topic. The generated content should be detailed enough to fill approximately {{{numPages}}} printed pages.

**Topic:** {{{topic}}}

**Instructions:**
1.  **Research First:** You MUST use the \`researchTopicTool\` to gather in-depth information about the specified topic.
2.  **Analyze and Expand:** Based on the research findings from the tool, create a comprehensive academic paper. Flesh out each section with detailed, well-organized content. The total length should be substantial, aiming for {{{numPages}}} pages when printed.
3.  **Structure:** Generate the content for the Introduction, all body Chapters, and the Conclusion. The number of chapters should be appropriate for the requested page count.
4.  **Image Prompts:** For each chapter (including Introduction and Conclusion), you MUST create a descriptive prompt for an AI image generator. The prompt should describe a relevant, professional, and visually appealing image that illustrates the chapter's core theme. The image should NOT contain any text.
5.  **Formatting:** All content must be written in clear, academic Markdown.

Generate the complete document structure now.`,
});

const generateProjectReportFlow = ai.defineFlow(
  {
    name: 'generateProjectReportFlow',
    inputSchema: GenerateProjectReportInputSchema,
    outputSchema: GenerateProjectReportOutputSchema,
  },
  async (input) => {
    const { output: outline } = await prompt({
      topic: input.topic,
      numPages: input.numPages,
    });
    if (!outline) {
      throw new Error('Failed to generate document outline.');
    }

    const allChapters = [
        // Not generating images for intro/conclusion to save time/cost
        ...outline.chapters,
    ];

    const imageGenerationPromises = allChapters.map(chapter => {
        if (chapter.imagePrompt) {
            return ai.generate({
                model: 'googleai/imagen-4.0-fast-generate-001',
                prompt: `${chapter.imagePrompt}, professional, high quality, relevant for an academic paper`,
                config: {
                  aspectRatio: '16:9',
                },
            });
        }
        return Promise.resolve({ media: null });
    });

    const results = await Promise.allSettled(imageGenerationPromises);
    
    results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value.media?.url) {
            allChapters[index].imageUrl = result.value.media.url;
        } else {
            console.error(`Chapter ${index + 1} image generation failed.`);
            allChapters[index].imageUrl = '';
        }
    });

    return outline;
  }
);
