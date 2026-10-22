import { Suspense } from 'react'
import type { Metadata } from 'next'
import LoginForm from '@/components/admin/LoginForm'

export const metadata: Metadata = {
  title: 'Admin login · TAAORA',
  robots: { index: false, follow: false },
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}
