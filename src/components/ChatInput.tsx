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
    <form onSubmit={handleSubmit} className="relative">
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask about basketball rules... (e.g., 'What is traveling?' or 'Explain the 24-second shot clock')"
        disabled={disabled}
        className="pr-12 min-h-[60px] max-h-[200px] resize-none bg-background border-border focus-visible:ring-primary"
      />
      <Button
        type="submit"
        size="icon"
        disabled={!input.trim() || disabled}
        className="absolute right-2 bottom-2 h-8 w-8 bg-primary hover:bg-primary/90"
      >
        <Send className="w-4 h-4" />
      </Button>
    </form>
  );
};
