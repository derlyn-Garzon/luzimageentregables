-- Schema para Plataforma "Viaje de Vida" (Supabase / PostgreSQL)

-- 1. Tabla de Clientes
CREATE TABLE IF NOT EXISTS clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabla de Entregables / Productos
CREATE TABLE IF NOT EXISTS entregables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
  nombre_producto VARCHAR(255) NOT NULL,
  descripcion_leve TEXT,
  fecha_limite DATE NOT NULL,
  imagen_url TEXT NOT NULL, -- Ruta o URL en Supabase Storage
  password_hash TEXT NOT NULL, -- Hash bcrypt de la contraseña única
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Índices para consultas eficientes
CREATE INDEX IF NOT EXISTS idx_entregables_created_at ON entregables (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_entregables_cliente_id ON entregables (cliente_id);

-- 4. Habilitar RLS (Row Level Security)
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE entregables ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura/escritura públicas para demostración/cliente API pública
CREATE POLICY "Permitir lectura publica de clientes" ON clientes FOR SELECT USING (true);
CREATE POLICY "Permitir insercion publica de clientes" ON clientes FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir lectura publica de entregables" ON entregables FOR SELECT USING (true);
CREATE POLICY "Permitir insercion publica de entregables" ON entregables FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir eliminacion publica de entregables" ON entregables FOR DELETE USING (true);

-- 5. Configuración de Storage Bucket privado
INSERT INTO storage.buckets (id, name, public)
VALUES ('entregables_bucket', 'entregables_bucket', false)
ON CONFLICT (id) DO NOTHING;
