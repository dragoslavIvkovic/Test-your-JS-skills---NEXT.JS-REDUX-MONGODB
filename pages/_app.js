import Header from "../components/Header";
import "../styles/globals.css";
import {Provider} from "react-redux";
import  store  from "../store/store"
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';

let persistor = persistStore(store);

export default function MyApp({ Component, pageProps }) {
  return (
    <div>
    <Provider store={store}>
     <PersistGate loading={null} persistor={persistor}>
      <Header />
      <Component {...pageProps} />
      </PersistGate>
      </Provider>
    </div>
  );
}
