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
        event.target.value = ""; // Clear the input
        return;
      }
      // Allow only .txt, .md, .pdf for simplicity in this example.
      // For .pdf, actual text extraction would require a library on the backend or a more complex client-side solution.
      // Here, we'll primarily focus on text-based files.
      if (!['text/plain', 'text/markdown', 'application/pdf'].includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a .txt, .md, or .pdf file.",
          variant: "destructive",
        });
        setResumeFile(null);
        setResumeContent("");
        event.target.value = ""; // Clear the input
        return;
      }

      setResumeFile(file);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result as string;
        if (file.type === 'application/pdf') {
          // For actual PDF text extraction, you'd typically send the file to a backend
          // or use a client-side library like pdf.js.
          // For this example, we'll just put a placeholder and the filename.
          // In a real app, this would be where you integrate more complex PDF parsing.
          setResumeContent(`PDF file uploaded: ${file.name}\n\n[PDF content would be extracted here in a full implementation]`);
           toast({
            title: "PDF Uploaded",
            description: `${file.name} uploaded. PDF text extraction is a simplified placeholder.`,
            variant: "default",
          });
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
        description: "Please upload your resume.",
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
            <Label htmlFor="resume-file" className="text-lg font-semibold">Your Resume</Label>
            <Input
              id="resume-file"
              type="file"
              onChange={handleFileChange}
              accept=".txt,.md,.pdf" // Basic client-side filter
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              aria-label="Resume File Upload"
            />
            {resumeFile && (
              <div className="mt-2 flex items-center text-sm text-muted-foreground">
                <FileText className="h-4 w-4 mr-2" />
                <span>{resumeFile.name} ({(resumeFile.size / 1024).toFixed(2)} KB)</span>
              </div>
            )}
             {/* Optionally, show a preview or status of the resume content for non-PDFs */}
            {resumeContent && !resumeFile?.type.includes('pdf') && (
              <Textarea
                id="resume-preview"
                placeholder="Resume content will appear here..."
                value={resumeContent}
                readOnly
                rows={5}
                className="mt-2 resize-none bg-muted/50"
                aria-label="Resume Content Preview"
              />
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
