'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, User, Lock, Mail, Phone, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [demoNotice, setDemoNotice] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Placeholder login flow — user will connect backend/auth provider
    setTimeout(() => {
      setIsSubmitting(false);
      setDemoNotice(
        tab === 'signin'
          ? 'ലോഗിൻ ഡെമോ വിജയകരമായി പൂർത്തിയായി! നിങ്ങൾക്ക് ആവശ്യമുള്ള authentication സിസ്റ്റം ഇവിടെ ബന്ധിപ്പിക്കാം.'
          : 'അക്കൗണ്ട് രജിസ്ട്രേഷൻ ഡെമോ പൂർത്തിയായി!'
      );
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#111827] font-hatke-body flex flex-col justify-between select-none">
      {/* Top Header */}
      <header className="w-full bg-[#FFFFFF] border-b-2 border-[#111827] px-4 py-3 sm:px-8 flex items-center justify-between shadow-xs">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-black text-[#111827] hover:text-[#1F5C3A] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>തിരികെ അങ്ങാടിയിലേക്ക് (Back to Store)</span>
        </Link>

        {/* Brand Logo */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#FACC15] border-2 border-[#111827] shadow-[2px_2px_0px_#111827] p-1 flex items-center justify-center">
            <span className="text-xs font-black text-[#111827]">H</span>
          </div>
          <span className="text-sm font-black tracking-tight text-[#111827] font-hatke-title">
            hat<span className="hatke-k-tilt inline-block text-[#1F5C3A]">k</span>e<span className="text-[#1F5C3A]">.</span>haat
          </span>
        </div>
      </header>

      {/* Main Login / Register Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-[#FFFFFF] border-3 border-[#111827] shadow-[8px_8px_0px_#111827] rounded-3xl overflow-hidden">
          {/* Top Brand Banner */}
          <div className="bg-[#FAF9F6] border-b-2 border-[#111827] p-6 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#FACC15] border-2 border-[#111827] shadow-[3px_3px_0px_#111827] flex items-center justify-center mb-3">
              <User className="w-8 h-8 text-[#111827]" />
            </div>
            <h1 className="text-2xl font-black text-[#111827] font-hatke-title tracking-tight">
              {tab === 'signin' ? 'അക്കൗണ്ടിലേക്ക് സ്വാഗതം' : 'പുതിയ അക്കൗണ്ട് തുറക്കുക'}
            </h1>
            <p className="text-xs font-black text-[#1F5C3A] font-hatke-body uppercase tracking-wider mt-1">
              AUTHENTIC INDIAN DESI MART
            </p>

            {/* Toggle Tabs */}
            <div className="flex items-center bg-[#FFFFFF] border-2 border-[#111827] rounded-xl p-1 mt-5 shadow-[2px_2px_0px_#111827]">
              <button
                type="button"
                onClick={() => {
                  setTab('signin');
                  setDemoNotice(null);
                }}
                className={`flex-1 py-2 text-xs font-black rounded-lg transition-all cursor-pointer ${
                  tab === 'signin'
                    ? 'bg-[#111827] text-[#FFFFFF] shadow-sm'
                    : 'text-[#111827]/70 hover:text-[#111827]'
                }`}
              >
                Sign In (ലോഗിൻ)
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab('signup');
                  setDemoNotice(null);
                }}
                className={`flex-1 py-2 text-xs font-black rounded-lg transition-all cursor-pointer ${
                  tab === 'signup'
                    ? 'bg-[#111827] text-[#FFFFFF] shadow-sm'
                    : 'text-[#111827]/70 hover:text-[#111827]'
                }`}
              >
                Create Account (രജിസ്റ്റർ)
              </button>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {demoNotice && (
              <div className="p-3.5 rounded-xl bg-[#1F5C3A]/10 border-2 border-[#1F5C3A] text-[#1F5C3A] text-xs font-bold flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-[#1F5C3A] mt-0.5" />
                <span>{demoNotice}</span>
              </div>
            )}

            {tab === 'signup' && (
              <div>
                <label className="block text-xs font-black text-[#111827] uppercase tracking-wider mb-1.5">
                  നിങ്ങളുടെ പേര് (Full Name)
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-[#111827]/50" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. അൻഷിദ് / Anshid"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#FAF9F6] border-2 border-[#111827] rounded-xl pl-9 pr-3 py-2.5 text-xs font-bold text-[#111827] focus:bg-[#FFFFFF] focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-black text-[#111827] uppercase tracking-wider mb-1.5">
                ഫോൺ നമ്പർ അല്ലെങ്കിൽ ഇമെയിൽ (Mobile / Email)
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-[#111827]/50" />
                <input
                  type="text"
                  required
                  placeholder="name@example.com അല്ലെങ്കിൽ 9876543210"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full bg-[#FAF9F6] border-2 border-[#111827] rounded-xl pl-9 pr-3 py-2.5 text-xs font-bold text-[#111827] focus:bg-[#FFFFFF] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-black text-[#111827] uppercase tracking-wider">
                  പാസ്‌വേഡ് (Password)
                </label>
                {tab === 'signin' && (
                  <a href="#" className="text-[11px] font-bold text-[#1F5C3A] hover:underline">
                    Forgot Password?
                  </a>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-[#111827]/50" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#FAF9F6] border-2 border-[#111827] rounded-xl pl-9 pr-3 py-2.5 text-xs font-bold text-[#111827] focus:bg-[#FFFFFF] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] border-2 border-[#111827] shadow-[3px_3px_0px_#111827] text-[#111827] font-black text-sm tracking-wide transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#111827] cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#111827]" />
              <span>
                {isSubmitting
                  ? 'പ്രോസസ്സ് ചെയ്യുന്നു...'
                  : tab === 'signin'
                  ? 'ലോഗിൻ ചെയ്യുക (Sign In)'
                  : 'അക്കൗണ്ട് സൃഷ്ടിക്കുക (Register)'}
              </span>
            </button>

            {/* Note for developer / user */}
            <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#111827]/20 text-[11px] text-[#111827]/70 text-center font-medium">
              ℹ️ ഈ ലോഗിൻ പേജ് നിങ്ങൾക്ക് ഇഷ്ടാനുസരണം Firebase, NextAuth അല്ലെങ്കിൽ സ്വന്തം API വഴി ബന്ധിപ്പിക്കാം.
            </div>
          </form>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="w-full py-4 text-center text-xs font-bold text-[#111827]/60 font-mono">
        © Hatke Haat • 100% Authentic Indian Desi Mart
      </footer>
    </div>
  );
}
