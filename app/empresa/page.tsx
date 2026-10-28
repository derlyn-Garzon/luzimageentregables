'use client';

import { useState, useEffect } from 'react';
import { Entregable, Cliente, getEntregables, getClientes } from '@/lib/dataService';
import { isSupabaseConfigured } from '@/lib/supabaseClient';
import DeliverableCard from '@/components/DeliverableCard';
import DeliverableForm from '@/components/DeliverableForm';
import { Briefcase, Plus, Search, Sparkles, FolderHeart, ShieldCheck, Database } from 'lucide-react';

export default function EmpresaPage() {
  const [entregables, setEntregables] = useState<Entregable[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [entregablesData, clientesData] = await Promise.all([
        getEntregables(),
        getClientes()
      ]);
      setEntregables(entregablesData);
      setClientes(clientesData);
    } catch (err) {
      console.error('Error al cargar datos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtrado por consulta de búsqueda (cliente, producto, descripción)
  const filteredEntregables = entregables.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.nombre_producto.toLowerCase().includes(q) ||
      (item.cliente_nombre && item.cliente_nombre.toLowerCase().includes(q)) ||
      (item.descripcion_leve && item.descripcion_leve.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      {/* Banner Superior Promocional & Estado */}
      <div className="relative rounded-3xl bg-gradient-to-r from-amber-900 via-stone-900 to-amber-950 p-8 sm:p-10 text-white shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-semibold uppercase tracking-wide">
              <Briefcase className="w-3.5 h-3.5" />
              Panel de Administración Empresa
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-amber-50">
              Gestor de Entregables & Recuerdos
            </h1>
            <p className="text-amber-200/80 text-sm sm:text-base leading-relaxed">
              Administra tus carpetas de imágenes como productos únicos. Genera enlaces dinámicos con contraseñas cifradas para que tus clientes vivan una experiencia inolvidable.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-stone-950 font-extrabold rounded-2xl shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 text-sm"
            >
              <Plus className="w-5 h-5" />
              <span>Nuevo Entregable</span>
            </button>
          </div>
        </div>

        {/* Indicador de Estado del Backend */}
        <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-amber-200/70 gap-3">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-amber-400" />
            <span>
              Estado de conexión: {' '}
              <strong className={isSupabaseConfigured ? 'text-emerald-400' : 'text-amber-300'}>
                {isSupabaseConfigured ? 'Supabase En Vivo (PostgreSQL + Storage)' : 'Modo Demostración / Storage Local'}
              </strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Seguridad bcrypt activada para todas las contraseñas</span>
          </div>
        </div>
      </div>

      {/* Barra de Búsqueda y Estadísticas */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone-200/80 shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por producto, cliente o descripción..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-stone-50/50"
          />
        </div>

        <div className="flex items-center gap-4 text-xs text-stone-500 w-full sm:w-auto justify-end">
          <span className="flex items-center gap-1.5 font-medium">
            <FolderHeart className="w-4 h-4 text-amber-600" />
            Total Entregables: <strong className="text-stone-800">{entregables.length}</strong>
          </span>
          <span className="text-stone-300">|</span>
          <span className="text-amber-800 font-semibold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60">
            Orden Cronológico Descendente (RECINETES PRIMERO)
          </span>
        </div>
      </div>

      {/* Rejilla de Entregables */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-stone-600">Cargando directorio de entregables...</p>
        </div>
      ) : filteredEntregables.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-stone-200/80 p-8 space-y-4">
          <div className="w-16 h-16 bg-amber-50 text-amber-800 rounded-2xl flex items-center justify-center mx-auto border border-amber-200">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-xl font-bold text-stone-800">No se encontraron entregables</h3>
          <p className="text-stone-500 text-sm max-w-md mx-auto">
            {searchQuery ? 'Intenta con otro término de búsqueda.' : 'Crea tu primer producto entregable para un cliente e inicia la experiencia.'}
          </p>
          {!searchQuery && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2.5 bg-amber-900 text-amber-50 font-bold text-xs rounded-xl hover:bg-amber-950 transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Crear Nuevo Entregable</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEntregables.map((item) => (
            <DeliverableCard key={item.id} entregable={item} />
          ))}
        </div>
      )}

      {/* Modal Formulario de Creación */}
      <DeliverableForm
        clientes={clientes}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
}
