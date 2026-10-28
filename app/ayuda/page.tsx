'use client';

import { useState } from 'react';
import { HelpCircle, Briefcase, User, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function AyudaPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: '¿Cómo funciona la seguridad de las contraseñas?',
      a: 'Cada entregable se crea con una clave única alfanumérica. En la base de datos se almacena únicamente el hash cifrado mediante algoritmos seguros (bcrypt). De este modo, nadie sin la clave original puede acceder a las fotografías.'
    },
    {
      q: '¿Qué es una URL dinámica y por qué se utiliza?',
      a: 'La URL dinámica tiene el formato /entregable/[id], donde cada identificador es único para cada cliente y proyecto. Esto permite aislar por completo los productos entregables y garantiza que sólo se consulte la información de esa carpeta.'
    },
    {
      q: '¿Cómo puedo descargar mi imagen o el PDF desde el portal de cliente?',
      a: 'Una vez que ingresas la contraseña única correctamente, el portal despliega el visor de recuerdos. Allí encontrarás botones dedicados para descargar la imagen en alta definición directamente o generar un reporte en PDF listo para imprimir o guardar.'
    },
    {
      q: '¿Qué sucede si la fecha límite de entrega se cumple?',
      a: 'El panel de administración marca los entregables según su nivel de urgencia o vencimiento. Las imágenes continúan resguardadas de forma segura en Supabase Storage.'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">

      {/* Banner de Título */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300/60 text-xs font-bold">
          <HelpCircle className="w-4 h-4 text-amber-700" />
          <span>Guía & Centro de Soporte</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900">
          ¿Cómo funciona Viaje de Vida?
        </h1>
        <p className="text-stone-600 text-sm sm:text-base max-w-xl mx-auto">
          Conoce el flujo de trabajo tanto para la empresa/fotógrafo como para el cliente final.
        </p>
      </div>

      {/* Guías de Uso en Paralelo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Guía para la Empresa */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200/80 shadow-md space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-900 text-amber-50 flex items-center justify-center">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-stone-900">Guía para la Empresa</h2>
              <p className="text-xs text-stone-500">Gestión de proyectos y contraseñas</p>
            </div>
          </div>

          <ol className="space-y-4 text-xs sm:text-sm text-stone-700">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center shrink-0">1</span>
              <div>
                <strong>Crear el entregable:</strong> En el Panel Empresa, haz clic en &ldquo;Nuevo Entregable&rdquo;. Completa el cliente, título, fecha límite y la URL de imagen.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center shrink-0">2</span>
              <div>
                <strong>Obtener URL y Clave:</strong> El sistema genera automáticamente una clave alfanumérica y un enlace único (<code className="bg-amber-50 px-1 rounded border">/entregable/:id</code>).
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center shrink-0">3</span>
              <div>
                <strong>Copiar con 1 clic:</strong> Usa los botones &ldquo;Copiar URL&rdquo; y &ldquo;Copiar Clave&rdquo; en la tarjeta del producto para enviarlos a tu cliente por correo o WhatsApp.
              </div>
            </li>
          </ol>

          <Link
            href="/empresa"
            className="w-full py-3 bg-amber-900 hover:bg-amber-950 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <span>Ir al Panel Empresa</span>
          </Link>
        </div>

        {/* Guía para el Cliente */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-rose-200/80 shadow-md space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-900 text-rose-50 flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-stone-900">Guía para el Cliente</h2>
              <p className="text-xs text-stone-500">Acceso y descarga de recuerdos</p>
            </div>
          </div>

          <ol className="space-y-4 text-xs sm:text-sm text-stone-700">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-900 font-bold text-xs flex items-center justify-center shrink-0">1</span>
              <div>
                <strong>Abrir el enlace recibido:</strong> Haz clic en el enlace entregado por tu fotógrafo. Llegarás a una pantalla de bloqueo inspiradora.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-900 font-bold text-xs flex items-center justify-center shrink-0">2</span>
              <div>
                <strong>Ingresar la contraseña:</strong> Digita la clave única provista. Si la clave coincide, desbloquearás inmediatamente tus momentos.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-900 font-bold text-xs flex items-center justify-center shrink-0">3</span>
              <div>
                <strong>Descargar en Alta Calidad:</strong> Utiliza el botón &ldquo;Descargar Imagen&rdquo; o &ldquo;Descargar PDF&rdquo; para conservar tu reporte de entrega.
              </div>
            </li>
          </ol>

          <div className="p-3 bg-rose-50 rounded-xl text-xs text-rose-950 flex items-center gap-2 border border-rose-200">
            <Sparkles className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Tus recuerdos permanecen protegidos e inaccesibles para personas ajenas.</span>
          </div>
        </div>

      </div>

      {/* Preguntas Frecuentes FAQ */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-stone-200 shadow-sm space-y-6">
        <div className="space-y-1">
          <h2 className="font-serif text-2xl font-bold text-stone-900">Preguntas Frecuentes (FAQ)</h2>
          <p className="text-stone-500 text-xs sm:text-sm">
            Respuestas claras a las inquietudes más comunes.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="border border-stone-200 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-4 sm:p-5 text-left font-semibold text-stone-900 flex items-center justify-between text-sm sm:text-base hover:bg-amber-50/50"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-amber-700 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-stone-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm text-stone-600 border-t border-stone-100 bg-stone-50/50 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
