
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
        resumeContextPart = { text: `Here is the resume text:\n\n${resumeText}` };
    } else {
        throw new Error("Either resumeDataUri or resumeText must be provided.");
    }

    const profilePictureModel = userPhotoUri ? 'googleai/gemini-2.5-flash-image-preview' : 'googleai/imagen-4.0-generate-001';

    const profilePicturePrompt = userPhotoUri
      ? [
          { media: { url: userPhotoUri } },
          { text: `Based on the user's photo and their resume content, create a professional, high-quality headshot suitable for a LinkedIn profile picture. The background should be simple and professional, not distracting. The person should look friendly and approachable. The image must not contain any text.` },
          resumeContextPart,
        ]
      : [
          { text: `Generate a professional, high-quality headshot suitable for a LinkedIn profile picture for a person in the software engineering industry. The person should look friendly and approachable. The background should be simple and professional. Use the resume content to guide the style. The image must not contain any text.` },
          resumeContextPart,
        ];

    const coverBannerPrompt = [
        { text: `Analyze the user's resume content provided. Based on their industry, skills, and experience, generate a professional and abstract background image suitable for a LinkedIn cover banner (1584 x 396 pixels). The design should be modern, clean, and visually represent the user's professional field. For example, for a software engineer, it might incorporate subtle code-like patterns or abstract representations of data. For a graphic designer, it could be more artistic. The banner must not contain any text and should be visually appealing but not distracting. CRITICAL: If you include any text or words in the image, you MUST ensure they are spelled correctly.` },
        resumeContextPart,
    ];

    const [profilePicResult, coverBannerResult] = await Promise.all([
      ai.generate({
        model: profilePictureModel,
        prompt: profilePicturePrompt,
        config: { responseModalities: ['TEXT', 'IMAGE'] },
      }),
      ai.generate({
        model: 'googleai/imagen-4.0-generate-001',
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
