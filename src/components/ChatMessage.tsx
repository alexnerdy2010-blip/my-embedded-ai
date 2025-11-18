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
        "flex gap-4 p-5 rounded-2xl animate-in fade-in slide-in-from-bottom-3 duration-500",
        role === "user" 
          ? "bg-gradient-to-br from-primary/10 to-primary/5 ml-auto max-w-[85%] shadow-sm backdrop-blur-sm" 
          : "bg-gradient-to-br from-card to-card/80 border border-border/50 max-w-[90%] shadow-md hover:shadow-lg transition-shadow"
      )}
      style={{
        boxShadow: role === "assistant" ? "var(--shadow-soft)" : undefined
      }}
    >
      <div
        className={cn(
          "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-md transition-transform hover:scale-110",
          role === "user"
            ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground"
            : "bg-gradient-to-br from-basketball-orange to-accent text-white"
        )}
        style={{
          boxShadow: role === "assistant" ? "var(--shadow-glow)" : undefined
        }}
      >
        {role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
      </div>
      <div className="flex-1 space-y-2.5 pt-0.5">
        <p className="text-sm font-semibold text-foreground/90 tracking-wide">
          {role === "user" ? "You" : "RefAI"}
        </p>
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap text-[15px]">
            {content}
          </p>
        </div>
      </div>
    </div>
  );
};
