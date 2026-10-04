'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Sun, Moon, User, LogIn, ChevronDown, BookOpen, Settings, LogOut, Shield } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { useTheme } from '@/features/theme/ThemeContext';
import { useLanguage } from '@/features/language/LanguageContext';

export function Navbar() {
  const pathname = usePathname();
  const { user, profile, isAdmin, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const navLinks = [
    { name: t('Home', 'होम'), href: '/' },
    { name: t('Explore', 'एक्सप्लोर'), href: '/explore' },
    { name: t('Library', 'लाइब्रेरी'), href: '/library' },
  ];

  const isLoggedIn = Boolean(user);

  return (
    <header className="sticky top-0 z-40 w-full glass-nav px-4 lg:px-10 py-3 flex items-center justify-between border-b border-[var(--gold-border)]">
      {/* Brand: Logo & Navigation */}
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center group" title="Moksha Music">
          <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[var(--gold-primary)]/40 shadow-md shadow-[var(--gold-primary)]/20 group-hover:scale-105 transition-all">
            <Image
              src="/logo.png"
              alt="Moksha Music Logo"
              fill
              sizes="48px"
              className="object-cover"
              priority
            />
          </div>
        </Link>

        {/* Navigation Links: Home, Explore, Library */}
        <nav className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-[var(--gold-primary)] text-[#12090A] font-semibold shadow-md shadow-[var(--gold-primary)]/20'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--maroon-pill)]/40'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Right Controls: Admin Button, Theme Toggle, Language Switcher, Profile / Login */}
      <div className="flex items-center gap-3">
        {/* SEPARATE BUTTON FOR ADMINS ON NAVBAR */}
        {isAdmin && (
          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#381419] border border-[var(--gold-primary)] text-[var(--gold-primary)] font-bold text-xs shadow-md shadow-[var(--gold-primary)]/20 hover:bg-[var(--gold-primary)] hover:text-[#12090A] transition-all hover:scale-105 active:scale-95"
            title="Sanctuary Admin Dashboard"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin Dashboard</span>
          </Link>
        )}

        {/* Light / Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full border border-[var(--gold-border)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] text-[var(--gold-primary)] transition-all shadow-sm cursor-pointer"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Language Switcher */}
        <button
          onClick={toggleLanguage}
          className="px-3 py-1.5 rounded-full text-xs font-semibold border border-[var(--gold-border)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] text-[var(--gold-primary)] transition-all flex items-center gap-1 shadow-sm cursor-pointer"
          title="Toggle Language"
        >
          <span className={language === 'EN' ? 'text-[var(--gold-primary)] font-bold' : 'text-[var(--text-muted)]'}>EN</span>
          <span className="text-[var(--text-muted)]">|</span>
          <span className={language === 'HI' ? 'text-[var(--gold-primary)] font-bold' : 'text-[var(--text-muted)]'}>हिंदी</span>
        </button>

        {/* Profile Avatar / Login Button */}
        <div className="relative">
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 p-1.5 px-2 rounded-full border border-[var(--gold-border)] hover:border-[var(--gold-primary)] bg-[var(--bg-card)] transition-all cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full overflow-hidden relative bg-[var(--maroon-pill)] flex items-center justify-center text-[var(--gold-primary)] font-bold text-xs">
                  {profile?.avatar_url ? (
                    <Image
                      src={profile.avatar_url}
                      alt="Avatar"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span>{(profile?.display_name || user?.email || 'D')[0].toUpperCase()}</span>
                  )}
                </div>
                <span className="hidden sm:inline-block text-xs font-semibold text-[var(--text-primary)] max-w-[100px] truncate">
                  {profile?.display_name || user?.email?.split('@')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
              </button>

              {/* Profile Dropdown */}
              {isProfileMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 glass-panel rounded-2xl p-2 shadow-2xl z-50 border border-[var(--gold-border)] animate-in fade-in slide-in-from-top-2 duration-200"
                  onMouseLeave={() => setIsProfileMenuOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-[var(--gold-border)] mb-1">
                    <p className="text-xs font-semibold text-[var(--gold-primary)] truncate">
                      {profile?.display_name || user?.email?.split('@')[0]}
                    </p>
                    <p className="text-[10px] text-[var(--text-muted)] truncate">{user?.email}</p>
                    {isAdmin && (
                      <span className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#381419] border border-[var(--gold-border)] text-[9px] font-bold text-[var(--gold-primary)] uppercase tracking-wider">
                        <Shield className="w-2.5 h-2.5" /> Sanctuary Admin
                      </span>
                    )}
                  </div>

                  <Link
                    href="/library"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--maroon-pill)] transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
                    <span>{t('My Playlists', 'मेरी प्लेलिस्ट्स')}</span>
                  </Link>

                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[var(--gold-primary)] font-semibold hover:bg-[var(--maroon-pill)] transition-colors"
                    >
                      <Settings className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
                      <span>{t('Admin Dashboard', 'एडमिन डैशबोर्ड')}</span>
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      signOut();
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[#F87171] hover:bg-[var(--maroon-pill)] transition-colors mt-1 border-t border-[var(--gold-border)] cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t('Sign Out', 'लॉग आउट')}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 bg-[var(--gold-primary)] hover:opacity-90 text-[#12090A] px-4 py-2 rounded-full text-xs font-bold transition-all shadow-md shadow-[var(--gold-primary)]/20 hover:scale-105 active:scale-95"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{t('Sign In', 'साइन इन')}</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
