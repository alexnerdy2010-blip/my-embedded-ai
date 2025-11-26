import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export const SubscriptionPaywall = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('create-checkout');
      
      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Error",
        description: "Failed to start subscription process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Card className="w-full max-w-lg border-primary/20 shadow-xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <span className="text-3xl">🏀</span>
          </div>
          <CardTitle className="text-3xl font-bold">RefAI Premium</CardTitle>
          <CardDescription className="text-lg">
            Unlock unlimited access to basketball rules assistance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-5xl font-bold text-primary mb-2">€5</div>
            <div className="text-muted-foreground">per month</div>
            <div className="mt-2 inline-block bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-medium">
              3-day free trial
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-semibold text-center mb-4">What's included:</h3>
            <div className="space-y-2">
              {[
                "Unlimited basketball rules questions",
                "Real-time AI-powered responses",
                "FIBA regulations knowledge base",
                "Source citations for every answer",
                "Priority support"
              ].map((feature, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button 
            onClick={handleSubscribe} 
            disabled={isLoading}
            className="w-full text-lg h-12"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              "Start 3-Day Free Trial"
            )}
          </Button>
          <p className="text-xs text-center text-muted-foreground mt-2">
            Cancel anytime during the trial period at no charge
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};
