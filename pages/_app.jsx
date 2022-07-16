/* eslint-disable react/prop-types */
import "../styles/globals.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import Head from "next/head";
import store from "../store/store";
import Header from "../components/Header";
import "normalize.css";

const persistor = persistStore(store);

export default function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Header />
          <Head>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0"
            />
          </Head>
          <Component {...pageProps} />
        </PersistGate>{" "}
      </Provider>
    </div>
  );
}
