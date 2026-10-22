// Edge-safe (uses Web Crypto only) so it can run in middleware AND route handlers.
//
// Session = "<expiryUnixSeconds>.<hmac>" in an httpOnly cookie. The HMAC is keyed
// with ADMIN_SESSION_SECRET, so it can't be forged without the secret. Rotating
// that secret instantly logs everyone out.

export const ADMIN_COOKIE = 'taaora_admin'
export const SESSION_TTL_SECONDS = 60 * 60 * 12 // 12 hours

const enc = new TextEncoder()

function toHex(buf: ArrayBuffer) {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

async function hmac(secret: string, data: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  return toHex(await crypto.subtle.sign('HMAC', key, enc.encode(data)))
}

// Constant-time string compare (both inputs here are fixed-length hex digests).
function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

export function adminAuthConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET)
}

export async function checkAdminPassword(input: string): Promise<boolean> {
  const secret = process.env.ADMIN_SESSION_SECRET
  const password = process.env.ADMIN_PASSWORD
  if (!secret || !password) return false
  // Compare HMACs of both values so the comparison is constant-time and
  // independent of the password's length.
  const [a, b] = await Promise.all([hmac(secret, input), hmac(secret, password)])
  return safeEqual(a, b)
}

export async function createSessionToken(): Promise<string> {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) throw new Error('ADMIN_SESSION_SECRET is not set')
  const exp = String(Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS)
  return `${exp}.${await hmac(secret, exp)}`
}

export async function verifySessionToken(token?: string | null): Promise<boolean> {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret || !token) return false
  const [exp, sig] = token.split('.')
  if (!exp || !sig) return false
  if (Number(exp) < Math.floor(Date.now() / 1000)) return false
  return safeEqual(await hmac(secret, exp), sig)
}
