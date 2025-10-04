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
import { googleAI } from '@genkit-ai/googleai';

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
  imagePrompt: z.string().describe("A descriptive text prompt for an AI image generator to create a relevant, professional-looking picture for this chapter's content. The image should be illustrative and not contain text."),
  imageUrl: z.string().optional().describe('The data URI of the generated image for this chapter.'),
});

const GenerateAcademicDocumentOutputSchema = z.object({
  title: z.string().describe('The main title of the generated document.'),
  introduction: z.string().describe('The content of the introduction chapter in Markdown format.'),
  chapters: z.array(ChapterSchema).describe('An array of generated chapters or sections for the document body.'),
  conclusion: z.string().describe('The content of the conclusion chapter in Markdown format.'),
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

**Instructions:**
1.  **Analyze and Expand:** Carefully analyze the provided outline and research notes. Flesh out each section with detailed, well-organized content to create a comprehensive academic paper. The total length should be substantial, aiming for 6-8 pages when printed.
2.  **Structure:** Generate the content for the Introduction, all body Chapters, and the Conclusion.
3.  **Image Prompts:** For each chapter (including Introduction and Conclusion), you MUST create a descriptive prompt for an AI image generator. The prompt should describe a relevant, professional, and visually appealing image that illustrates the chapter's core theme. The image should NOT contain any text.
4.  **Formatting:** All content must be written in clear, academic Markdown.

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

    const allChapters = [
        // Not generating images for intro/conclusion to save time/cost
        ...outline.chapters,
    ];

    const imageGenerationPromises = allChapters.map(chapter => {
        if (chapter.imagePrompt) {
            return ai.generate({
                model: 'googleai/imagen-4.0-fast-generate-001',
                prompt: `${chapter.imagePrompt}, professional, high quality, relevant for an academic paper`,
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
