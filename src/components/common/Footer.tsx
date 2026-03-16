'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-zinc-800 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Simo Motsa</h3>
            <p className="text-zinc-400">Director, Editor, VFX Generalist & Producer</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-zinc-400">
              <li><Link href="/site/direction" className="hover:text-white transition">Direction</Link></li>
              <li><Link href="/site/editorial" className="hover:text-white transition">Editorial</Link></li>
              <li><Link href="/site/vfx" className="hover:text-white transition">VFX</Link></li>
              <li><Link href="/site/production" className="hover:text-white transition">Production</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Follow</h4>
            <ul className="space-y-2 text-zinc-400">
              <li><a href="#" className="hover:text-white transition">LinkedIn</a></li>
              <li><a href="#" className="hover:text-white transition">Vimeo</a></li>
              <li><a href="#" className="hover:text-white transition">Reel</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-zinc-800 pt-8 text-center text-zinc-400">
          <p>&copy; {currentYear} Simo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
