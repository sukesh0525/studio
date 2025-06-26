'use server';
/**
 * @fileOverview A flow to verify if a resume appears to be genuine.
 *
 * - verifyResume - A function that analyzes resume text.
 * - VerifyResumeInput - The input type for the verifyResume function.
 * - VerifyResumeOutput - The return type for the verifyResume function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const VerifyResumeInputSchema = z.object({
  resumeText: z.string().describe('The full text content of a resume.'),
});
export type VerifyResumeInput = z.infer<typeof VerifyResumeInputSchema>;

const VerifyResumeOutputSchema = z.object({
  isGenuine: z
    .boolean()
    .describe('Whether the resume appears to be genuine and not auto-generated or placeholder content.'),
  feedback: z
    .string()
    .describe('A brief explanation of the reasoning behind the isGenuine assessment.'),
});
export type VerifyResumeOutput = z.infer<typeof VerifyResumeOutputSchema>;

export async function verifyResume(input: VerifyResumeInput): Promise<VerifyResumeOutput> {
  return verifyResumeFlow(input);
}

const verifyResumePrompt = ai.definePrompt({
  name: 'verifyResumePrompt',
  input: { schema: VerifyResumeInputSchema },
  output: { schema: VerifyResumeOutputSchema },
  prompt: `You are an expert HR professional who specializes in reviewing resumes. 
  
  Your task is to analyze the following resume text and determine if it appears to be a genuine, human-written document. 
  
  Look for signs that the resume might be fake, such as:
  - Nonsensical or Lorem Ipsum text.
  - Contradictory information.
  - Placeholder content like "[Your Name]" or "[Your Skill]".
  - Unrealistic job titles or experience for the given education.
  - Gibberish or poorly structured sentences.

  Based on your analysis, set the 'isGenuine' boolean field to true if the resume seems legitimate, and false otherwise. Provide a concise feedback statement explaining your assessment.

  Resume Text:
  {{{resumeText}}}
  `,
});

const verifyResumeFlow = ai.defineFlow(
  {
    name: 'verifyResumeFlow',
    inputSchema: VerifyResumeInputSchema,
    outputSchema: VerifyResumeOutputSchema,
  },
  async (input) => {
    const { output } = await verifyResumePrompt(input);
    return output!;
  }
);
