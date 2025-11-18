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
        className="pr-14 pl-5 py-4 min-h-[70px] max-h-[200px] resize-none bg-card/50 backdrop-blur-sm border-2 border-border/50 focus-visible:border-primary/50 focus-visible:ring-4 focus-visible:ring-primary/10 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 text-[15px]"
        style={{
          boxShadow: "var(--shadow-inner)"
        }}
      />
      <Button
        type="submit"
        size="icon"
        disabled={!input.trim() || disabled}
        className="absolute right-3 bottom-3 h-10 w-10 bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 rounded-xl"
        style={{
          boxShadow: !input.trim() ? undefined : "var(--shadow-glow)"
        }}
      >
        <Send className="w-5 h-5" />
      </Button>
    </form>
  );
};
