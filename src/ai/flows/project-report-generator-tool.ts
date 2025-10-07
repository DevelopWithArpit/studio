
'use server';

/**
 * @fileOverview Generates a structured academic document based on a topic and research notes.
 * 
 * - generateProjectReport - A function that generates project report content.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateProjectReportInputSchema = z.object({
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
type GenerateProjectReportInput = z.infer<typeof GenerateProjectReportInputSchema>;

const ChapterSchema = z.object({
  title: z.string().describe('The title of the chapter or section.'),
  content: z.string().describe('The full content of the chapter/section, written in well-structured Markdown format. This field must ONLY contain the text content for the chapter.'),
  imagePrompt: z.string().describe("A descriptive text prompt for an AI image generator to create a relevant, professional-looking picture for this chapter's content. The image should be illustrative. CRITICAL: Any text or words in the image MUST be spelled correctly."),
  imageUrl: z.string().optional().describe('The data URI of the generated image for this chapter.'),
});

const GenerateProjectReportOutputSchema = z.object({
  title: z.string().describe('The main title of the generated document.'),
  introduction: ChapterSchema.describe('The introduction chapter object, containing title, content, and imagePrompt.'),
  chapters: z.array(ChapterSchema).describe('An array of generated chapters or sections for the document body.'),
  conclusion: ChapterSchema.describe('The conclusion chapter object, containing title, content, and imagePrompt.'),
});
type GenerateProjectReportOutput = z.infer<typeof GenerateProjectReportOutputSchema>;

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

**CRITICAL INSTRUCTIONS:**
1.  **Research First:** You MUST use the \`researchTopicTool\` to gather in-depth information about the specified topic.
2.  **Analyze and Expand:** Based on the research findings, create a comprehensive academic paper. Flesh out each section with detailed, well-organized content.
3.  **Strict JSON Structure:** Your entire output must be a single JSON object that perfectly matches the output schema.
4.  **Complete All Fields:** You must generate content for 'title', 'introduction', 'chapters', and 'conclusion'.
5.  **Introduction and Conclusion Objects:** The 'introduction' and 'conclusion' fields must be objects, each containing 'title', 'content', and a unique 'imagePrompt'.
6.  **Image Prompts:** For the introduction, EACH chapter, and the conclusion, you MUST create a descriptive 'imagePrompt'. This prompt must describe a relevant, professional, and visually appealing image that illustrates the section's core theme. CRITICAL: If you include any text or words in the image, you MUST ensure they are spelled correctly.
7.  **Content Only:** The 'content' field for every section must ONLY contain the written text in academic Markdown. Do NOT include the title or image prompt in the content field.

Generate the complete document structure now.`,
});

const generateProjectReportFlow = ai.defineFlow(
  {
    name: 'generateProjectReportFlow',
    inputSchema: GenerateProjectReportInputSchema,
    outputSchema: GenerateProjectReportOutputSchema,
  },
  async (input) => {
    // 1. Generate the text outline and image prompts first.
    const { output: outline } = await prompt({
      topic: input.topic,
      numPages: input.numPages,
    });
    if (!outline) {
      throw new Error('Failed to generate document outline.');
    }

    // 2. Create a list of all sections that need an image.
    const sectionsWithPrompts = [
        outline.introduction, 
        ...outline.chapters, 
        outline.conclusion
    ].filter(section => section.imagePrompt);

    // 3. Generate images for all sections in parallel.
    const imageGenerationPromises = sectionsWithPrompts.map(section => {
        return ai.generate({
            model: 'googleai/imagen-4.0-fast-generate-001',
            prompt: `${section.imagePrompt}. CRITICAL: If you include any text or words in the image, you MUST ensure they are spelled correctly.`,
            config: {
              aspectRatio: '16:9',
            },
        });
    });

    const imageResults = await Promise.allSettled(imageGenerationPromises);

    // 4. Attach the generated image URLs back to their corresponding sections.
    imageResults.forEach((result, index) => {
        const section = sectionsWithPrompts[index];
        if (result.status === 'fulfilled' && result.value.media?.url) {
            section.imageUrl = result.value.media.url;
        } else {
            console.error(`Section "${section.title}" image generation failed.`);
            section.imageUrl = ''; // Set to empty string on failure
        }
    });

    // 5. Return the fully populated outline.
    return outline;
  }
);
