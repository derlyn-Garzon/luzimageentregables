'use client';

import { useRef, useState } from 'react';
import { Entregable } from '@/lib/dataService';
import { Download, FileText, Sparkles, Heart, Calendar, Share2, Check, RefreshCw } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ClientViewerProps {
  entregable: Entregable;
}

export default function ClientViewer({ entregable }: ClientViewerProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingImage, setDownloadingImage] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Descarga de Imagen
  const handleDownloadImage = async () => {
    setDownloadingImage(true);
    try {
      const response = await fetch(entregable.imagen_url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${entregable.nombre_producto.replace(/\s+/g, '_')}_ViajeDeVida.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Error al descargar imagen directamente:', err);
      // Fallback abre imagen en pestaña nueva
      window.open(entregable.imagen_url, '_blank');
    } finally {
      setDownloadingImage(false);
    }
  };

  // Generación y descarga de PDF con html2canvas y jsPDF
  const handleDownloadPdf = async () => {
    if (!cardRef.current) return;
    setDownloadingPdf(true);

    try {
      const element = cardRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#fafaf9'
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pdfWidth - 20; // 10mm margins
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.setFillColor(250, 250, 249);
      pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');

      // Add image to PDF
      pdf.addImage(imgData, 'JPEG', 10, 10, imgWidth, Math.min(imgHeight, pdfHeight - 20));

      // Pie de página oficial del PDF
      pdf.setFontSize(9);
      pdf.setTextColor(120, 113, 108);
      pdf.text(
        `Reporte Entregable - Viaje de Vida | Cliente: ${entregable.cliente_nombre || 'Cliente'}`,
        10,
        pdfHeight - 10
      );

      pdf.save(`Entregable_${entregable.nombre_producto.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error('Error al generar PDF:', err);
      alert('Ocurrió un inconveniente al generar el PDF. Puedes descargar la imagen directamente.');
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleCopyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (err) {
      console.error('Error al copiar enlace', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">

      {/* Banner de Saludo Personalizado */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300/60 text-xs font-bold">
          <Sparkles className="w-4 h-4 text-amber-600 fill-amber-300" />
          <span>Acceso Autenticado Exitosamente</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-bold bg-gradient-to-r from-amber-950 via-rose-950 to-stone-900 bg-clip-text text-transparent">
          ¡Hola, {entregable.cliente_nombre || 'Estimado/a Cliente'}!
        </h1>

        <p className="text-stone-600 text-sm sm:text-base max-w-xl mx-auto font-medium leading-relaxed">
          Bienvenido/a a tu álbum de recuerdos. Aquí puedes revivir, contemplar y descargar cada uno de los momentos capturados para ti.
        </p>
      </div>

      {/* Tarjeta Printable & Visualizable */}
      <div
        ref={cardRef}
        className="bg-stone-50 rounded-3xl border border-stone-200 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6"
      >
        {/* Cabecera Tarjeta */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-6">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-800">
              Producto Entregable
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-0.5">
              {entregable.nombre_producto}
            </h2>
          </div>

          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-stone-200 text-xs text-stone-600 shadow-sm">
            <Calendar className="w-4 h-4 text-amber-600" />
            <span>
              Fecha Límite: <strong className="text-stone-800">{entregable.fecha_limite}</strong>
            </span>
          </div>
        </div>

        {/* Marco elegante de la imagen (Álbum de recuerdos) */}
        <div className="relative rounded-2xl bg-white p-3 sm:p-4 shadow-inner border border-stone-200 group">
          <div className="relative overflow-hidden rounded-xl aspect-video sm:aspect-[16/10] bg-stone-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={entregable.imagen_url}
              alt={entregable.nombre_producto}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
          <div className="pt-3 text-center">
            <span className="text-xs text-stone-400 font-serif italic">
              📸 &ldquo;Capturando instantes que se vuelven eternos&rdquo;
            </span>
          </div>
        </div>

        {/* Descripción emotiva */}
        {entregable.descripcion_leve && (
          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              Detalles de la Colección
            </h3>
            <p className="text-stone-700 text-sm leading-relaxed italic">
              &ldquo;{entregable.descripcion_leve}&rdquo;
            </p>
          </div>
        )}

        {/* Marca de agua / sello de la plataforma para reporte PDF */}
        <div className="pt-4 border-t border-stone-200/60 flex items-center justify-between text-xs text-stone-400">
          <span className="font-serif font-bold text-amber-900/60">Viaje de Vida - Colección Privada</span>
          <span>ID: {entregable.id}</span>
        </div>
      </div>

      {/* Botones de Acción Principales */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">

        {/* Descargar Imagen HD */}
        <button
          onClick={handleDownloadImage}
          disabled={downloadingImage}
          className="py-3.5 px-5 bg-gradient-to-r from-amber-800 to-rose-900 hover:from-amber-900 hover:to-rose-950 text-white font-bold text-sm rounded-2xl shadow-lg shadow-amber-950/20 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          {downloadingImage ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Preparando...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Descargar Imagen</span>
            </>
          )}
        </button>

        {/* Descargar Reporte PDF */}
        <button
          onClick={handleDownloadPdf}
          disabled={downloadingPdf}
          className="py-3.5 px-5 bg-stone-900 hover:bg-black text-white font-bold text-sm rounded-2xl shadow-lg shadow-stone-900/20 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          {downloadingPdf ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Generando PDF...</span>
            </>
          ) : (
            <>
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Descargar PDF</span>
            </>
          )}
        </button>

        {/* Compartir Enlace */}
        <button
          onClick={handleCopyShareLink}
          className={`py-3.5 px-5 border font-bold text-sm rounded-2xl transition-all flex items-center justify-center gap-2 ${
            copiedLink
              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
              : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-300'
          }`}
        >
          {copiedLink ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span>¡Enlace Copiado!</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 text-amber-700" />
              <span>Compartir Enlace</span>
            </>
          )}
        </button>

      </div>

    </div>
  );
}
