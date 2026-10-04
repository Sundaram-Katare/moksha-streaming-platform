'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { Profile } from '@/types';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const LOCAL_STORAGE_USER_KEY = 'moksha_auth_user';
const LOCAL_STORAGE_PROFILE_KEY = 'moksha_auth_profile';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check if current user is admin
  const isUserAdmin = (currUser: User | null, currProfile: Profile | null): boolean => {
    if (!currUser && !currProfile) return false;
    if (currProfile?.role === 'admin') return true;
    if ((currUser?.app_metadata as any)?.role === 'admin') return true;
    if ((currUser?.user_metadata as any)?.role === 'admin') return true;
    return false;
  };

  const isAdmin = isUserAdmin(user, profile);

  const syncStoredUser = () => {
    try {
      const storedUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      const storedProfile = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
      if (storedUser) setUser(JSON.parse(storedUser));
      if (storedProfile) setProfile(JSON.parse(storedProfile));
    } catch {
      // Ignore
    }
  };

  const fetchProfile = async (userId: string, activeUser?: User | null) => {
    const targetUser = activeUser || user;
    const isMetaAdmin =
      (targetUser?.app_metadata as any)?.role === 'admin' ||
      (targetUser?.user_metadata as any)?.role === 'admin';

    let foundProfile: Profile | null = null;

    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (!error && data) {
          const profileRow = data as any;
          foundProfile = {
            ...(profileRow as Profile),
            role: isMetaAdmin ? 'admin' : (profileRow.role || 'user'),
          };
        }
      } catch {
        // Table not ready or RLS error
      }
    }

    if (!foundProfile) {
      // Check stored profile or create default
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.id === userId) {
            foundProfile = {
              ...parsed,
              role: isMetaAdmin ? 'admin' : parsed.role,
            };
          }
        }
      } catch {}

      if (!foundProfile) {
        foundProfile = {
          id: userId,
          display_name: targetUser?.user_metadata?.full_name || targetUser?.email?.split('@')[0] || 'Devotee',
          avatar_url: null,
          role: isMetaAdmin ? 'admin' : 'user',
          devotee_tier: 'Devotee Tier I',
          sadhana_streak_days: 1,
          total_meditation_minutes: 0,
          preferred_tuning: '432Hz',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }
    }

    setProfile(foundProfile);
    try {
      localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(foundProfile));
    } catch {}
  };

  useEffect(() => {
    syncStoredUser();

    if (!isSupabaseConfigured()) {
      setIsLoading(false);
      return;
    }

    const supabase = createClient();

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setSession(session);
        setUser(session.user);
        try {
          localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(session.user));
        } catch {}
        fetchProfile(session.user.id, session.user);
      }
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setSession(session);
        setUser(session.user);
        try {
          localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(session.user));
        } catch {}
        await fetchProfile(session.user.id, session.user);
      } else {
        // Only clear if explicitly signed out
        if (_event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
          setSession(null);
          try {
            localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
            localStorage.removeItem(LOCAL_STORAGE_PROFILE_KEY);
          } catch {}
        }
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const refreshAuth = async () => {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        setSession(session);
        await fetchProfile(session.user.id, session.user);
      }
    }
  };

  const signIn = async (email: string, password: string) => {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        return { error };
      }

      if (data?.session && data.user) {
        setSession(data.session);
        setUser(data.user);
        try {
          localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(data.user));
        } catch {}
        await fetchProfile(data.user.id, data.user);
        return { error: null };
      }
    }

    // Local fallback signin
    const userId = crypto.randomUUID();
    const localUser: any = {
      id: userId,
      email,
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    };

    const localProfile: Profile = {
      id: userId,
      display_name: email.split('@')[0],
      avatar_url: null,
      role: 'user',
      devotee_tier: 'Devotee Tier I',
      sadhana_streak_days: 1,
      total_meditation_minutes: 0,
      preferred_tuning: '432Hz',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setUser(localUser);
    setProfile(localProfile);
    try {
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(localUser));
      localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(localProfile));
    } catch {}

    return { error: null };
  };

  const signUp = async (email: string, password: string, displayName?: string) => {
    // 1. Call server API to register user (with email confirmed automatically)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, displayName }),
      });
      const data = await res.json();
      if (!data.success && data.error) {
        return { error: new Error(data.error) };
      }
    } catch (e: any) {
      console.warn('Server signup error, proceeding with client signup:', e.message);
    }

    // 2. Immediately sign in so session is established instantly!
    const { error: signInError } = await signIn(email, password);
    return { error: signInError };
  };

  const signOut = async () => {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        await supabase.auth.signOut();
      } catch {}
    }
    setUser(null);
    setSession(null);
    setProfile(null);
    try {
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
      localStorage.removeItem(LOCAL_STORAGE_PROFILE_KEY);
    } catch {}
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (profile && user) {
      const newProfile = { ...profile, ...updates };
      setProfile(newProfile);
      try {
        localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(newProfile));
      } catch {}
      if (isSupabaseConfigured()) {
        try {
          const supabase = createClient();
          await (supabase.from('profiles') as any).update(updates).eq('id', user.id);
        } catch {}
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        isAdmin,
        isLoading,
        signIn,
        signUp,
        signOut,
        updateProfile,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
