import { NextResponse } from 'next/server'
import {
  ADMIN_COOKIE,
  SESSION_TTL_SECONDS,
  adminAuthConfigured,
  checkAdminPassword,
  createSessionToken,
} from '@/lib/admin-auth'
import { clientIp, rateLimit } from '@/lib/rate-limit'

export async function POST(req: Request) {
  if (!adminAuthConfigured()) {
    console.error('ADMIN_PASSWORD / ADMIN_SESSION_SECRET are not set')
    return NextResponse.json({ error: 'Admin login is not configured.' }, { status: 500 })
  }

  // 5 attempts per 15 minutes per IP.
  const limit = rateLimit(`admin-login:${clientIp(req)}`, 5, 15 * 60 * 1000)
  if (!limit.ok) {
    return NextResponse.json(
      { error: `Too many attempts. Try again in ${Math.ceil(limit.retryAfter / 60)} min.` },
      { status: 429 },
    )
  }

  const body = await req.json().catch(() => ({}))
  const password = typeof body.password === 'string' ? body.password : ''

  if (!password || !(await checkAdminPassword(password))) {
    await new Promise((r) => setTimeout(r, 500)) // slow down guessing
    return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set(ADMIN_COOKIE, await createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  })
  return res
}
