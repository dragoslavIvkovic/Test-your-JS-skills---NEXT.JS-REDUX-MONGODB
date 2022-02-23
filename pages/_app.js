import '../styles/globals.css'
import Link from 'next/link'
 

import Amplify from 'aws-amplify'
import config from '../src/aws-exports'
Amplify.configure({
  ...config,
  ssr: true
})

export default function MyApp({ Component, pageProps }) {
  return (
    <div>
      <nav  >
        <Link href="/">
          <span  >Home</span>
        </Link>
        <Link href="/profile">
          <span  >Profile</span>
        </Link>
        <Link href="/protected">
  <span  >Protected route</span>
</Link><Link href="/protected-client-route">
 <span  >Protected client route</span>
</Link>

      </nav>
      <Component {...pageProps} />
    </div>
  )
}