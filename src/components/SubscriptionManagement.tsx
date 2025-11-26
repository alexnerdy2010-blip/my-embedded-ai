import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/hooks/useSubscription";
import { Loader2, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const SubscriptionManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { subscribed, subscriptionEnd, status, isLoading: isCheckingSubscription, checkSubscription } = useSubscription();
  const { toast } = useToast();

  const handleManageSubscription = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast({
        title: "Error",
        description: "Failed to open subscription management. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    await checkSubscription();
    toast({
      title: "Refreshed",
      description: "Subscription status updated.",
    });
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = () => {
    if (!subscribed) return <Badge variant="secondary">No Active Subscription</Badge>;
    if (status === 'trialing') return <Badge className="bg-primary/10 text-primary">Free Trial</Badge>;
    if (status === 'active') return <Badge variant="default">Active</Badge>;
    return <Badge variant="secondary">{status}</Badge>;
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Subscription Status</CardTitle>
            <CardDescription>Manage your RefAI subscription</CardDescription>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isCheckingSubscription}
          >
            <RefreshCw className={`h-4 w-4 ${isCheckingSubscription ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Status:</span>
            {getStatusBadge()}
          </div>
          
          {subscribed && subscriptionEnd && (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">
                {status === 'trialing' ? 'Trial ends:' : 'Next billing:'}
              </span>
              <span className="text-sm text-muted-foreground">{formatDate(subscriptionEnd)}</span>
            </div>
          )}
          
          {subscribed && (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Plan:</span>
              <span className="text-sm text-muted-foreground">RefAI Premium - €5/month</span>
            </div>
          )}
        </div>

        {subscribed && (
          <Button 
            onClick={handleManageSubscription} 
            disabled={isLoading}
            className="w-full"
            variant="outline"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Manage Subscription"
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
