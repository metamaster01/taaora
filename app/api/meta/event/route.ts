import { NextRequest, NextResponse } from 'next/server'
import { CAPI_ALLOWED_EVENTS, sendCapiEvent } from '@/lib/meta-capi'

export const runtime = 'nodejs'

const noContent = () => new NextResponse(null, { status: 204 })

export async function POST(req: NextRequest) {
  // Same-origin only: blocks other sites from posting fake events through us.
  const origin = req.headers.get('origin')
  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host')
  if (origin) {
    try {
      if (new URL(origin).host !== host) return new NextResponse(null, { status: 403 })
    } catch {
      return new NextResponse(null, { status: 403 })
    }
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return new NextResponse(null, { status: 400 })
  }

  const eventName = typeof body.eventName === 'string' ? body.eventName : ''
  const eventId = typeof body.eventId === 'string' ? body.eventId.slice(0, 100) : ''
  if (!CAPI_ALLOWED_EVENTS.has(eventName) || !eventId) {
    return new NextResponse(null, { status: 400 })
  }

  const u = (body.user && typeof body.user === 'object' ? body.user : {}) as Record<string, unknown>
  const s = (v: unknown) => (typeof v === 'string' ? v.slice(0, 200) : undefined)

  await sendCapiEvent({
    eventName,
    eventId,
    sourceUrl: typeof body.sourceUrl === 'string' ? body.sourceUrl.slice(0, 500) : undefined,
    customData: body.customData,
    user: {
      email: s(u.email),
      phone: s(u.phone),
      firstName: s(u.firstName),
      // Collected server-side from the request, never trusted from the client:
      ip: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || undefined,
      userAgent: req.headers.get('user-agent') || undefined,
      fbp: req.cookies.get('_fbp')?.value,
      fbc: req.cookies.get('_fbc')?.value,
    },
  })

  return noContent()
}