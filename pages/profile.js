import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function Profile () {
  const router = useRouter()
  const { status } = useSession({
    required: true,
    onUnauthenticated () {
      router.push('/api/auth/signin')
    }
  })

  if (status === 'loading') {
    return 'Loading or not authenticated...'
  }

  return 'User is logged in'
}