// src/components/document-upload-form.tsx
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud } from "lucide-react";

interface DocumentUploadFormProps {
  onUploadComplete: (resume: string, jobDescription: string) => void;
  isLoading: boolean;
}

export function DocumentUploadForm({ onUploadComplete, isLoading }: DocumentUploadFormProps) {
  const [resume, setResume] = React.useState("");
  const [jobDescription, setJobDescription] = React.useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (resume.trim() && jobDescription.trim()) {
      onUploadComplete(resume, jobDescription);
    }
  };

  return (
    <Card className="w-full max-w-2xl shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <UploadCloud className="h-8 w-8 text-primary" />
          Prepare Your Interview
        </CardTitle>
        <CardDescription>
          Paste your resume and the job description below to start your AI-powered interview.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="resume" className="text-lg font-semibold">Your Resume</Label>
            <Textarea
              id="resume"
              placeholder="Paste your full resume text here..."
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              rows={10}
              required
              className="resize-none"
              aria-label="Resume Input"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="jobDescription" className="text-lg font-semibold">Job Description</Label>
            <Textarea
              id="jobDescription"
              placeholder="Paste the job description text here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={10}
              required
              className="resize-none"
              aria-label="Job Description Input"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full text-lg py-6 bg-primary hover:bg-primary/90" 
            disabled={isLoading || !resume.trim() || !jobDescription.trim()}
            aria-label="Start Interview"
          >
            {isLoading ? "Processing..." : "Start Interview"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
