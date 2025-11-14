/**
 * Generate a short, URL-friendly ID
 * Format: 6 characters (uppercase letters + numbers)
 * Example: ELJD29, A1B2C3, XYZ789
 */

export function generateShortId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  
  // Generate 6 characters
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  return result
}

/**
 * Validate if a string is a valid short ID format
 */
export function isValidShortId(id: string): boolean {
  return /^[A-Z0-9]{6}$/.test(id)
}

