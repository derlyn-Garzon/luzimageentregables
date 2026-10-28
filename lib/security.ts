import bcrypt from 'bcryptjs';

/**
 * Genera una contraseña alfanumérica aleatoria y legible de la longitud especificada.
 */
export function generateUniquePassword(length: number = 8): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Hashea una contraseña usando bcryptjs.
 */
export async function hashPassword(plainTextPassword: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainTextPassword, salt);
}

/**
 * Valida una contraseña en texto plano contra su hash guardado.
 */
export async function verifyPassword(plainTextPassword: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plainTextPassword, hash);
}
