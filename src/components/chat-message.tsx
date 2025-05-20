// src/components/chat-message.tsx
"use client";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";

export interface Message {
  id: string;
  type: "user" | "ai" | "system" | "loading";
  content: string;
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.type === "user";
  const isAI = message.type === "ai";
  const isSystem = message.type === "system";
  const isLoading = message.type === "loading";

  if (isSystem) {
    return (
      <div className="my-4 text-center text-sm text-muted-foreground">
        {message.content}
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="flex items-start space-x-3 my-4 self-start">
        <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
          <AvatarFallback><Bot className="h-5 w-5" /></AvatarFallback>
        </Avatar>
        <div className={cn(
          "p-3 rounded-lg max-w-xs lg:max-w-md shadow-md",
          "bg-muted"
        )}>
          <div className="animate-pulse flex space-x-2">
            <div className="rounded-full bg-muted-foreground h-2 w-2"></div>
            <div className="rounded-full bg-muted-foreground h-2 w-2"></div>
            <div className="rounded-full bg-muted-foreground h-2 w-2"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "flex items-start space-x-3 my-4",
        isUser ? "self-end flex-row-reverse space-x-reverse" : "self-start"
      )}
    >
      <Avatar className={cn("h-8 w-8", isUser ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground")}>
        <AvatarFallback>
          {isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
        </AvatarFallback>
      </Avatar>
      <div
        className={cn(
          "p-3 rounded-lg max-w-xs lg:max-w-md shadow-md whitespace-pre-wrap",
          isUser ? "bg-accent text-accent-foreground" : "bg-card text-card-foreground border"
        )}
      >
        {message.content}
      </div>
    </div>
  );
}
