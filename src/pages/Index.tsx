import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { SourceDataPanel } from "@/components/SourceDataPanel";
import { Plus, Loader2, LogOut, CreditCard } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { useSubscription } from "@/hooks/useSubscription";
import { SubscriptionPaywall } from "@/components/SubscriptionPaywall";
import { SubscriptionManagement } from "@/components/SubscriptionManagement";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const { subscribed, isLoading: isSubscriptionLoading } = useSubscription();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm RefAI, your basketball rules assistant with complete knowledge of the official FIBA 2024 rules. I can help you understand any basketball rule, violation, foul, or equipment specification. What would you like to know?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsAuthLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsAuthLoading(false);
      
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

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

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      navigate("/auth");
    } catch (error: any) {
      toast({
        title: "Logout Failed",
        description: error.message || "An error occurred during logout",
        variant: "destructive",
      });
    }
  };

  if (isAuthLoading || isSubscriptionLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-muted/30 to-basketball-blue/5">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-basketball-orange mx-auto mb-4" />
          <p className="text-muted-foreground font-semibold">Loading RefAI...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to /auth
  }

  // Show paywall if user is not subscribed
  if (!subscribed) {
    return <SubscriptionPaywall />;
  }

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
    <div className="flex flex-col h-screen bg-gradient-to-br from-background via-muted/30 to-basketball-blue/5">
      {/* Header */}
      <header className="border-b-2 border-basketball-orange/20 bg-gradient-to-r from-card via-white to-card backdrop-blur-xl sticky top-0 z-10 shadow-lg">
        <div className="container max-w-5xl mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-basketball-orange via-basketball-purple to-basketball-blue flex items-center justify-center shadow-xl hover:scale-110 hover:rotate-12 transition-all duration-300"
                style={{
                  boxShadow: "0 8px 24px rgba(234, 88, 12, 0.35), 0 0 48px rgba(168, 85, 247, 0.2)"
                }}
              >
                <span className="text-white font-bold text-3xl">🏀</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-basketball-orange via-basketball-purple to-basketball-blue bg-clip-text text-transparent">RefAI</h1>
                <p className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-basketball-green"></span>
                  FIBA 2024 Official Rules • 278 pages embedded
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 bg-gradient-to-r from-basketball-purple/10 to-basketball-blue/10 hover:from-basketball-purple/20 hover:to-basketball-blue/20 border-2 border-basketball-purple/30 hover:border-basketball-purple/50 hover:scale-105 transition-all duration-200 shadow-md rounded-xl font-semibold"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span className="hidden sm:inline">Subscription</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <SubscriptionManagement />
                </DialogContent>
              </Dialog>
              <SourceDataPanel />
              <Button
                variant="outline"
                size="sm"
                onClick={handleNewChat}
                className="gap-2 bg-gradient-to-r from-basketball-orange/10 to-basketball-purple/10 hover:from-basketball-orange/20 hover:to-basketball-purple/20 border-2 border-basketball-orange/30 hover:border-basketball-orange/50 hover:scale-105 transition-all duration-200 shadow-md rounded-xl font-semibold"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New Chat</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-2 bg-gradient-to-r from-basketball-blue/10 to-basketball-purple/10 hover:from-basketball-blue/20 hover:to-basketball-purple/20 border-2 border-basketball-blue/30 hover:border-basketball-blue/50 hover:scale-105 transition-all duration-200 shadow-md rounded-xl font-semibold"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full" ref={scrollRef}>
          <div className="container max-w-4xl mx-auto px-4 py-8">
            <div className="space-y-6">
              {messages.map((message, index) => (
                <ChatMessage key={index} role={message.role} content={message.content} />
              ))}
              {isLoading && (
                <div className="flex gap-4 p-6 rounded-2xl bg-gradient-to-br from-basketball-blue/10 via-card to-basketball-purple/5 border-2 border-basketball-blue/30 backdrop-blur-sm animate-in fade-in duration-500 shadow-lg">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-basketball-orange/30 via-basketball-purple/20 to-basketball-blue/20 flex items-center justify-center shadow-md">
                    <Loader2 className="w-6 h-6 animate-spin text-basketball-orange" />
                  </div>
                  <p className="text-sm text-foreground pt-3 font-semibold">Analyzing basketball rules...</p>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className="border-t-2 border-basketball-orange/20 bg-gradient-to-r from-card via-white to-card backdrop-blur-xl shadow-2xl">
        <div className="container max-w-4xl mx-auto px-4 py-6">
          <ChatInput onSend={streamChat} disabled={isLoading} />
          <p className="text-xs text-muted-foreground/90 text-center mt-3 font-semibold">
            If you think the answer is wrong ask your assistant to reread it's data base and give you the right answer.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
