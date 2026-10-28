'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Camera, Sparkles, HelpCircle, Briefcase } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <header className="sticky top-0 z-50 bg-amber-50/80 backdrop-blur-md border-b border-amber-200/50 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-600 to-rose-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <span className="font-serif text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-900 via-rose-900 to-amber-800 bg-clip-text text-transparent flex items-center gap-1.5">
              Viaje de Vida
              <Sparkles className="w-4 h-4 text-amber-500 inline fill-amber-300" />
            </span>
            <p className="text-xs text-amber-800/70 font-medium hidden sm:block">
              Entregables de Recuerdos & Momentos
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-3">
          <Link
            href="/empresa"
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
              isActive('/empresa')
                ? 'bg-amber-900 text-amber-50 shadow-md shadow-amber-950/10'
                : 'text-amber-900/80 hover:text-amber-950 hover:bg-amber-100/60'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Panel Empresa</span>
          </Link>

          <Link
            href="/ayuda"
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
              isActive('/ayuda')
                ? 'bg-amber-900 text-amber-50 shadow-md shadow-amber-950/10'
                : 'text-amber-900/80 hover:text-amber-950 hover:bg-amber-100/60'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Guía y Ayuda</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
