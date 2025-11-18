import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { SourceDataPanel } from "@/components/SourceDataPanel";
import { Plus, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm RefAI, your basketball rules assistant with complete knowledge of the official FIBA 2024 rules. I can help you understand any basketball rule, violation, foul, or equipment specification. What would you like to know?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleNewChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "Hello! I'm RefAI, your basketball rules assistant with complete knowledge of the official FIBA 2024 rules. I can help you understand any basketball rule, violation, foul, or equipment specification. What would you like to know?",
      },
    ]);
  };

  const streamChat = async (userMessage: string) => {
    setIsLoading(true);
    const userMsg: Message = { role: "user", content: userMessage };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/basketball-chat`;
      
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ 
          messages: [...messages, userMsg].map(m => ({ 
            role: m.role, 
            content: m.content 
          }))
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          toast({
            title: "Rate Limit Exceeded",
            description: "Too many requests. Please try again in a moment.",
            variant: "destructive",
          });
          setMessages((prev) => prev.slice(0, -1));
          return;
        }
        if (response.status === 402) {
          toast({
            title: "Credits Exhausted",
            description: "AI credits have been exhausted. Please add credits to continue.",
            variant: "destructive",
          });
          setMessages((prev) => prev.slice(0, -1));
          return;
        }
        throw new Error("Failed to start stream");
      }

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let assistantContent = "";
      let hasAddedAssistant = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        textBuffer += decoder.decode(value, { stream: true });
        let newlineIndex: number;
        
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            
            if (content) {
              assistantContent += content;
              
              setMessages((prev) => {
                if (!hasAddedAssistant) {
                  hasAddedAssistant = true;
                  return [...prev, { role: "assistant", content: assistantContent }];
                }
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                  role: "assistant",
                  content: assistantContent,
                };
                return newMessages;
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
      
      // Final flush
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw || raw.startsWith(":") || !raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages((prev) => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                  role: "assistant",
                  content: assistantContent,
                };
                return newMessages;
              });
            }
          } catch {}
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b border-border/40 bg-gradient-to-r from-card/80 via-card/60 to-card/80 backdrop-blur-md sticky top-0 z-10 shadow-sm">
        <div className="container max-w-5xl mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-basketball-orange via-primary to-accent flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                style={{
                  boxShadow: "var(--shadow-glow)"
                }}
              >
                <span className="text-white font-bold text-2xl">🏀</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">RefAI</h1>
                <p className="text-xs text-muted-foreground font-medium">FIBA 2024 Official Rules • 278 pages embedded</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <SourceDataPanel />
              <Button
                variant="outline"
                size="sm"
                onClick={handleNewChat}
                className="gap-2 hover:bg-primary/5 hover:border-primary/30 hover:scale-105 transition-all duration-200 shadow-sm rounded-xl"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New Chat</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full" ref={scrollRef}>
          <div className="container max-w-4xl mx-auto px-4 py-8">
            <div className="space-y-5">
              {messages.map((message, index) => (
                <ChatMessage key={index} role={message.role} content={message.content} />
              ))}
              {isLoading && (
                <div className="flex gap-4 p-5 rounded-2xl bg-gradient-to-br from-card/50 to-card/30 border border-border/30 backdrop-blur-sm animate-in fade-in duration-500">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-basketball-orange/20 to-primary/10 flex items-center justify-center shadow-sm">
                    <Loader2 className="w-5 h-5 animate-spin text-basketball-orange" />
                  </div>
                  <p className="text-sm text-muted-foreground pt-2.5 font-medium">Analyzing basketball rules...</p>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className="border-t border-border/40 bg-gradient-to-r from-card/80 via-card/60 to-card/80 backdrop-blur-md shadow-lg">
        <div className="container max-w-4xl mx-auto px-4 py-5">
          <ChatInput onSend={streamChat} disabled={isLoading} />
          <p className="text-xs text-muted-foreground/80 text-center mt-3 font-medium">
            If you think the answer is wrong ask your assistant to reread it's data base and give you the right answer.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
