'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  Sun,
  Moon,
  LogIn,
  ChevronDown,
  BookOpen,
  Settings,
  LogOut,
  Shield,
  Search,
  Music,
  Video,
  Info,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { useTheme } from '@/features/theme/ThemeContext';
import { useLanguage } from '@/features/language/LanguageContext';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, isAdmin, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navLinks = [
    { name: t('Music', 'संगीत'), href: '/music', icon: Music },
    { name: t('Videos', 'वीडियोस'), href: '/videos', icon: Video },
    { name: t('About Us', 'हमारे बारे में'), href: '/about', icon: Info },
    { name: t('My Playlists', 'मेरी प्लेलिस्ट्स'), href: '/library', icon: BookOpen },
  ];

  const isLoggedIn = Boolean(user);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/music?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-nav border-b border-[var(--gold-border)] px-3 sm:px-6 lg:px-10 py-2.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Brand Emblem & Navigation Links */}
        <div className="flex items-center gap-4 lg:gap-8 min-w-0">
          <Link href="/" className="flex items-center gap-3 shrink-0 group" title="Moksha Music">
            {/* Red / Copper Brand Crest Badge (T-Series inspired sacred medallion) */}
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl overflow-hidden border-2 border-[var(--gold-primary)] shadow-md shadow-[var(--gold-primary)]/20 group-hover:scale-105 transition-all bg-[var(--maroon-pill)] flex items-center justify-center p-1">
              <Image
                src="/logo.png"
                alt="Moksha Music"
                fill
                sizes="48px"
                className="object-cover"
                priority
              />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-laila font-black text-sm lg:text-base tracking-wider text-[var(--text-primary)] group-hover:text-[var(--gold-primary)] transition-colors leading-tight">
                MOKSHA MUSIC
              </span>
              <span className="text-[9px] font-devanagari font-semibold text-[var(--gold-primary)] tracking-wide">
                मोक्ष संगीत
              </span>
            </div>
          </Link>

          {/* Navigation Links: Music, Videos, About Us, My Playlists */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 shrink-0">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href === '/music' && pathname === '/explore');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-full text-xs xl:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bronze-pill text-white shadow-md'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--maroon-pill)]/50'
                  }`}
                >
                  <link.icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="whitespace-nowrap">{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Social Links, Search Bar, Theme/Lang, Sign In / Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Social Media Links (T-Series style in top right) */}
          <div className="hidden 2xl:flex items-center gap-1.5 pr-2 border-r border-[var(--gold-border)]/50 shrink-0">
            {/* YouTube */}
            <a
              href="https://www.youtube.com/@mokshamusic20"
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 rounded-full bg-[#FF0000]/10 hover:bg-[#FF0000] text-[#FF0000] hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm"
              title="YouTube @mokshamusic20"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>

            {/* Spotify */}
            <a
              href="https://open.spotify.com/artist/3n12VKEDUVES1qNzSdneYV"
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 rounded-full bg-[#1DB954]/10 hover:bg-[#1DB954] text-[#1DB954] hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm"
              title="Spotify Artist"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.485 17.306c-.215.353-.674.464-1.027.25-2.82-1.722-6.37-2.112-10.55-1.157-.403.093-.807-.156-.9-.558-.093-.402.156-.807.558-.9 4.582-1.047 8.513-.598 11.66 1.328.354.214.465.674.25 1.027zm1.464-3.256c-.27.44-.848.58-1.288.31-3.227-1.984-8.147-2.557-11.964-1.398-.498.15-1.027-.134-1.178-.632-.151-.497.134-1.026.632-1.177 4.364-1.325 9.79-.686 13.488 1.588.44.27.58.848.31 1.288zm.126-3.41c-3.87-2.298-10.257-2.51-13.938-1.392-.593.18-1.223-.157-1.403-.75-.18-.594.157-1.224.75-1.404 4.238-1.286 11.288-1.037 15.74 1.606.535.318.708 1.01.39 1.545-.318.536-1.01.71-1.545.39z" />
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 rounded-full bg-[#E4405F]/10 hover:bg-[#E4405F] text-[#E4405F] hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm"
              title="Instagram"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>

            {/* X */}
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 rounded-full bg-black/10 hover:bg-black text-[var(--text-primary)] hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm"
              title="X / Twitter"
            >
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>

          {/* Search Input Bar (T-Series style keywords input) */}
          <form onSubmit={handleSearchSubmit} className="hidden sm:flex items-center relative shrink-0">
            <input
              type="text"
              placeholder={t('Search...', 'खोजें...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[var(--bg-card)] border border-[var(--gold-border)] rounded-full py-1.5 pl-3 pr-7 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--gold-primary)] w-24 sm:w-32 lg:w-36 xl:w-44 focus:w-36 lg:focus:w-48 transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 text-[var(--gold-primary)] hover:opacity-80 transition-opacity cursor-pointer"
              title="Search"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Dedicated Admin Dashboard Button */}
          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bronze-pill text-white font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition-all shrink-0"
              title="Admin Dashboard"
            >
              <Shield className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden xl:inline whitespace-nowrap">Admin</span>
            </Link>
          )}

          {/* Theme Switcher: Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 rounded-full border border-[var(--gold-border)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] text-[var(--gold-primary)] transition-all shadow-sm cursor-pointer shrink-0"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          </button>

          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="px-2 sm:px-2.5 py-1.5 rounded-full text-xs font-semibold border border-[var(--gold-border)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] text-[var(--gold-primary)] transition-all flex items-center gap-1 shadow-sm cursor-pointer shrink-0"
            title="Toggle Language"
          >
            <span className={language === 'EN' ? 'text-[var(--gold-primary)] font-bold' : 'text-[var(--text-muted)]'}>EN</span>
            <span className="text-[var(--text-muted)] text-[10px]">|</span>
            <span className={language === 'HI' ? 'text-[var(--gold-primary)] font-bold' : 'text-[var(--text-muted)]'}>हिंदी</span>
          </button>

          {/* Profile / Sign In */}
          <div className="relative shrink-0">
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                  className="flex items-center gap-1.5 p-1 px-2 rounded-full border border-[var(--gold-border)] hover:border-[var(--gold-primary)] bg-[var(--bg-card)] transition-all cursor-pointer"
                >
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden relative bg-[var(--maroon-pill)] flex items-center justify-center text-[var(--gold-primary)] font-bold text-xs border border-[var(--gold-border)] shrink-0">
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
                  <ChevronDown className="w-3 h-3 text-[var(--gold-primary)]" />
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
                        <span className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--maroon-pill)] border border-[var(--gold-border)] text-[9px] font-bold text-[var(--gold-primary)] uppercase tracking-wider">
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
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[#DC2626] hover:bg-[var(--maroon-pill)] transition-colors mt-1 border-t border-[var(--gold-border)] cursor-pointer"
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
                className="flex items-center gap-1.5 bronze-pill text-white px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-md hover:scale-105 active:scale-95 whitespace-nowrap"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="whitespace-nowrap">{t('Sign In', 'साइन इन')}</span>
              </Link>
            )}
          </div>

          {/* Mobile / Tablet Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="lg:hidden p-1.5 sm:p-2 rounded-full border border-[var(--gold-border)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] text-[var(--gold-primary)] transition-all shadow-sm cursor-pointer shrink-0"
            title="Navigation Menu"
            aria-label="Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile / Tablet Dropdown Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden w-full border-t border-[var(--gold-border)] mt-2.5 pt-3 pb-2 px-2 space-y-2 animate-in slide-in-from-top-2 duration-200 bg-[var(--bg-card)]/95 backdrop-blur-xl rounded-2xl shadow-xl">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href === '/music' && pathname === '/explore');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                    isActive
                      ? 'bronze-pill text-white shadow-md'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--maroon-pill)]'
                  }`}
                >
                  <link.icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Search input */}
          <form
            onSubmit={(e) => {
              handleSearchSubmit(e);
              setIsMobileMenuOpen(false);
            }}
            className="sm:hidden flex items-center relative pt-1"
          >
            <input
              type="text"
              placeholder={t('Search...', 'खोजें...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--bg-surface)] border border-[var(--gold-border)] rounded-full py-2 pl-3.5 pr-8 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--gold-primary)]"
            />
            <button
              type="submit"
              className="absolute right-3 top-3.5 text-[var(--gold-primary)]"
              title="Search"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </header>
  );
}
