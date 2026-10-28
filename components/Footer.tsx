'use client';

import Link from 'next/link';
import { Camera, Heart, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-amber-50/50 to-amber-100/60 border-t border-amber-200/60 pt-12 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

          {/* Columna 1: Branding & Misión */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-800 text-amber-50 flex items-center justify-center">
                <Camera className="w-4 h-4" />
              </div>
              <span className="font-serif font-bold text-amber-950 text-lg">Viaje de Vida</span>
            </div>
            <p className="text-amber-900/75 text-sm leading-relaxed">
              Transformando entregables en experiencias emocionales inolvidables. Protegemos y compartimos cada momento con la calidez y seguridad que tu historia merece.
            </p>
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          <div>
            <h4 className="font-semibold text-amber-950 mb-3 text-sm tracking-wide uppercase">Navegación</h4>
            <ul className="space-y-2 text-sm text-amber-900/80">
              <li>
                <Link href="/" className="hover:text-amber-950 hover:underline">
                  Inicio & Portal
                </Link>
              </li>
              <li>
                <Link href="/empresa" className="hover:text-amber-950 hover:underline">
                  Gestor de Entregables (Empresa)
                </Link>
              </li>
              <li>
                <Link href="/ayuda" className="hover:text-amber-950 hover:underline">
                  Centro de Ayuda & FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Compromiso de Seguridad */}
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200/70 shadow-sm">
            <div className="flex items-center gap-2 font-semibold text-amber-900 text-sm mb-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Acceso Seguro y Privado</span>
            </div>
            <p className="text-xs text-amber-800/80 leading-relaxed">
              Cada entregable cuenta con contraseña única cifrada mediante bcrypt y descarga segura con URLs temporales de Supabase Storage.
            </p>
          </div>

        </div>

        <div className="pt-6 border-t border-amber-200/50 flex flex-col sm:flex-row items-center justify-between text-xs text-amber-800/70 gap-3">
          <p>© {new Date().getFullYear()} Viaje de Vida. Todos los derechos reservados.</p>
          <div className="flex items-center gap-1.5">
            <span>Hecho con</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>para guardar tus recuerdos más preciados</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
