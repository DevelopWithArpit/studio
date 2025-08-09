
'use server';

/**
 * @fileOverview Generates a structured EVS Activity Report from an uploaded image.
 * 
 * - generateEvsReport - A function that generates the report.
 * - GenerateEvsReportInput - The input type for the function.
 * - GenerateEvsReportOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateEvsReportInputSchema = z.object({
  reportImageDataUri: z.string().describe("The EVS Activity report sheet image, as a data URI."),
});
export type GenerateEvsReportInput = z.infer<typeof GenerateEvsReportInputSchema>;

const StudentSchema = z.object({
    name: z.string().describe("The full name of the student."),
    rollNumber: z.string().describe("The student's roll number or ID."),
});

const GenerateEvsReportOutputSchema = z.object({
  collegeName: z.string().describe("The full name of the college."),
  department: z.string().describe("The name of the department."),
  session: z.string().describe("The academic session (e.g., '2024-25')."),
  semester: z.string().describe("The semester (e.g., '4th')."),
  facultyName: z.string().describe("The name of the faculty member."),
  date: z.string().describe("The date of the activity."),
  plantName: z.string().describe("The name of the plant submitted."),
  plantInfo: z.string().describe("The detailed information about the plant."),
  benefits: z.array(z.string()).describe("A list of the plant's benefits."),
  nutrientComposition: z.string().describe("The nutrient composition of the plant leaf."),
  students: z.array(StudentSchema).describe("A list of students who submitted the report."),
  reportImageUrl: z.string().describe("A generated image visually representing the plant from the report, in a professional style suitable for a report cover."),
});
export type GenerateEvsReportOutput = z.infer<typeof GenerateEvsReportOutputSchema>;

export async function generateEvsReport(input: GenerateEvsReportInput): Promise<GenerateEvsReportOutput> {
  return generateEvsReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateEvsReportPrompt',
  input: { schema: GenerateEvsReportInputSchema },
  output: { schema: GenerateEvsReportOutputSchema },
  prompt: `You are an expert at analyzing educational documents and extracting structured information. Analyze the following EVS Activity report image and extract all the required fields.

**EVS Activity Report Image:**
{{media url=reportImageDataUri}}

**Instructions:**
1.  **Extract All Text Fields:** Carefully read the document and extract all the information: College Name, Department, Session, Semester, Faculty Name, Date, Plant Name, Information about the Plant, Benefits of the plant, Nutrient composition, and all student names with their roll numbers.
2.  **Student List:** Compile a list of all students, including their roll numbers as written.
3.  **Image Generation Prompt:** Based on the "Name of the Plant Submitted", create a prompt to generate a high-quality, visually appealing image of that plant. The image should be suitable for a report cover page.
4.  **Structure the Output:** Format the extracted information into the specified JSON output schema. Ensure all fields are populated accurately.

Extract the data now.`,
});

const generateEvsReportFlow = ai.defineFlow(
  {
    name: 'generateEvsReportFlow',
    inputSchema: GenerateEvsReportInputSchema,
    outputSchema: GenerateEvsReportOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to extract data from the EVS report.');
    }

    const imageGenerationPrompt = `A high-quality, professional image of an ${output.plantName} plant, suitable for an academic report cover. The plant should be the main focus, set against a clean, neutral background.`;
    
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: imageGenerationPrompt,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media?.url) {
      throw new Error('Failed to generate plant image.');
    }
    
    output.reportImageUrl = media.url;

    return output;
  }
);
