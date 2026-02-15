"use client";

import React, { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) router.push('/dashboard');
  };

  return (
    <div className="h-screen w-full bg-[#0F172A] flex items-center justify-center">
      <form onSubmit={handleSignIn} className="p-8 bg-slate-900 border border-white/10 rounded w-96">
        <h1 className="text-white font-mono mb-6">ACCESS TERMINAL</h1>
        <input
          type="email"
          placeholder="EMAIL"
          className="w-full mb-4 bg-slate-800 border border-white/10 text-white p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="PASSWORD"
          className="w-full mb-6 bg-slate-800 border border-white/10 text-white p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="w-full bg-[#D4AF37] text-black font-bold p-2 rounded">
          LOGIN
        </button>
      </form>
    </div>
  );
}
