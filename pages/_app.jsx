/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import '../styles/globals.css';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import Head from 'next/head';
import store from '../store/store';
import Header from '../components/Header';
import 'normalize.css';
import Loading from "../components/Loading";

const persistor = persistStore(store);

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  

useEffect(() => {
    const handleStart = (url) => {
      url !== router.pathname ? setLoading(true) : setLoading(false);
    };
    const handleComplete = (url) => setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);
  }, [router]);


  return (
    
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Header />
          <Head>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0"
            />
        </Head>
        {loading ?
          <Loading loading={loading} /> :
          <Component {...pageProps} />}
        </PersistGate>
        
      </Provider>
     
  );
}
