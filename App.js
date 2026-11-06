import React from "react";
import { StyleSheet, Text, View, SafeAreaView, StatusBar } from "react-native";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import Store from "./redux/store";
import Navigation from "./navigation";
import Axios from "axios";
import * as SplashScreen from 'expo-splash-screen';
// SplashScreen.preventAutoHideAsync();

Axios.defaults.baseURL = "https://www.yourfitster.com/wp-json/ns-yf/v1/";
Axios.defaults.headers.common["apiKey"] =
  "d4bd81ec-db02-44ea-ad99-f5adebcd8373";

const { store, persistor } = Store();

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <StatusBar barStyle="light-content" />
        <Navigation />
      </PersistGate>
    </Provider>
  );
}
