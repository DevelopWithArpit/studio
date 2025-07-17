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
  prompt: `You are an expert code generator. Generate code according to the instructions and specifications provided. Consider any constraints that apply to the code, and apply them in your answer.

Instructions: {{{instructions}}}

{{#if constraints}}
Constraints:
Language: {{{constraints.language}}}
Frameworks: {{{constraints.frameworks}}}
Libraries: {{{constraints.libraries}}}
{{/if}}

Generated Code:`, 
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
