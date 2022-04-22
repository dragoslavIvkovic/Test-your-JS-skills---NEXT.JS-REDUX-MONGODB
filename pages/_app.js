import Header from "../components/Header";
import "../styles/globals.css";
import {Provider} from "react-redux";
import  store  from "../store/store"
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
 import { SessionProvider } from 'next-auth/react';
 

let persistor = persistStore(store);

export default function MyApp({ Component,  pageProps  }) {
  return (
    <div>
    <Provider store={store}>
    <SessionProvider  >
     <PersistGate loading={null} persistor={persistor}>
      <Header />
      <Component {...pageProps} />
      </PersistGate> </SessionProvider>
      </Provider>
    </div>
  );
}
