'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const base = '/site';

  const isActive = (path: string) => pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-90 backdrop-blur-md border-b border-zinc-800 px-6">
      <nav className="max-w-full mx-auto py-4 flex items-center justify-between">
        <Link href="/site/selected-work" className="text-2xl font-bold text-white pl-7" style={{ fontFamily: "'Axion Kong', sans-serif", letterSpacing: '5px' }}>
          SIMO MOTSA
        </Link>
        {/* desktop links */}
        <div className="hidden md:flex gap-8 items-center">
          <Link href={`${base}/direction`} className={`transition ${isActive(`${base}/direction`) ? 'text-white border-b-2 border-white pb-1' : 'text-zinc-400 hover:text-white'}`}>
            DIRECTION
          </Link>
          <Link href={`${base}/editorial`} className={`transition ${isActive(`${base}/editorial`) ? 'text-white border-b-2 border-white pb-1' : 'text-zinc-400 hover:text-white'}`}>
            EDITORIAL
          </Link>
          <Link href={`${base}/vfx`} className={`transition ${isActive(`${base}/vfx`) ? 'text-white border-b-2 border-white pb-1' : 'text-zinc-400 hover:text-white'}`}>
            VFX
          </Link>
          <Link href={`${base}/production`} className={`transition ${isActive(`${base}/production`) ? 'text-white border-b-2 border-white pb-1' : 'text-zinc-400 hover:text-white'}`}>
            PRODUCTION
          </Link>
          <Link href={`${base}/contact`} className="px-6 py-2 bg-white text-black rounded-full font-medium hover:bg-zinc-200 transition">
            CONTACT
          </Link>
        </div>

        {/* mobile menu button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* mobile dropdown */}
      {open && (
        <div className="md:hidden bg-black bg-opacity-90 backdrop-blur-sm border-t border-zinc-800">
          <div className="flex flex-col px-6 py-4">
            <div className="space-y-3">
              <Link href={`${base}/direction`} className={`block transition ${isActive(`${base}/direction`) ? 'text-white border-b-2 border-white pb-1' : 'text-zinc-400 hover:text-white'}`} onClick={() => setOpen(false)}>
                DIRECTION
              </Link>
              <Link href={`${base}/editorial`} className={`block transition ${isActive(`${base}/editorial`) ? 'text-white border-b-2 border-white pb-1' : 'text-zinc-400 hover:text-white'}`} onClick={() => setOpen(false)}>
                EDITORIAL
              </Link>
              <Link href={`${base}/vfx`} className={`block transition ${isActive(`${base}/vfx`) ? 'text-white border-b-2 border-white pb-1' : 'text-zinc-400 hover:text-white'}`} onClick={() => setOpen(false)}>
                VFX
              </Link>
              <Link href={`${base}/production`} className={`block transition ${isActive(`${base}/production`) ? 'text-white border-b-2 border-white pb-1' : 'text-zinc-400 hover:text-white'}`} onClick={() => setOpen(false)}>
                PRODUCTION
              </Link>
            </div>
            <div className="border-t border-zinc-700 mt-4 pt-4">
              <Link href={`${base}/contact`} className="block px-6 py-2 bg-white text-black rounded-full font-medium hover:bg-zinc-200 transition text-center" onClick={() => setOpen(false)}>
                CONTACT
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
