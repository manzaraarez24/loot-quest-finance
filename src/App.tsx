import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const { data, error } = await supabase
          .from('user_stats')
          .select('onboarding_completed')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error("Error checking onboarding status:", error);
          setNeedsOnboarding(false);
        } else {
          setNeedsOnboarding(!data?.onboarding_completed);
        }
      } catch (err) {
        console.error("Critical error in checkOnboarding:", err);
        setNeedsOnboarding(false);
      } finally {
        setCheckingOnboarding(false);
      }
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
      try {
        const { data, error } = await supabase
          .from('user_stats')
          .select('onboarding_completed')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching onboarding status:", error);
          setOnboardingCompleted(true); // Don't block user if check fails
        } else {
          setOnboardingCompleted(!!data?.onboarding_completed);
        }
      } catch (err) {
        console.error("Critical error in checkOnboarding:", err);
        setOnboardingCompleted(true);
      } finally {
        setCheckingOnboarding(false);
      }
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

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-neon-green font-display text-xl">Loading...</div>
      </div>
    );
  }

  if (!user || !isAdmin) {
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
          <CurrencyProvider>
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
                path="/auth"
                element={
                  <AuthRoute>
                    <Auth />
                  </AuthRoute>
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
                path="/admin"
                element={
                  <AdminRoute>
                    <Admin />
                  </AdminRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </CurrencyProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
