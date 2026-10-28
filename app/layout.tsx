import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';

const fontSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
});

const fontSerif = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: 'Viaje de Vida | Entregables Empresa & Cliente',
  description: 'Plataforma interactiva para la entrega emocional y segura de álbumes y productos fotográficos.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${fontSans.variable} ${fontSerif.variable}`}>
      <body className="min-h-screen flex flex-col bg-stone-50 font-sans text-stone-800 antialiased selection:bg-amber-200 selection:text-amber-950">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
