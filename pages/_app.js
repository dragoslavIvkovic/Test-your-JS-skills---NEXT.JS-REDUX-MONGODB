import Header from "../components/Header";
import "../styles/globals.css";
import {Provider} from "react-redux";
import store from "../store/store"

export default function MyApp({ Component, pageProps }) {
  return (
    <div>
    <Provider store={store}>
      <Header />
      <Component {...pageProps} />
      </Provider>
    </div>
  );
}
