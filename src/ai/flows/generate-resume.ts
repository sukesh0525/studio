// src/ai/flows/generate-resume.ts
'use server';
/**
 * @fileOverview A flow to generate a resume based on various data sources like LinkedIn, uploaded files, and prompts.
 *
 * - generateResume - A function that handles the resume generation process.
 * - GenerateResumeInput - The input type for the generateResume function.
 * - GenerateResumeOutput - The return type for the generateResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateResumeInputSchema = z.object({
  linkedInUrl: z
    .string()
    .optional()
    .describe('Optional link to LinkedIn profile.'),
  uploadedFiles: z
    .array(z.string())
    .optional()
    .describe(
      'Optional array of data URIs representing uploaded files like certificates.'
    ),
  prompt: z.string().describe('Prompt providing instructions for the resume.'),
});
export type GenerateResumeInput = z.infer<typeof GenerateResumeInputSchema>;

const GenerateResumeOutputSchema = z.object({
  resume: z.string().describe('The generated resume.'),
});
export type GenerateResumeOutput = z.infer<typeof GenerateResumeOutputSchema>;

export async function generateResume(input: GenerateResumeInput): Promise<GenerateResumeOutput> {
  return generateResumeFlow(input);
}

const generateResumePrompt = ai.definePrompt({
  name: 'generateResumePrompt',
  input: {schema: GenerateResumeInputSchema},
  output: {schema: GenerateResumeOutputSchema},
  prompt: `You are a professional resume writer. Use the following information to generate a resume.  

      LinkedIn URL: {{linkedInUrl}}
      Uploaded Files: {{#each uploadedFiles}}{{{this}}} {{/each}}
      Prompt: {{{prompt}}}
      
      Please generate a professional resume based on the above information.
      `,
});

const generateResumeFlow = ai.defineFlow(
  {
    name: 'generateResumeFlow',
    inputSchema: GenerateResumeInputSchema,
    outputSchema: GenerateResumeOutputSchema,
  },
  async input => {
    const {output} = await generateResumePrompt(input);
    return output!;
  }
);
