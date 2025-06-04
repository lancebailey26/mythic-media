'use client';

import Link from 'next/link';

export default function Nav() {
  return (
    <nav className="w-full border-b border-zinc-800 py-4 bg-zinc-900">
      <div className="max-w-5xl mx-auto px-6 flex justify-center">
        <ul className="flex space-x-8 text-lg font-medium text-zinc-300">
          <li>
            <Link href="/" className="hover:text-white transition">Generate</Link>
          </li>
          <li>
            <Link href="/upload" className="hover:text-white transition">Upload</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
