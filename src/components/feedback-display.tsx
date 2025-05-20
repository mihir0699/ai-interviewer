// src/components/feedback-display.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, BarChart3 } from "lucide-react";

interface FeedbackDisplayProps {
  feedback: string;
  onStartNewInterview: () => void;
}

export function FeedbackDisplay({ feedback, onStartNewInterview }: FeedbackDisplayProps) {
  // Basic parsing for strengths and improvements if feedback follows a pattern
  // This is a naive implementation and would ideally be more robust or rely on structured AI output
  const feedbackParts = feedback.split(/\n\s*\n/); // Split by double newlines
  
  return (
    <Card className="w-full max-w-2xl shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <BarChart3 className="h-8 w-8 text-primary" />
          Interview Feedback
        </CardTitle>
        <CardDescription>
          Here's an analysis of your interview performance.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none p-4 bg-muted/50 rounded-lg shadow">
            {feedbackParts.map((part, index) => {
                if (part.toLowerCase().startsWith("strengths:")) {
                    return <div key={index} className="mb-4"><h3 className="font-semibold text-accent">Strengths</h3><p>{part.substring("strengths:".length).trim()}</p></div>;
                }
                if (part.toLowerCase().startsWith("areas for improvement:")) {
                     return <div key={index} className="mb-4"><h3 className="font-semibold text-destructive/80">Areas for Improvement</h3><p>{part.substring("areas for improvement:".length).trim()}</p></div>;
                }
                return <p key={index} className="mb-2">{part}</p>;
            })}
        </div>
        <Button onClick={onStartNewInterview} className="w-full text-lg py-6 bg-primary hover:bg-primary/90">
          <CheckCircle className="mr-2 h-5 w-5" />
          Start New Interview
        </Button>
      </CardContent>
    </Card>
  );
}
