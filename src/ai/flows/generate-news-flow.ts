'use server';
/**
 * @fileOverview A flow to generate daily news articles.
 *
 * - generateNews - A function that generates a list of news articles.
 * - GenerateNewsOutput - The return type for the generateNews function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const NewsArticleSchema = z.object({
  title: z.string().describe('The headline of the news article.'),
  description: z.string().describe('A brief summary of the news article.'),
  hint: z
    .string()
    .describe(
      'One or two keywords for generating a relevant image, e.g., "technology students".'
    ),
});

const GenerateNewsOutputSchema = z.object({
  articles: z
    .array(NewsArticleSchema)
    .describe('An array of 3 generated news articles.'),
});
export type GenerateNewsOutput = z.infer<typeof GenerateNewsOutputSchema>;

export async function generateNews(): Promise<GenerateNewsOutput> {
  return generateNewsFlow();
}

const generateNewsPrompt = ai.definePrompt({
  name: 'generateNewsPrompt',
  output: { schema: GenerateNewsOutputSchema },
  prompt: `You are a journalist for a professional news outlet focused on public sector opportunities in India. 
  
  Generate 3 recent-sounding, compelling news articles. Each article should consist of a title, a short description, and one or two image hint keywords. 
  
  The topics should be relevant to students and professionals looking for government jobs, internships, and developments in public policy, technology, and infrastructure.`,
});

const generateNewsFlow = ai.defineFlow(
  {
    name: 'generateNewsFlow',
    outputSchema: GenerateNewsOutputSchema,
  },
  async () => {
    const { output } = await generateNewsPrompt({});
    return output!;
  }
);
