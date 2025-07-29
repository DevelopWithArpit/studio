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

    const profilePicturePrompt = userPhotoUri
      ? [
          { media: { url: userPhotoUri } },
          { text: `Based on the user's photo and their resume content, create a professional, high-quality headshot suitable for a LinkedIn profile picture. The background should be simple and professional, not distracting. The person should look friendly and approachable.` },
          resumeContextPart,
        ]
      : [
          { text: `Generate a professional, high-quality headshot suitable for a LinkedIn profile picture for a person in the software engineering industry. The person should look friendly and approachable. The background should be simple and professional. Use the resume content to guide the style.` },
          resumeContextPart,
        ];

    const coverBannerPrompt = [
        { text: `Generate a professional, abstract background image to be used as a LinkedIn cover banner (1584 x 396 pixels). The design should be modern, clean, and relevant to the user's industry based on their resume. It should not contain any text. It should be visually appealing but not distracting.` },
        resumeContextPart,
    ];

    const [profilePicResult, coverBannerResult] = await Promise.all([
      ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: profilePicturePrompt,
        config: { responseModalities: ['TEXT', 'IMAGE'] },
      }),
      ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: coverBannerPrompt,
        config: { responseModalities: ['TEXT', 'IMAGE'] },
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
