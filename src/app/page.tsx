// src/app/page.tsx
"use client";

import * as React from "react";
import { DocumentUploadForm } from "@/components/document-upload-form";
import { ChatInterface } from "@/components/chat-interface";
import { FeedbackDisplay } from "@/components/feedback-display";
import { AInterviewerLiteLogo } from "@/components/a-interviewer-lite-logo";
import { analyzeInterviewResponsesAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type AppState = "INITIAL" | "INTERVIEWING" | "ANALYZING" | "FEEDBACK_READY";

export default function HomePage() {
  const [appState, setAppState] = React.useState<AppState>("INITIAL");
  const [resume, setResume] = React.useState<string>("");
  const [jobDescription, setJobDescription] = React.useState<string>("");
  const [feedback, setFeedback] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { toast } = useToast();

  const handleUploadComplete = (res: string, jd: string) => {
    setResume(res);
    setJobDescription(jd);
    setAppState("INTERVIEWING");
  };

  const handleInterviewEnd = async (transcript: string) => {
    setAppState("ANALYZING");
    setIsLoading(true);
    try {
      const result = await analyzeInterviewResponsesAction({
        resume,
        jobDescription,
        interviewTranscript: transcript,
      });
      setFeedback(result.feedback);
      setAppState("FEEDBACK_READY");
    } catch (error) {
      toast({
        title: "Error Analyzing Feedback",
        description: error instanceof Error ? error.message : "Could not generate feedback.",
        variant: "destructive",
      });
      setAppState("INTERVIEWING"); // Or back to initial? For now, let them retry ending.
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartNewInterview = () => {
    setResume("");
    setJobDescription("");
    setFeedback("");
    setAppState("INITIAL");
  };

  const renderContent = () => {
    switch (appState) {
      case "INITIAL":
        return <DocumentUploadForm onUploadComplete={handleUploadComplete} isLoading={isLoading} />;
      case "INTERVIEWING":
        return <ChatInterface resume={resume} jobDescription={jobDescription} onInterviewEnd={handleInterviewEnd} />;
      case "ANALYZING":
        return (
          <Card className="w-full max-w-md p-8 text-center shadow-xl">
            <CardContent className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
              <p className="text-xl font-semibold text-foreground">Analyzing your interview...</p>
              <p className="text-muted-foreground">This may take a moment. Please wait.</p>
            </CardContent>
          </Card>
        );
      case "FEEDBACK_READY":
        return <FeedbackDisplay feedback={feedback} onStartNewInterview={handleStartNewInterview} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-background">
      <header className="mb-8">
        <AInterviewerLiteLogo />
      </header>
      <main className="w-full flex justify-center">
        {renderContent()}
      </main>
      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} AInterviewer Lite. All rights reserved.</p>
        <p className="mt-1">Powered by AI</p>
      </footer>
    </div>
  );
}
