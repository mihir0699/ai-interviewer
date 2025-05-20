// src/components/document-upload-form.tsx
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DocumentUploadFormProps {
  onUploadComplete: (resume: string, jobDescription: string) => void;
  isLoading: boolean;
}

export function DocumentUploadForm({ onUploadComplete, isLoading }: DocumentUploadFormProps) {
  const [resumeContent, setResumeContent] = React.useState("");
  const [resumeFile, setResumeFile] = React.useState<File | null>(null);
  const [jobDescription, setJobDescription] = React.useState("");
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please upload a resume smaller than 5MB.",
          variant: "destructive",
        });
        setResumeFile(null);
        setResumeContent("");
        event.target.value = ""; 
        return;
      }
      
      if (!['text/plain', 'text/markdown', 'application/pdf'].includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a .txt, .md, or .pdf file.",
          variant: "destructive",
        });
        setResumeFile(null);
        setResumeContent("");
        event.target.value = ""; 
        return;
      }

      setResumeFile(file);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result as string;
        if (file.type === 'application/pdf') {
          setResumeContent(`PDF file uploaded: ${file.name}\n\n[PDF content would be extracted here in a full implementation]`);
          // No toast here, info will be shown below input
        } else {
          setResumeContent(text);
        }
      };
      reader.onerror = () => {
        toast({
          title: "Error reading file",
          description: "Could not read the resume file.",
          variant: "destructive",
        });
        setResumeFile(null);
        setResumeContent("");
      };
      reader.readAsText(file);
    } else {
      setResumeFile(null);
      setResumeContent("");
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (resumeContent.trim() && jobDescription.trim()) {
      onUploadComplete(resumeContent, jobDescription);
    } else if (!resumeContent.trim() && resumeFile) {
       toast({
        title: "Resume Processing",
        description: "Still processing resume file. Please wait or try re-uploading.",
        variant: "default",
      });
    } else if (!jobDescription.trim()){
       toast({
        title: "Missing Job Description",
        description: "Please paste the job description.",
        variant: "destructive",
      });
    }
    else {
         toast({
        title: "Missing Resume",
        description: "Please upload or paste your resume.",
        variant: "destructive",
      });
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
          Upload your resume and paste the job description below to start your AI-powered interview.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="actual-file-input" className="text-lg font-semibold">Your Resume</Label>
            <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Label htmlFor="actual-file-input" className="cursor-pointer flex items-center justify-center sm:justify-start">
                  <UploadCloud className="mr-2 h-4 w-4" />
                  <span>{resumeFile ? "Change File" : "Upload Resume"}</span>
                </Label>
              </Button>
              <Input
                id="actual-file-input"
                type="file"
                onChange={handleFileChange}
                accept=".txt,.md,.pdf"
                className="sr-only"
                aria-label="Upload your resume file"
              />
              {resumeFile && (
                <div className="flex items-center text-sm text-muted-foreground pt-2 sm:pt-0">
                  <FileText className="h-4 w-4 mr-2 shrink-0" />
                  <span className="truncate" title={resumeFile.name}>
                    {resumeFile.name} ({(resumeFile.size / 1024).toFixed(2)} KB)
                  </span>
                </div>
              )}
            </div>

            {resumeContent && !resumeFile?.type.includes('pdf') && (
              <Textarea
                id="resume-preview"
                value={resumeContent}
                readOnly
                rows={5}
                className="mt-2 resize-none bg-muted/50"
                aria-label="Resume Content Preview"
              />
            )}
            {resumeFile?.type.includes('pdf') && resumeContent.includes('PDF file uploaded:') && (
              <Card className="mt-2 bg-muted/30 border-border/70">
                <CardContent className="p-3 text-sm text-muted-foreground space-y-1">
                  <p className="font-medium text-foreground/90">{resumeContent.split('\n')[0]}</p>
                  <p className="text-xs">
                    Note: For PDF files, content extraction is a placeholder. In a real application, this requires robust server-side parsing or a dedicated client-side library.
                  </p>
                </CardContent>
              </Card>
            )}
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
            disabled={isLoading || !resumeContent.trim() || !jobDescription.trim()}
            aria-label="Start Interview"
          >
            {isLoading ? "Processing..." : "Start Interview"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
