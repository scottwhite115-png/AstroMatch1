/**
 * React hook for authentication
 * Provides auth state and methods throughout the app
 */

import { useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import {
  getCurrentUser,
  getSession,
  onAuthStateChange,
} from "@/lib/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const initAuth = async () => {
      try {
        const { session } = await getSession();
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Error loading auth state:", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const subscription = onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    session,
    loading,
    isAuthenticated: !!user,
  };
}

/**
 * Hook to get current user's profile
 */
export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (err: any) {
        console.error("Error fetching profile:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  return { profile, loading, error };
}

/**
 * Hook for protected routes
 * Redirects to login if not authenticated
 */
export function useRequireAuth(redirectTo: string = "/login") {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = redirectTo;
    }
  }, [user, loading, redirectTo]);

  return { user, loading };
}

