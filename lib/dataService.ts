import { supabase, isSupabaseConfigured } from './supabaseClient';
import { hashPassword, generateUniquePassword } from './security';

export interface Cliente {
  id: string;
  nombre: string;
  created_at?: string;
}

export interface Entregable {
  id: string;
  cliente_id: string;
  cliente_nombre?: string;
  nombre_producto: string;
  descripcion_leve: string;
  fecha_limite: string;
  imagen_url: string;
  password_hash: string;
  plain_password?: string; // Solo temporalmente para visualización en demostración
  created_at: string;
}

// Almacenamiento local como fallback en caso de que Supabase no esté configurado aún
const LOCAL_STORAGE_KEY_CLIENTES = 'viaje_vida_clientes';
const LOCAL_STORAGE_KEY_ENTREGABLES = 'viaje_vida_entregables';

const INITIAL_CLIENTES: Cliente[] = [
  { id: 'cli-001', nombre: 'Familia Valenzuela', created_at: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: 'cli-002', nombre: 'Sofía & Mateo (Boda)', created_at: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: 'cli-003', nombre: 'Camila Rossi', created_at: new Date(Date.now() - 86400000 * 1).toISOString() }
];

const INITIAL_ENTREGABLES_RAW = [
  {
    id: '123e4567-e89b-12d3-a456-426614174000',
    cliente_id: 'cli-002',
    cliente_nombre: 'Sofía & Mateo (Boda)',
    nombre_producto: 'Álbum "Un Destino Juntos"',
    descripcion_leve: 'Un recorrido fotográfico emocional por la ceremonia, el banquete y la fiesta de celebración de amor.',
    fecha_limite: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
    imagen_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200',
    plain_password: 'AMOR2026',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: '987f6543-e21b-43c2-b987-123456789abc',
    cliente_id: 'cli-001',
    cliente_nombre: 'Familia Valenzuela',
    nombre_producto: 'Colección "Atardecer Familiar"',
    descripcion_leve: 'Retratos cálidos y espontáneos en la playa celebrando la llegada del nuevo integrante.',
    fecha_limite: new Date(Date.now() + 86400000 * 12).toISOString().split('T')[0],
    imagen_url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=1200',
    plain_password: 'FAMILIA123',
    created_at: new Date(Date.now() - 86400000 * 4).toISOString()
  }
];

function getLocalData<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setLocalData<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Error saving to localStorage', e);
  }
}

export async function getClientes(): Promise<Cliente[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('clientes').select('*').order('nombre');
    if (!error && data) return data;
  }
  return getLocalData<Cliente[]>(LOCAL_STORAGE_KEY_CLIENTES, INITIAL_CLIENTES);
}

export async function createCliente(nombre: string): Promise<Cliente> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('clientes').insert({ nombre }).select().single();
    if (!error && data) return data;
  }
  const clientes = await getClientes();
  const newCliente: Cliente = {
    id: 'cli-' + Date.now().toString(36),
    nombre,
    created_at: new Date().toISOString()
  };
  setLocalData(LOCAL_STORAGE_KEY_CLIENTES, [...clientes, newCliente]);
  return newCliente;
}

export async function getEntregables(): Promise<Entregable[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('entregables')
      .select('*, clientes(nombre)')
      .order('created_at', { ascending: false });

    if (!error && data) {
      return data.map((item: { clientes?: { nombre?: string }; [key: string]: unknown }) => ({
        ...item,
        cliente_nombre: item.clientes?.nombre || 'Cliente Desconocido'
      })) as unknown as Entregable[];
    }
  }

  const list = getLocalData<Entregable[]>(LOCAL_STORAGE_KEY_ENTREGABLES, []);
  if (list.length === 0) {
    // Inicializar hashes para datos iniciales de demo
    const initialized = await Promise.all(
      INITIAL_ENTREGABLES_RAW.map(async (item) => ({
        ...item,
        password_hash: await hashPassword(item.plain_password)
      }))
    );
    setLocalData(LOCAL_STORAGE_KEY_ENTREGABLES, initialized);
    return initialized;
  }

  // Asegurar ordenamiento descendente por fecha de creación
  return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function getEntregableById(id: string): Promise<Entregable | null> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('entregables')
      .select('*, clientes(nombre)')
      .eq('id', id)
      .single();

    if (!error && data) {
      return {
        ...data,
        cliente_nombre: data.clientes?.nombre || 'Cliente Desconocido'
      };
    }
  }

  const entregables = await getEntregables();
  const found = entregables.find((e) => e.id === id);
  return found || null;
}

export interface CreateEntregablePayload {
  cliente_id: string;
  cliente_nombre?: string;
  nombre_producto: string;
  descripcion_leve: string;
  fecha_limite: string;
  imagen_url: string;
  plain_password?: string;
}

export async function createEntregable(payload: CreateEntregablePayload): Promise<{ entregable: Entregable; rawPassword: string }> {
  const rawPassword = payload.plain_password || generateUniquePassword(8);
  const password_hash = await hashPassword(rawPassword);

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('entregables')
      .insert({
        cliente_id: payload.cliente_id,
        nombre_producto: payload.nombre_producto,
        descripcion_leve: payload.descripcion_leve,
        fecha_limite: payload.fecha_limite,
        imagen_url: payload.imagen_url,
        password_hash
      })
      .select('*, clientes(nombre)')
      .single();

    if (!error && data) {
      const entregable: Entregable = {
        ...data,
        cliente_nombre: data.clientes?.nombre || payload.cliente_nombre || 'Cliente',
        plain_password: rawPassword
      };
      return { entregable, rawPassword };
    }
  }

  const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `ent-${Date.now()}`;
  const newEntregable: Entregable = {
    id,
    cliente_id: payload.cliente_id,
    cliente_nombre: payload.cliente_nombre || 'Cliente Generado',
    nombre_producto: payload.nombre_producto,
    descripcion_leve: payload.descripcion_leve,
    fecha_limite: payload.fecha_limite,
    imagen_url: payload.imagen_url,
    password_hash,
    plain_password: rawPassword,
    created_at: new Date().toISOString()
  };

  const currentList = await getEntregables();
  const updatedList = [newEntregable, ...currentList];
  setLocalData(LOCAL_STORAGE_KEY_ENTREGABLES, updatedList);

  return { entregable: newEntregable, rawPassword };
}
