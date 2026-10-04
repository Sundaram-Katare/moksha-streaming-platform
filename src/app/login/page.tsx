'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, User, ArrowRight, ShieldCheck, LogOut } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';

export default function AuthPage() {
  const router = useRouter();
  const { user, profile, isAdmin, signIn, signUp, signOut } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, displayName);
        if (error) {
          setErrorMsg(error.message);
        } else {
          // Full navigation ensures Navbar and session rehydrate immediately
          window.location.href = '/';
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setErrorMsg(error.message);
        } else {
          window.location.href = '/';
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // If already logged in, show active session
  if (user) {
    return (
      <div className="min-h-[85vh] w-full flex items-center justify-center px-4 py-12">
        <div className="relative w-full max-w-md glass-panel rounded-3xl p-8 sm:p-10 border border-[#E5C378]/30 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full overflow-hidden mx-auto border-2 border-[#E5C378] relative">
            <Image src="/logo.png" alt="Moksha Music" fill className="object-cover" />
          </div>

          <div className="space-y-1">
            <h2 className="font-cinzel text-xl font-bold text-[#F8F5EE]">
              Already Signed In
            </h2>
            <p className="text-xs text-[#A89A8A]">
              You are currently signed in as <span className="text-[#E5C378] font-bold">{user.email}</span>
            </p>
            {isAdmin && (
              <p className="text-[11px] text-[#34D399] font-bold uppercase tracking-wider pt-1">
                ✦ Sanctuary Administrator
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Link
              href="/"
              className="w-full py-3 rounded-full bg-[#E5C378] hover:bg-[#F7D78A] text-[#12090A] font-bold text-xs shadow-xl shadow-[#E5C378]/25 transition-all text-center"
            >
              Enter Sacred Sanctuary
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                className="w-full py-2.5 rounded-full bg-[#381419] border border-[#E5C378] text-[#E5C378] font-bold text-xs hover:bg-[#E5C378] hover:text-[#12090A] transition-all text-center"
              >
                Go to Admin Dashboard
              </Link>
            )}

            <button
              onClick={() => signOut()}
              className="w-full py-2.5 rounded-full border border-[#A83244]/40 text-[#F87171] hover:bg-[#2A1215] text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out from this Account</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] w-full flex items-center justify-center px-4 py-12">
      <div className="relative w-full max-w-md glass-panel rounded-3xl p-8 sm:p-10 border border-[#E5C378]/30 shadow-2xl space-y-6">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#E5C378]/10 rounded-full filter blur-[60px] pointer-events-none" />

        {/* Branding */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#E5C378] shadow-lg shadow-[#E5C378]/25">
            <Image src="/logo.png" alt="Moksha Music" fill className="object-cover" priority />
          </div>
          <div className="space-y-1">
            <h1 className="font-cinzel text-2xl font-bold text-[#E5C378]">
              Moksha Music
            </h1>
            <p className="font-devanagari text-sm text-[#F8F5EE]">
              जहाँ भक्ति संगीत बन जाती है
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-[#1A0D0E] rounded-full border border-[#E5C378]/20">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(false);
              setErrorMsg('');
            }}
            className={`py-2 text-xs font-semibold rounded-full transition-all cursor-pointer ${
              !isSignUp
                ? 'bg-[#E5C378] text-[#12090A] shadow-md font-bold'
                : 'text-[#C5BAAD] hover:text-[#F8F5EE]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(true);
              setErrorMsg('');
            }}
            className={`py-2 text-xs font-semibold rounded-full transition-all cursor-pointer ${
              isSignUp
                ? 'bg-[#E5C378] text-[#12090A] shadow-md font-bold'
                : 'text-[#C5BAAD] hover:text-[#F8F5EE]'
            }`}
          >
            Sign Up
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-[#381419] border border-[#A83244] text-xs text-[#F87171] text-center">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="text-[11px] font-semibold text-[#A89A8A] uppercase tracking-wider block mb-1">
                Full Name
              </label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-[#A89A8A] absolute left-3" />
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-[#170C0E] border border-[#E5C378]/20 rounded-xl py-2.5 pl-9 pr-3 text-xs text-[#F8F5EE] focus:outline-none focus:border-[#E5C378]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[11px] font-semibold text-[#A89A8A] uppercase tracking-wider block mb-1">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-[#A89A8A] absolute left-3" />
              <input
                type="email"
                required
                placeholder="devotee@sanctuary.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#170C0E] border border-[#E5C378]/20 rounded-xl py-2.5 pl-9 pr-3 text-xs text-[#F8F5EE] focus:outline-none focus:border-[#E5C378]"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#A89A8A] uppercase tracking-wider block mb-1">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-[#A89A8A] absolute left-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#170C0E] border border-[#E5C378]/20 rounded-xl py-2.5 pl-9 pr-3 text-xs text-[#F8F5EE] focus:outline-none focus:border-[#E5C378]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-full bg-[#E5C378] hover:bg-[#F7D78A] text-[#12090A] font-bold text-xs shadow-xl shadow-[#E5C378]/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <span>{isLoading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-[11px] text-[#8E8275]">
            Secure sanctuary authentication with PostgreSQL &amp; Row Level Security.
          </p>
        </div>
      </div>
    </div>
  );
}
