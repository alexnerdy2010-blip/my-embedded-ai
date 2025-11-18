import { User, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export const ChatMessage = ({ role, content }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "flex gap-3 p-4 rounded-lg animate-in fade-in slide-in-from-bottom-2 duration-300",
        role === "user" 
          ? "bg-primary/5 ml-auto max-w-[80%]" 
          : "bg-card border max-w-[90%]"
      )}
    >
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          role === "user"
            ? "bg-primary text-primary-foreground"
            : "bg-basketball-orange text-white"
        )}
      >
        {role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
      </div>
      <div className="flex-1 space-y-2 pt-1">
        <p className="text-sm font-medium text-foreground/80">
          {role === "user" ? "You" : "RefAI"}
        </p>
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <p className="text-foreground leading-relaxed whitespace-pre-wrap">
            {content}
          </p>
        </div>
      </div>
    </div>
  );
};
