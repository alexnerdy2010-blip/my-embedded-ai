import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface SubscriptionContextType {
  subscribed: boolean;
  productId: string | null;
  subscriptionEnd: string | null;
  status: string | null;
  isLoading: boolean;
  checkSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [subscribed, setSubscribed] = useState(false);
  const [productId, setProductId] = useState<string | null>(null);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const checkSubscription = async () => {
    if (!user) {
      setSubscribed(false);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) throw error;
      
      setSubscribed(data.subscribed || false);
      setProductId(data.product_id || null);
      setSubscriptionEnd(data.subscription_end || null);
      setStatus(data.status || null);
    } catch (error) {
      console.error('Error checking subscription:', error);
      setSubscribed(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      checkSubscription();
      
      // Check subscription every 60 seconds
      const interval = setInterval(checkSubscription, 60000);
      return () => clearInterval(interval);
    } else {
      setSubscribed(false);
      setIsLoading(false);
    }
  }, [user]);

  return (
    <SubscriptionContext.Provider value={{
      subscribed,
      productId,
      subscriptionEnd,
      status,
      isLoading,
      checkSubscription
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
