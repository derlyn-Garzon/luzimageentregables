'use client';

import { useState, useEffect } from 'react';
import { Cliente, createCliente, createEntregable } from '@/lib/dataService';
import { generateUniquePassword } from '@/lib/security';
import { X, Sparkles, Plus, Image as ImageIcon, Key, Calendar, User, FileText } from 'lucide-react';

interface DeliverableFormProps {
  clientes: Cliente[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const SAMPLE_IMAGES = [
  { label: 'Boda / Romance', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200' },
  { label: 'Familia / Retrato', url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=1200' },
  { label: 'Viaje / Naturaleza', url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=1200' },
  { label: 'Celebración / XV', url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=1200' },
];

export default function DeliverableForm({ clientes, isOpen, onClose, onSuccess }: DeliverableFormProps) {
  const [selectedClienteId, setSelectedClienteId] = useState<string>('');
  const [isCreatingNewCliente, setIsCreatingNewCliente] = useState<boolean>(false);
  const [newClienteNombre, setNewClienteNombre] = useState<string>('');

  const [nombreProducto, setNombreProducto] = useState<string>('');
  const [descripcionLeve, setDescripcionLeve] = useState<string>('');
  const [fechaLimite, setFechaLimite] = useState<string>('');
  const [imagenUrl, setImagenUrl] = useState<string>('');
  const [generatedPassword, setGeneratedPassword] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setGeneratedPassword(generateUniquePassword(8));
      // Por defecto la fecha limite es en 14 dias
      const defaultDate = new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0];
      setFechaLimite(defaultDate);
      if (clientes.length > 0) {
        setSelectedClienteId(clientes[0].id);
      }
      setImagenUrl(SAMPLE_IMAGES[0].url);
    }
  }, [isOpen, clientes]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let finalClienteId = selectedClienteId;
      let finalClienteNombre = '';

      if (isCreatingNewCliente) {
        if (!newClienteNombre.trim()) {
          setError('Ingresa el nombre del nuevo cliente');
          setLoading(false);
          return;
        }
        const created = await createCliente(newClienteNombre.trim());
        finalClienteId = created.id;
        finalClienteNombre = created.nombre;
      } else {
        const found = clientes.find((c) => c.id === selectedClienteId);
        finalClienteNombre = found ? found.nombre : 'Cliente';
      }

      if (!nombreProducto.trim()) {
        setError('El nombre del producto es obligatorio');
        setLoading(false);
        return;
      }

      if (!imagenUrl.trim()) {
        setError('Proporciona una URL de la imagen del entregable');
        setLoading(false);
        return;
      }

      await createEntregable({
        cliente_id: finalClienteId,
        cliente_nombre: finalClienteNombre,
        nombre_producto: nombreProducto,
        descripcion_leve: descripcionLeve,
        fecha_limite: fechaLimite,
        imagen_url: imagenUrl,
        plain_password: generatedPassword
      });

      onSuccess();
      onClose();
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : 'Error al guardar el entregable';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-rose-900 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center border border-amber-400/30">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold">Nuevo Entregable de Recuerdo</h2>
              <p className="text-xs text-amber-200/80">
                Prepara el viaje de vida para tu cliente con clave segura.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
              ⚠️ {error}
            </div>
          )}

          {/* Selección o Creación de Cliente */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-600" />
                Cliente Destinatario
              </span>
              <button
                type="button"
                onClick={() => setIsCreatingNewCliente(!isCreatingNewCliente)}
                className="text-amber-800 hover:text-amber-950 font-semibold underline lowercase text-xs"
              >
                {isCreatingNewCliente ? '← Seleccionar existente' : '+ Crear nuevo cliente'}
              </button>
            </label>

            {isCreatingNewCliente ? (
              <input
                type="text"
                value={newClienteNombre}
                onChange={(e) => setNewClienteNombre(e.target.value)}
                placeholder="Nombre del nuevo cliente (ej. Familia Martínez)"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
              />
            ) : (
              <select
                value={selectedClienteId}
                onChange={(e) => setSelectedClienteId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm bg-white"
              >
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Nombre del Producto */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-600" />
              Nombre del Producto / Entregable
            </label>
            <input
              type="text"
              required
              value={nombreProducto}
              onChange={(e) => setNombreProducto(e.target.value)}
              placeholder="ej. Álbum Fotográfico San Juan 2026"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
            />
          </div>

          {/* Descripción Emotiva Leve */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              Descripción Emotiva Leve
            </label>
            <textarea
              rows={2}
              value={descripcionLeve}
              onChange={(e) => setDescripcionLeve(e.target.value)}
              placeholder="Escribe un breve mensaje cálido sobre esta sesión o colección..."
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
            />
          </div>

          {/* Fecha Límite y Clave Única en fila */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                Fecha Límite de Entrega
              </label>
              <input
                type="date"
                required
                value={fechaLimite}
                onChange={(e) => setFechaLimite(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-600" />
                Contraseña Única Generada
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={generatedPassword}
                  className="w-full px-4 py-2.5 rounded-xl border border-amber-200 bg-amber-50 font-mono font-bold text-amber-900 text-sm text-center"
                />
                <button
                  type="button"
                  onClick={() => setGeneratedPassword(generateUniquePassword(8))}
                  className="px-3 py-2 bg-stone-100 hover:bg-stone-200 rounded-xl text-xs font-bold text-stone-700"
                  title="Regenerar contraseña"
                >
                  🔄
                </button>
              </div>
            </div>

          </div>

          {/* Imagen de Presentación / URL */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
              Imagen del Entregable (URL)
            </label>

            <input
              type="url"
              required
              value={imagenUrl}
              onChange={(e) => setImagenUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm font-mono"
            />

            {/* Galería rápida de muestra */}
            <div className="pt-1">
              <span className="text-xs text-stone-500 block mb-1.5">O elige una imagen de muestra temática:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SAMPLE_IMAGES.map((sample, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setImagenUrl(sample.url)}
                    className={`p-1.5 rounded-xl border text-left text-xs transition-all flex items-center gap-2 ${
                      imagenUrl === sample.url
                        ? 'border-amber-600 bg-amber-50 font-semibold text-amber-900'
                        : 'border-stone-200 hover:bg-stone-50 text-stone-600'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={sample.url} alt={sample.label} className="w-7 h-7 rounded-lg object-cover" />
                    <span className="truncate">{sample.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-800 to-rose-900 text-white font-bold text-xs rounded-xl hover:opacity-95 transition-opacity shadow-md shadow-amber-900/20 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <span>Creando entregable...</span>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Guardar y Generar Enlace</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
