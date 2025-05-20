// src/ai/flows/generate-interview-questions.ts
'use server';

/**
 * @fileOverview A flow for generating interview questions based on the user's resume, job description, and previous answers.
 *
 * - generateInterviewQuestions - A function that generates interview questions.
 * - GenerateInterviewQuestionsInput - The input type for the generateInterviewQuestions function.
 * - GenerateInterviewQuestionsOutput - The return type for the generateInterviewQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInterviewQuestionsInputSchema = z.object({
  resume: z.string().describe("The candidate's resume text."),
  jobDescription: z.string().describe('The job description text.'),
  previousAnswers: z.string().optional().describe("The candidate's previous answers and AI questions, if any, representing the conversation history."),
});
export type GenerateInterviewQuestionsInput = z.infer<typeof GenerateInterviewQuestionsInputSchema>;

const GenerateInterviewQuestionsOutputSchema = z.object({
  question: z.string().describe('The generated interview question.'),
});
export type GenerateInterviewQuestionsOutput = z.infer<typeof GenerateInterviewQuestionsOutputSchema>;

export async function generateInterviewQuestions(input: GenerateInterviewQuestionsInput): Promise<GenerateInterviewQuestionsOutput> {
  return generateInterviewQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInterviewQuestionsPrompt',
  input: {schema: GenerateInterviewQuestionsInputSchema},
  output: {schema: GenerateInterviewQuestionsOutputSchema},
  prompt: `You are an AI interviewer. Your goal is to conduct a comprehensive interview.
Based on the candidate's resume, the job description, and the **entire conversation history provided in 'Previous Answers'**, generate the **next relevant and unique** interview question. Avoid repeating questions that have already been asked.

Resume:
{{{resume}}}

Job Description:
{{{jobDescription}}}

Previous Answers (entire conversation history):
{{#if previousAnswers}}
{{{previousAnswers}}}
{{else}}
This is the beginning of the interview. Please ask an appropriate opening question.
{{/if}}

Next Question:`,
});

const generateInterviewQuestionsFlow = ai.defineFlow(
  {
    name: 'generateInterviewQuestionsFlow',
    inputSchema: GenerateInterviewQuestionsInputSchema,
    outputSchema: GenerateInterviewQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
