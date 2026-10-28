'use client';

import { useState } from 'react';
import { verifyPassword } from '@/lib/security';
import { Lock, KeyRound, Sparkles, Heart, ShieldCheck, AlertCircle } from 'lucide-react';

interface AccessLockProps {
  clienteNombre: string;
  nombreProducto: string;
  passwordHash: string;
  onUnlocked: () => void;
}

export default function AccessLock({
  clienteNombre,
  nombreProducto,
  passwordHash,
  onUnlocked
}: AccessLockProps) {
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) {
      setErrorMsg('Por favor ingresa la contraseña de acceso.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const isValid = await verifyPassword(passwordInput.trim(), passwordHash);
      if (isValid) {
        onUnlocked();
      } else {
        setErrorMsg('La contraseña ingresada no es válida. Por favor verifica e intenta nuevamente.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Error al validar la contraseña.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl max-w-md w-full shadow-2xl border border-amber-200/80 overflow-hidden text-stone-800 animate-in fade-in duration-300">

        {/* Encabezado Emotivo Inspirador */}
        <div className="bg-gradient-to-b from-amber-100/80 via-rose-50/60 to-white px-8 pt-8 pb-6 text-center border-b border-amber-100">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-800 to-rose-700 text-amber-50 flex items-center justify-center mx-auto shadow-xl shadow-amber-900/10 mb-4 group">
            <Lock className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Tu viaje, tus momentos</span>
          </div>

          <h1 className="font-serif text-2xl font-bold text-stone-900">
            ¡Bienvenido/a, {clienteNombre}!
          </h1>
          <p className="text-xs text-stone-600 mt-1 font-medium">
            Entregable: <strong className="text-stone-800">{nombreProducto}</strong>
          </p>
        </div>

        {/* Formulario de Clave */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="text-center space-y-1">
            <p className="text-xs text-stone-600 leading-relaxed">
              Para resguardar tus recuerdos y mantenerlos en un espacio seguro, ingresa la contraseña única provista por tu fotógrafo o empresa.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
              Contraseña de Acceso
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-700" />
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Ingresa tu clave aquí"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm font-mono tracking-widest"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-gradient-to-r from-amber-800 via-amber-900 to-rose-950 text-white font-bold text-sm rounded-2xl shadow-lg shadow-amber-950/20 hover:opacity-95 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>Validando clave...</span>
            ) : (
              <>
                <Heart className="w-4 h-4 text-rose-300 fill-rose-300" />
                <span>Ingresar a mis recuerdos</span>
              </>
            )}
          </button>

          <div className="pt-2 flex items-center justify-center gap-1.5 text-xs text-stone-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Acceso seguro y protegido con encriptación bcrypt</span>
          </div>
        </form>

      </div>
    </div>
  );
}
