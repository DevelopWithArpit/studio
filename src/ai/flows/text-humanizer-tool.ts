'use server';

/**
 * @fileOverview Humanizes text to make it sound more natural.
 * 
 * - humanizeText - A function that rewrites text.
 * - HumanizeTextInput - The input type for the function.
 * - HumanizeTextOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const HumanizeTextInputSchema = z.object({
  text: z.string().describe('The text to be humanized.'),
  tone: z.enum(['Casual', 'Professional', 'Friendly', 'Witty', 'Formal']).describe('The desired tone for the rewritten text.'),
});
export type HumanizeTextInput = z.infer<typeof HumanizeTextInputSchema>;

const HumanizeTextOutputSchema = z.object({
  humanizedText: z.string().describe('The rewritten, more human-sounding text.'),
});
export type HumanizeTextOutput = z.infer<typeof HumanizeTextOutputSchema>;

export async function humanizeText(input: HumanizeTextInput): Promise<HumanizeTextOutput> {
  return humanizeTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'humanizeTextPrompt',
  input: { schema: HumanizeTextInputSchema },
  output: { schema: HumanizeTextOutputSchema },
  prompt: `You are an expert at rewriting text to make it sound more natural and human. Your task is to take the user's input text and rewrite it in a {{{tone}}} tone.

The goal is to eliminate robotic or overly formal language, improve the flow, and make the text more engaging and relatable, as if a real person wrote it. Do not just replace words; restructure sentences and adjust the style as needed to fit the requested tone.

Original Text:
---
{{{text}}}
---

Rewrite the text now.`,
});

const humanizeTextFlow = ai.defineFlow(
  {
    name: 'humanizeTextFlow',
    inputSchema: HumanizeTextInputSchema,
    outputSchema: HumanizeTextOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
