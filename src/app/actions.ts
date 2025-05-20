// src/app/actions.ts
"use server";

import { generateInterviewQuestions as generateQuestionsFlow, GenerateInterviewQuestionsInput, GenerateInterviewQuestionsOutput } from "@/ai/flows/generate-interview-questions";
import { analyzeInterviewResponses as analyzeResponsesFlow, AnalyzeInterviewResponsesInput, AnalyzeInterviewResponsesOutput } from "@/ai/flows/analyze-interview-responses";

export async function generateInterviewQuestionAction(
  input: GenerateInterviewQuestionsInput
): Promise<GenerateInterviewQuestionsOutput> {
  try {
    return await generateQuestionsFlow(input);
  } catch (error) {
    console.error("Error generating interview question:", error);
    throw new Error("Failed to generate interview question. Please try again.");
  }
}

export async function analyzeInterviewResponsesAction(
  input: AnalyzeInterviewResponsesInput
): Promise<AnalyzeInterviewResponsesOutput> {
  try {
    return await analyzeResponsesFlow(input);
  } catch (error) {
    console.error("Error analyzing interview responses:", error);
    throw new Error("Failed to analyze responses. Please try again.");
  }
}
