import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative group">
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask about basketball rules... (e.g., 'What is traveling?' or 'Explain the 24-second shot clock')"
        disabled={disabled}
        className="pr-16 pl-6 py-5 min-h-[75px] max-h-[200px] resize-none bg-gradient-to-br from-white via-card to-basketball-blue/5 backdrop-blur-sm border-3 border-basketball-orange/30 focus-visible:border-basketball-orange/60 focus-visible:ring-4 focus-visible:ring-basketball-orange/20 hover:border-basketball-purple/40 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-[15px] font-medium"
        style={{
          boxShadow: "0 4px 16px rgba(234, 88, 12, 0.1), inset 0 2px 4px rgba(0, 0, 0, 0.04)"
        }}
      />
      <Button
        type="submit"
        size="icon"
        disabled={!input.trim() || disabled}
        className="absolute right-3 bottom-3 h-12 w-12 bg-gradient-to-br from-basketball-orange via-primary to-basketball-purple hover:from-basketball-orange/90 hover:via-primary/90 hover:to-basketball-purple/90 shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-200 rounded-xl border-2 border-white/50"
        style={{
          boxShadow: !input.trim() ? undefined : "0 8px 24px rgba(234, 88, 12, 0.4), 0 0 32px rgba(168, 85, 247, 0.2)"
        }}
      >
        <Send className="w-5 h-5" />
      </Button>
    </form>
  );
};
