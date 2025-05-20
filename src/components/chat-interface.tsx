// src/components/chat-interface.tsx
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage, type Message } from "@/components/chat-message";
import { generateInterviewQuestionAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Send, LogOut, BotMessageSquare } from "lucide-react";

interface ChatInterfaceProps {
  resume: string;
  jobDescription: string;
  onInterviewEnd: (transcript: string) => void;
}

export function ChatInterface({ resume, jobDescription, onInterviewEnd }: ChatInterfaceProps) {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [currentAnswer, setCurrentAnswer] = React.useState("");
  const [isFetchingQuestion, setIsFetchingQuestion] = React.useState(true);
  const [isEndingInterview, setIsEndingInterview] = React.useState(false);
  const { toast } = useToast();
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  const formatTranscript = (): string => {
    return messages
      .filter(msg => msg.type === 'ai' || msg.type === 'user')
      .map(msg => `${msg.type === 'ai' ? 'AI' : 'Candidate'}: ${msg.content}`)
      .join("\n\n");
  };
  
  const fetchNextQuestion = React.useCallback(async () => {
    setIsFetchingQuestion(true);
    setMessages(prev => [...prev, {id: Date.now().toString() + '-loading', type: 'loading', content: '...'}]);
    try {
      const previousAnswers = messages
        .filter(msg => msg.type === 'ai' || msg.type === 'user')
        .map(msg => `${msg.type === 'ai' ? 'Question' : 'Answer'}: ${msg.content}`)
        .join("\n");

      const result = await generateInterviewQuestionAction({
        resume,
        jobDescription,
        previousAnswers: previousAnswers || undefined,
      });
      setMessages(prev => prev.filter(m => m.type !== 'loading')); // Remove loading indicator
      setMessages(prev => [...prev, { id: Date.now().toString(), type: "ai", content: result.question }]);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Could not fetch the next question.",
        variant: "destructive",
      });
      setMessages(prev => prev.filter(m => m.type !== 'loading')); // Remove loading indicator on error
    } finally {
      setIsFetchingQuestion(false);
    }
  }, [resume, jobDescription, messages, toast]);

  React.useEffect(() => {
    fetchNextQuestion();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Initial question fetch

  React.useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendAnswer = async () => {
    if (!currentAnswer.trim() || isFetchingQuestion) return;

    setMessages(prev => [...prev, { id: Date.now().toString(), type: "user", content: currentAnswer.trim() }]);
    setCurrentAnswer("");
    await fetchNextQuestion();
  };

  const handleEndInterview = () => {
    setIsEndingInterview(true);
    const transcript = formatTranscript();
    onInterviewEnd(transcript);
  };

  return (
    <Card className="w-full max-w-2xl h-[80vh] flex flex-col shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <BotMessageSquare className="h-8 w-8 text-primary" />
          AInterviewer Session
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0">
        <ScrollArea className="h-full p-6" ref={scrollAreaRef}>
          <div className="flex flex-col space-y-4">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <div className="flex w-full items-start space-x-2">
          <Textarea
            placeholder="Type your answer here..."
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            rows={3}
            className="flex-grow resize-none"
            disabled={isFetchingQuestion || isEndingInterview}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendAnswer();
              }
            }}
            aria-label="Your answer"
          />
          <div className="flex flex-col space-y-2">
            <Button onClick={handleSendAnswer} disabled={isFetchingQuestion || isEndingInterview || !currentAnswer.trim()} aria-label="Send Answer">
              <Send className="h-5 w-5" />
            </Button>
            <Button variant="destructive" onClick={handleEndInterview} disabled={isEndingInterview} aria-label="End Interview">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
