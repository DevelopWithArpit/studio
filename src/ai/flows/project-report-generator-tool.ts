
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

const ChapterSchema = z.object({
  title: z.string().describe('The title of the chapter or section.'),
  content: z.string().describe('The full content of the chapter/section, written in well-structured Markdown format. This field must ONLY contain the text content for the chapter.'),
  imagePrompt: z.string().describe("A descriptive text prompt for an AI image generator to create a relevant, professional-looking picture for this chapter's content. The image should be illustrative and visually appealing."),
  imageUrl: z.string().optional().describe('The data URI of the generated image for this chapter.'),
});

const GenerateProjectReportOutputSchema = z.object({
  title: z.string().describe('The main title of the generated document.'),
  introduction: ChapterSchema.describe('The introduction chapter object, containing title, content, and imagePrompt.'),
  chapters: z.array(ChapterSchema).describe('An array of generated chapters or sections for the document body.'),
  conclusion: ChapterSchema.describe('The conclusion chapter object, containing title, content, and imagePrompt.'),
});
export type GenerateProjectReportOutput = z.infer<typeof GenerateProjectReportOutputSchema>;

export async function generateProjectReport(input: z.infer<typeof GenerateProjectReportInputSchema>): Promise<GenerateProjectReportOutput> {
  return generateProjectReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProjectReportPrompt',
  input: { schema: z.object({ topic: z.string(), numPages: z.number() }) },
  output: { schema: GenerateProjectReportOutputSchema },
  prompt: `You are an expert academic writer with deep knowledge across many subjects. Your task is to generate a comprehensive, well-structured academic document (like a thesis, research paper, or SIP report) on a given topic, with enough content to fill approximately {{{numPages}}} pages.

**Topic:** {{{topic}}}

**CRITICAL INSTRUCTIONS:**
1.  **Research and Write:** Based on your internal knowledge, conduct in-depth research on the specified topic and write a comprehensive academic paper.
2.  **Structure and Content:** You must generate a complete JSON object including a main 'title', an 'introduction' object, a 'chapters' array, and a 'conclusion' object.
3.  **Introduction and Conclusion Objects:** The 'introduction' and 'conclusion' fields must be objects, each containing a 'title', 'content', and a unique 'imagePrompt'.
4.  **Image Prompts:** For the introduction, EACH chapter, and the conclusion, you MUST create a descriptive 'imagePrompt'. This prompt must describe a relevant, professional, and visually appealing image that illustrates the section's core theme.
5.  **Content-Only Fields:** The 'content' field for every section must ONLY contain the written text in academic Markdown. Do NOT include the title or image prompt in the content field.

CRITICAL: Your entire output MUST be a single, valid JSON object that conforms to the schema. Do not output any text or explanation before or after the JSON object.`,
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

    // 2. Create a single list of all sections that need an image.
    const allSections = [
      outline.introduction,
      ...outline.chapters,
      outline.conclusion,
    ];

    // 3. Generate images for all sections in parallel.
    const imageGenerationPromises = allSections.map(section => {
      if (section.imagePrompt) {
        return ai.generate({
          model: 'googleai/imagen-4.0-ultra-generate-001',
          prompt: `${section.imagePrompt}. This image must not contain any text or words.`,
          config: {
            aspectRatio: '16:9',
          },
        });
      }
      return Promise.resolve(null); // Return null for sections without an image prompt
    });

    const imageResults = await Promise.allSettled(imageGenerationPromises);

    // 4. Attach the generated image URLs back to their corresponding sections.
    imageResults.forEach((result, index) => {
      const section = allSections[index];
      if (result.status === 'fulfilled' && result.value?.media?.url) {
        section.imageUrl = result.value.media.url;
      } else {
        console.error(`Section "${section.title}" image generation failed:`, result.status === 'rejected' ? result.reason : 'No URL returned');
        section.imageUrl = ''; // Set to empty string on failure
      }
    });
    
    // 5. Return the fully populated outline. The `allSections` array is an array of references to the objects in the outline, so the outline is already modified.
    return outline;
  }
);
