
'use server';

/**
 * @fileOverview Generates a structured academic document based on a topic and research notes.
 * 
 * - generateAcademicDocument - A function that generates thesis content.
 * - GenerateAcademicDocumentInput - The input type for the function.
 * - GenerateAcademicDocumentOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateAcademicDocumentInputSchema = z.object({
  topic: z.string().describe("The main topic or title of the project."),
  collegeName: z.string().describe("The name of the student's college."),
  departmentName: z.string().describe("The name of the department."),
  semester: z.string().describe("The current semester."),
  year: z.string().describe("The academic year."),
  subject: z.string().describe("The subject of the project."),
  studentName: z.string().describe("The student's full name."),
  rollNumber: z.string().describe("The student's class roll number."),
  guideName: z.string().describe("The name of the project guide."),
  documentDataUri: z.string().describe("A document containing the outline and research notes for the academic paper, as a data URI. Format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type GenerateAcademicDocumentInput = z.infer<typeof GenerateAcademicDocumentInputSchema>;

const ChapterSchema = z.object({
  title: z.string().describe('The title of the chapter or section.'),
  content: z.string().describe('The full content of the chapter/section, written in well-structured Markdown format.'),
  imagePrompt: z.string().describe("A descriptive text prompt for an AI image generator to create a relevant, professional-looking picture for this chapter's content. CRITICAL: Any text or words in the image MUST be spelled correctly."),
  imageUrl: z.string().optional().describe('The data URI of the generated image for this chapter.'),
});

const GenerateAcademicDocumentOutputSchema = z.object({
  title: z.string().describe('The main title of the generated document.'),
  introduction: ChapterSchema.describe('An object for the introduction chapter, containing a title, content, and imagePrompt.'),
  chapters: z.array(ChapterSchema).describe('An array of generated chapters or sections for the document body, each with a title, content, and imagePrompt.'),
  conclusion: ChapterSchema.describe('An object for the conclusion chapter, containing a title, content, and imagePrompt.'),
});
export type GenerateAcademicDocumentOutput = z.infer<typeof GenerateAcademicDocumentOutputSchema>;

export async function generateAcademicDocument(input: GenerateAcademicDocumentInput): Promise<GenerateAcademicDocumentOutput> {
  return generateAcademicDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAcademicDocumentPrompt',
  input: { schema: z.object({ documentDataUri: z.string(), topic: z.string() }) },
  output: { schema: GenerateAcademicDocumentOutputSchema },
  prompt: `You are an expert academic writer. Your task is to generate a well-structured academic document (like a thesis, research paper, or SIP report) based on the user's uploaded document, which contains an outline and research notes. The generated content should be detailed enough to fill approximately 6-8 printed pages.

**Topic:** {{{topic}}}

**Uploaded Document (Outline & Notes):**
{{media url=documentDataUri}}

**CRITICAL INSTRUCTIONS:**
1.  **Analyze and Expand:** Carefully analyze the provided outline and research notes. Flesh out each section with detailed, well-organized content to create a comprehensive academic paper.
2.  **Structure:** Your entire output must be a single JSON object that perfectly matches the output schema. You must generate content for 'title', 'introduction', 'chapters', and 'conclusion'.
3.  **Introduction and Conclusion Objects:** The 'introduction' and 'conclusion' fields must be objects, each containing a 'title', 'content', and a unique 'imagePrompt'.
4.  **Image Prompts:** For the introduction, EACH chapter in the 'chapters' array, and the conclusion, you MUST create a descriptive prompt for an AI image generator. This prompt must describe a relevant, professional, and visually appealing image that illustrates the section's core theme. CRITICAL: If you include any text or words in the image, you MUST ensure they are spelled correctly.
5.  **Content Only:** The 'content' field for every section (introduction, chapters, conclusion) must ONLY contain the written text in academic Markdown. Do NOT include the title or image prompt in the content field.
6.  **Formatting:** All content must be written in clear, academic Markdown.

Generate the complete document structure now.`,
});

const generateAcademicDocumentFlow = ai.defineFlow(
  {
    name: 'generateAcademicDocumentFlow',
    inputSchema: GenerateAcademicDocumentInputSchema,
    outputSchema: GenerateAcademicDocumentOutputSchema,
  },
  async (input) => {
    const { output: outline } = await prompt({
      documentDataUri: input.documentDataUri,
      topic: input.topic,
    });
    if (!outline) {
      throw new Error('Failed to generate document outline.');
    }

    const allSections = [outline.introduction, ...outline.chapters, outline.conclusion];

    const imageGenerationPromises = allSections.map(section => {
        if (section.imagePrompt) {
            return ai.generate({
                model: 'googleai/imagen-4.0-fast-generate-001',
                prompt: `${section.imagePrompt}. CRITICAL: If you include any text or words in the image, you MUST ensure they are spelled correctly.`,
            });
        }
        return Promise.resolve({ media: null });
    });

    const results = await Promise.allSettled(imageGenerationPromises);
    
    results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value.media?.url) {
            allSections[index].imageUrl = result.value.media.url;
        } else {
            console.error(`Chapter ${index + 1} image generation failed.`);
            allSections[index].imageUrl = '';
        }
    });

    return outline;
  }
);
