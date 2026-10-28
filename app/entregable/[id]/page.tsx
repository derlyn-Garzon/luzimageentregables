'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getEntregableById, Entregable } from '@/lib/dataService';
import AccessLock from '@/components/AccessLock';
import ClientViewer from '@/components/ClientViewer';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EntregableClientPage() {
  const params = useParams();
  const id = params?.id as string;

  const [entregable, setEntregable] = useState<Entregable | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    async function load() {
      if (!id) return;
      setLoading(true);
      try {
        const data = await getEntregableById(id);
        setEntregable(data);
      } catch (err) {
        console.error('Error al obtener entregable:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 space-y-4">
        <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-stone-600">
          Cargando tu experiencia de recuerdos...
        </p>
      </div>
    );
  }

  if (!entregable) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 max-w-md mx-auto text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-rose-100 text-rose-700 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-stone-900">
          Entregable No Encontrado
        </h2>
        <p className="text-stone-600 text-sm leading-relaxed">
          No logramos encontrar un producto entregable asociado al código/ID proporcionado. Por favor verifica el enlace o solicita asistencia a tu fotógrafo.
        </p>
        <Link
          href="/"
          className="px-5 py-2.5 bg-amber-900 text-white rounded-xl font-bold text-xs hover:bg-amber-950 transition-colors inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al inicio</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8">
      {!isUnlocked ? (
        <AccessLock
          clienteNombre={entregable.cliente_nombre || 'Cliente'}
          nombreProducto={entregable.nombre_producto}
          passwordHash={entregable.password_hash}
          onUnlocked={() => setIsUnlocked(true)}
        />
      ) : (
        <ClientViewer entregable={entregable} />
      )}
    </div>
  );
}
