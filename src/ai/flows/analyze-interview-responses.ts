// src/ai/flows/analyze-interview-responses.ts
'use server';
/**
 * @fileOverview Analyzes interview responses and provides feedback.
 *
 * - analyzeInterviewResponses - A function that handles the analysis of interview responses and generates feedback.
 * - AnalyzeInterviewResponsesInput - The input type for the analyzeInterviewResponses function.
 * - AnalyzeInterviewResponsesOutput - The return type for the analyzeInterviewResponses function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeInterviewResponsesInputSchema = z.object({
  resume: z.string().describe('The resume of the candidate.'),
  jobDescription: z.string().describe('The job description for the role.'),
  interviewTranscript: z.string().describe('The full interview transcript.'),
});
export type AnalyzeInterviewResponsesInput = z.infer<typeof AnalyzeInterviewResponsesInputSchema>;

const AnalyzeInterviewResponsesOutputSchema = z.object({
  feedback: z.string().describe('The feedback on the interview performance.'),
});
export type AnalyzeInterviewResponsesOutput = z.infer<typeof AnalyzeInterviewResponsesOutputSchema>;

export async function analyzeInterviewResponses(input: AnalyzeInterviewResponsesInput): Promise<AnalyzeInterviewResponsesOutput> {
  return analyzeInterviewResponsesFlow(input);
}

const analyzeResponsesPrompt = ai.definePrompt({
  name: 'analyzeResponsesPrompt',
  input: {schema: AnalyzeInterviewResponsesInputSchema},
  output: {schema: AnalyzeInterviewResponsesOutputSchema},
  prompt: `You are an AI interview analyzer. You will analyze the interview transcript, resume, and job description to provide feedback to the candidate.

Consider the job description when evaluating skills of the candidate. Provide details on strengths and areas for improvement.

Resume: {{{resume}}}
Job Description: {{{jobDescription}}}
Interview Transcript: {{{interviewTranscript}}}`,
});

const analyzeInterviewResponsesFlow = ai.defineFlow(
  {
    name: 'analyzeInterviewResponsesFlow',
    inputSchema: AnalyzeInterviewResponsesInputSchema,
    outputSchema: AnalyzeInterviewResponsesOutputSchema,
  },
  async input => {
    const {output} = await analyzeResponsesPrompt(input);
    return output!;
  }
);
