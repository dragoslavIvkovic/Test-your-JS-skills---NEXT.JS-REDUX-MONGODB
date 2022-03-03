import Header from '../components/Header'
import '../styles/globals.css'




export default function MyApp({ Component, pageProps }) {
  return (
    <div>
     <Header/>
      <Component {...pageProps} />
    </div>
  )
}