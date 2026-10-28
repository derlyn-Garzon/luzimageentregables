'use client';

import Link from 'next/link';
import { Sparkles, ShieldCheck, Heart, Lock, Briefcase, HelpCircle, FileText } from 'lucide-react';

export default function HomePage() {
  const demoEntregableId = '123e4567-e89b-12d3-a456-426614174000';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">

      {/* Hero Section */}
      <div className="relative rounded-3xl bg-gradient-to-tr from-stone-900 via-amber-950 to-stone-900 p-8 sm:p-14 text-white shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-semibold uppercase tracking-wide">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Plataforma de Entrega Emocional de Imágenes</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-6xl font-bold tracking-tight leading-tight text-amber-50">
            Transforma tus imágenes en un <span className="bg-gradient-to-r from-amber-300 via-rose-300 to-amber-200 bg-clip-text text-transparent">&ldquo;Viaje de Vida&rdquo;</span>
          </h1>

          <p className="text-amber-100/80 text-base sm:text-xl leading-relaxed font-normal">
            Gestiona carpetas de productos entregables, asocia metadatos de clientes y genera enlaces dinámicos con contraseñas cifradas. Un espacio íntimo donde cada recuerdo cobra vida.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link
              href="/empresa"
              className="px-7 py-4 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-stone-950 font-extrabold rounded-2xl shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <Briefcase className="w-5 h-5" />
              <span>Panel Empresa (Administración)</span>
            </Link>

            <Link
              href={`/entregable/${demoEntregableId}`}
              className="px-7 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl border border-white/20 transition-all flex items-center justify-center gap-2 text-sm sm:text-base backdrop-blur-md"
            >
              <Lock className="w-5 h-5 text-amber-300" />
              <span>Probar Portal Cliente (Demo)</span>
            </Link>
          </div>
        </div>

        {/* Floating badge for password demo */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-amber-200/70 gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Clave Demo para probar el cliente: <code className="bg-amber-900/60 px-2 py-0.5 rounded text-amber-200 font-mono font-bold">AMOR2026</code></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            <span>Seguridad Supabase & Hashing bcrypt</span>
          </div>
        </div>
      </div>

      {/* Pilares de la Plataforma */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        <div className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-stone-900">Gestor de Entregables</h3>
          <p className="text-stone-600 text-sm leading-relaxed">
            Orden cronológico descendente, fechas límite de entrega, miniaturas de presentación y copiado de credenciales en un solo clic.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-900 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-stone-900">Acceso Seguro con bcrypt</h3>
          <p className="text-stone-600 text-sm leading-relaxed">
            Rutas dinámicas por ID (`/entregable/[id]`) protegidas con clave alfanumérica única. Ninguna persona no autorizada puede acceder.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-stone-900 text-amber-400 flex items-center justify-center font-bold">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-stone-900">Descarga HD y Reporte PDF</h3>
          <p className="text-stone-600 text-sm leading-relaxed">
            El cliente puede descargar directamente la imagen original o exportar un reporte PDF formateado con los detalles del entregable.
          </p>
        </div>

      </div>

      {/* Sección Informativa / Callout */}
      <div className="bg-gradient-to-r from-amber-100/80 via-rose-50/80 to-amber-50 p-8 sm:p-10 rounded-3xl border border-amber-200/80 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <h3 className="font-serif text-2xl font-bold text-stone-900">¿Necesitas ayuda sobre cómo empezar?</h3>
          <p className="text-stone-600 text-sm">
            Consulta las guías paso a paso para la empresa y el cliente, así como nuestras preguntas frecuentes.
          </p>
        </div>
        <Link
          href="/ayuda"
          className="px-6 py-3 bg-amber-900 hover:bg-amber-950 text-white font-bold text-xs rounded-xl transition-colors inline-flex items-center gap-2 shrink-0"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Ver Centro de Ayuda</span>
        </Link>
      </div>

    </div>
  );
}
