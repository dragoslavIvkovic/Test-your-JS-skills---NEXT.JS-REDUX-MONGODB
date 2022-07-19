/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import "../styles/globals.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import Head from "next/head";
import store from "../store/store";
import Header from "../components/Header";
import "normalize.css";
import Loading from "../components/Loading";
import NextProgress from "next-progress";
const persistor = persistStore(store);
import "../styles/nprogress.css"

export default function MyApp({ Component, pageProps }) {
  
  const router = useRouter();
  // const [isReady, setReady] = useState(false);
  // const URL = process.env.NEXT_URL
  // const URLtest = `${URL}/Test?collection=undefined`

//   useEffect(() => {
//     const handleStart = (url) => {
//       url !== router.pathname ? setReady(true) : setReady(false);
// //  url !== router.asPath ? setReady(true) : setReady(false);
//     };
//     const handleComplete = (url) => setReady(false);

//     const handleRouteChangeError = (err, url) => {
//       console.log(`Loading: ${url}`);
//       setReady(true);
//     };

  //   router.events.on("routeChangeStart", handleStart);
  //   router.events.on("routeChangeComplete", handleComplete);
  //   router.events.on("routeChangeError", handleRouteChangeError);
  // }, [router]);

  return (
    <Provider store={store}>
      <PersistGate isReady={null} persistor={persistor}>
        <Header />
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0"
          />
        </Head>
        {/* {isReady ? <Loading /> : <Component {...pageProps} />} */}
          <NextProgress delay={300} options={{ showSpinner: false }} />
         <Component {...pageProps} /> 
      </PersistGate>
    </Provider>
  );
}
