import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  
  useEffect(() => {
    const checkOnboarding = async () => {
      if (!user) {
        setCheckingOnboarding(false);
        return;
      }
      
      const { data } = await supabase
        .from('user_stats')
        .select('onboarding_completed')
        .eq('user_id', user.id)
        .maybeSingle();
      
      setNeedsOnboarding(!data?.onboarding_completed);
      setCheckingOnboarding(false);
    };
    
    if (!authLoading && user) {
      checkOnboarding();
    } else if (!authLoading) {
      setCheckingOnboarding(false);
    }
  }, [user, authLoading]);
  
  if (authLoading || checkingOnboarding) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-neon-green font-display text-xl">Loading...</div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  if (needsOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }
  
  return <>{children}</>;
}

function OnboardingRoute({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  
  useEffect(() => {
    const checkOnboarding = async () => {
      if (!user) {
        setCheckingOnboarding(false);
        return;
      }
      
      const { data } = await supabase
        .from('user_stats')
        .select('onboarding_completed')
        .eq('user_id', user.id)
        .maybeSingle();
      
      setOnboardingCompleted(!!data?.onboarding_completed);
      setCheckingOnboarding(false);
    };
    
    if (!authLoading && user) {
      checkOnboarding();
    } else if (!authLoading) {
      setCheckingOnboarding(false);
    }
  }, [user, authLoading]);
  
  if (authLoading || checkingOnboarding) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-neon-green font-display text-xl">Loading...</div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  if (onboardingCompleted) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

function AuthRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-neon-green font-display text-xl">Loading...</div>
      </div>
    );
  }
  
  if (user) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/onboarding" 
              element={
                <OnboardingRoute>
                  <Onboarding />
                </OnboardingRoute>
              } 
            />
            <Route 
              path="/auth" 
              element={
                <AuthRoute>
                  <Auth />
                </AuthRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
