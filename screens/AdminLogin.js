import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, StatusBar, Platform } from "react-native";
import { Styles, WebLoading } from "../components";
import { WebView } from "react-native-webview";
import * as Linking from 'expo-linking'
import { useDispatch, useSelector } from "react-redux";
import { LOGOUT_USER, SET_AS_ADMIN } from "../redux/constant";
import { AUTH_URI } from "../components/WebLoading";
import { getUser } from "../redux/selector";


export const AdminLogin = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const userState = useSelector(getUser);

  useEffect(() => {
    dispatch({ type: LOGOUT_USER });
  }, []);

 
  useEffect(() => {
     Linking.addEventListener("url", event => {
      const data = Linking.parse(event.url);
      if (data.queryParams.code) {
        dispatch({ type: SET_AS_ADMIN, payload: data.queryParams });
        // navigation.navigate("AdminDashboard");
      }
    });

  }, []);

  const debugging = `
  const consoleLog = (type, log) => window.ReactNativeWebView.postMessage(JSON.stringify({'type': 'Console', 'data': {'type': type, 'log': log}}));
  console = {
      log: (log) => consoleLog('log', log),
      debug: (log) => consoleLog('debug', log),
      info: (log) => consoleLog('info', log),
      warn: (log) => consoleLog('warn', log),
      error: (log) => consoleLog('error', log),
    };
`;

const onMessage = (payload) => {
  let dataPayload;
  try {
    dataPayload = JSON.parse(payload.nativeEvent.data);
  } catch (e) {}

  if (dataPayload) {
    if (dataPayload.type === 'Console') {
      console.info(`[Console] ${JSON.stringify(dataPayload.data)}`);
    } else {
      console.log(dataPayload)
    }
  }
};

  return (
    <SafeAreaView
      style={[
        Styles.wrapper,
        {
          flex: 1,
          backgroundColor: "#343A40",
          paddingTop: Platform.OS === "android" ? 25 : 0,
          paddingHorizontal: 0
        }
      ]}
    >
      <WebView
        style={{ flex: 1 }}
        source={{ uri: AUTH_URI }}
        bounces={false}
        showsVerticalScrollIndicator={false}
        sharedCookiesEnabled
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
      />
      {loading && <WebLoading />}
    </SafeAreaView>
  );
};
