'use client';

import { useState } from 'react';
import { Entregable } from '@/lib/dataService';
import { Copy, Check, Calendar, User, ExternalLink, Key, Lock, AlertCircle } from 'lucide-react';

interface DeliverableCardProps {
  entregable: Entregable;
}

export default function DeliverableCard({ entregable }: DeliverableCardProps) {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);

  // Generar URL dinámicas basadas en window.location u origin
  const dynamicUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/entregable/${entregable.id}`
    : `/entregable/${entregable.id}`;

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(dynamicUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2500);
    } catch (err) {
      console.error('Error al copiar URL', err);
    }
  };

  const handleCopyPassword = async () => {
    const passwordToCopy = entregable.plain_password || 'Ver en DB/Hash';
    try {
      await navigator.clipboard.writeText(passwordToCopy);
      setCopiedPassword(true);
      setTimeout(() => setCopiedPassword(false), 2500);
    } catch (err) {
      console.error('Error al copiar contraseña', err);
    }
  };

  // Calcular días restantes o expiración de fecha límite
  const now = new Date();
  const deadlineDate = new Date(entregable.fecha_limite);
  const diffDays = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 3600 * 24));

  let deadlineBadge = null;
  if (diffDays < 0) {
    deadlineBadge = (
      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-100 text-rose-700 border border-rose-200 flex items-center gap-1">
        <AlertCircle className="w-3 h-3" /> Vencido ({Math.abs(diffDays)}d)
      </span>
    );
  } else if (diffDays <= 3) {
    deadlineBadge = (
      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
        ⏰ Urgente ({diffDays}d)
      </span>
    );
  } else {
    deadlineBadge = (
      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
        En fecha ({diffDays}d)
      </span>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col group">

      {/* Imagen miniatura y badges */}
      <div className="relative h-48 w-full bg-stone-100 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={entregable.imagen_url}
          alt={entregable.nombre_producto}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            // Fallback en caso de URL rota de imagen
            e.currentTarget.src = 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=800';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-stone-800 shadow-sm flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-amber-600" />
            {entregable.cliente_nombre || 'Cliente'}
          </span>
          {deadlineBadge}
        </div>

        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3 className="font-serif text-lg font-bold drop-shadow-md truncate">
            {entregable.nombre_producto}
          </h3>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">

        <div className="space-y-2">
          <p className="text-sm text-stone-600 line-clamp-2 leading-relaxed">
            {entregable.descripcion_leve || 'Sin descripción detallada.'}
          </p>

          <div className="pt-2 flex items-center justify-between text-xs text-stone-500 border-t border-stone-100">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-stone-400" />
              Límite: <strong className="text-stone-700">{entregable.fecha_limite}</strong>
            </span>
            <span className="text-stone-400">
              ID: {entregable.id.substring(0, 8)}...
            </span>
          </div>
        </div>

        {/* Sección de Credenciales e información rápida */}
        <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-stone-500 font-medium flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              Clave de Acceso:
            </span>
            <span className="font-mono font-bold bg-amber-100/70 text-amber-900 px-2 py-0.5 rounded border border-amber-200">
              {entregable.plain_password || '••••••••'}
            </span>
          </div>
        </div>

        {/* Herramientas de Acceso Rápido (Botones) */}
        <div className="grid grid-cols-2 gap-2 pt-1">

          {/* Copiar URL */}
          <button
            onClick={handleCopyUrl}
            className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
              copiedUrl
                ? 'bg-emerald-600 text-white'
                : 'bg-amber-900 hover:bg-amber-950 text-white active:scale-95'
            }`}
          >
            {copiedUrl ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>¡URL Copiada!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar URL</span>
              </>
            )}
          </button>

          {/* Copiar Contraseña */}
          <button
            onClick={handleCopyPassword}
            className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border ${
              copiedPassword
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-300 active:scale-95'
            }`}
          >
            {copiedPassword ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>¡Clave Copiada!</span>
              </>
            ) : (
              <>
                <Key className="w-3.5 h-3.5 text-amber-600" />
                <span>Copiar Clave</span>
              </>
            )}
          </button>

        </div>

        {/* Enlace para vista directa */}
        <a
          href={`/entregable/${entregable.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-center text-xs text-amber-800 hover:text-amber-950 hover:underline flex items-center justify-center gap-1 pt-1 font-medium"
        >
          <span>Abrir Portal Cliente directamente</span>
          <ExternalLink className="w-3 h-3" />
        </a>

      </div>
    </div>
  );
}
