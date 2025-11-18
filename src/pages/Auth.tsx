import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { z } from "zod";

const emailSchema = z.string().email("Please enter a valid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters");

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && event === "SIGNED_IN") {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const validateInputs = (isSignup: boolean) => {
    try {
      emailSchema.parse(email);
      passwordSchema.parse(password);
      if (isSignup && !username.trim()) {
        throw new Error("Username is required");
      }
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else if (error instanceof Error) {
        toast({
          title: "Validation Error",
          description: error.message,
          variant: "destructive",
        });
      }
      return false;
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateInputs(true)) return;

    setIsLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            username: username,
          },
        },
      });

      if (error) {
        if (error.message.includes("User already registered")) {
          toast({
            title: "Account Already Exists",
            description: "This email is already registered. Please try logging in instead.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else if (data.user) {
        toast({
          title: "Account Created!",
          description: "Welcome to RefAI! You can now start chatting.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Signup Failed",
        description: error.message || "An error occurred during signup",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateInputs(false)) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast({
            title: "Login Failed",
            description: "Invalid email or password. Please try again.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else if (data.user) {
        toast({
          title: "Welcome Back!",
          description: "Successfully logged in to RefAI.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-basketball-blue/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-basketball-orange via-basketball-purple to-basketball-blue flex items-center justify-center shadow-2xl mx-auto mb-4"
            style={{
              boxShadow: "0 8px 32px rgba(234, 88, 12, 0.35), 0 0 64px rgba(168, 85, 247, 0.2)"
            }}
          >
            <span className="text-white font-bold text-4xl">🏀</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-basketball-orange via-basketball-purple to-basketball-blue bg-clip-text text-transparent mb-2">
            RefAI
          </h1>
          <p className="text-muted-foreground font-semibold">
            Your Basketball Rules Assistant
          </p>
        </div>

        <Card className="border-2 border-basketball-orange/20 shadow-xl backdrop-blur-sm bg-gradient-to-br from-card via-white to-card">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 p-1 bg-muted/50">
              <TabsTrigger 
                value="login"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-basketball-orange/20 data-[state=active]:to-basketball-purple/20 data-[state=active]:text-foreground font-semibold"
              >
                Login
              </TabsTrigger>
              <TabsTrigger 
                value="signup"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-basketball-orange/20 data-[state=active]:to-basketball-purple/20 data-[state=active]:text-foreground font-semibold"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="p-6">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="font-semibold">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="border-2 border-border/50 focus:border-basketball-orange/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="font-semibold">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="border-2 border-border/50 focus:border-basketball-orange/50"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-basketball-orange via-primary to-basketball-purple hover:from-basketball-orange/90 hover:via-primary/90 hover:to-basketball-purple/90 text-white font-bold shadow-lg"
                  disabled={isLoading}
                  style={{
                    boxShadow: "0 4px 16px rgba(234, 88, 12, 0.3)"
                  }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="p-6">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-username" className="font-semibold">Username</Label>
                  <Input
                    id="signup-username"
                    type="text"
                    placeholder="Your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={isLoading}
                    className="border-2 border-border/50 focus:border-basketball-orange/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="font-semibold">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="border-2 border-border/50 focus:border-basketball-orange/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="font-semibold">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="border-2 border-border/50 focus:border-basketball-orange/50"
                  />
                  <p className="text-xs text-muted-foreground">
                    Must be at least 6 characters
                  </p>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-basketball-orange via-primary to-basketball-purple hover:from-basketball-orange/90 hover:via-primary/90 hover:to-basketball-purple/90 text-white font-bold shadow-lg"
                  disabled={isLoading}
                  style={{
                    boxShadow: "0 4px 16px rgba(234, 88, 12, 0.3)"
                  }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-4">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Auth;