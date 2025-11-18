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
        "flex gap-4 p-6 rounded-2xl animate-in fade-in slide-in-from-bottom-3 duration-500 backdrop-blur-sm",
        role === "user" 
          ? "bg-gradient-to-br from-basketball-purple/15 via-basketball-blue/10 to-transparent ml-auto max-w-[85%] border border-basketball-purple/20" 
          : "bg-gradient-to-br from-card via-card/95 to-card/90 border-2 border-basketball-orange/20 max-w-[90%] shadow-lg hover:shadow-xl hover:border-basketball-orange/30 transition-all"
      )}
      style={{
        boxShadow: role === "assistant" ? "0 4px 24px rgba(234, 88, 12, 0.12)" : "0 2px 12px rgba(168, 85, 247, 0.08)"
      }}
    >
      <div
        className={cn(
          "flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center shadow-lg transition-all hover:scale-110 hover:rotate-6",
          role === "user"
            ? "bg-gradient-to-br from-basketball-purple via-basketball-blue to-secondary text-white"
            : "bg-gradient-to-br from-basketball-orange via-primary to-warning text-white"
        )}
        style={{
          boxShadow: role === "assistant" 
            ? "0 4px 16px rgba(234, 88, 12, 0.3)" 
            : "0 4px 16px rgba(168, 85, 247, 0.25)"
        }}
      >
        {role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
      </div>
      <div className="flex-1 space-y-3 pt-0.5">
        <p className="text-sm font-bold text-foreground tracking-wide">
          {role === "user" ? "You" : "RefAI"}
        </p>
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <p className="text-foreground/95 leading-relaxed whitespace-pre-wrap text-[15px]">
            {content}
          </p>
        </div>
      </div>
    </div>
  );
};
