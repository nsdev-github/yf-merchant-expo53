import React from "react";
import { StatusBar, Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import Store from "./redux/store";
import Navigation from "./navigation";
import Axios from "axios";

Axios.defaults.baseURL = "https://www.yourfitster.com/wp-json/ns-yf/v1/";
Axios.defaults.headers.common["apiKey"] =
  "d4bd81ec-db02-44ea-ad99-f5adebcd8373";

const { store, persistor } = Store();

export default function App() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <StatusBar barStyle="light-content" />
          <Navigation />
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
}
