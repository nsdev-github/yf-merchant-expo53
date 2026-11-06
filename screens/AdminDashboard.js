import React, { useState, useRef } from "react";
import { View, Text, SafeAreaView, StatusBar, Platform } from "react-native";
import { Styles, WebLoading, MainHeader } from "../components";
import { WebView } from "react-native-webview";
import { webScript, HistoryButton, API_URI } from "../components/WebLoading";
import { useDispatch } from "react-redux";
import { LOGOUT_ADMIN } from "../redux/constant";

export const AdminDashboard = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState(false);
  const web = useRef(null);
  const dispatch = useDispatch();
  const handleHistory = ({ canGoBack, url }) => {
    if (url === API_URI) {
      dispatch({ type: LOGOUT_ADMIN });
      navigation.navigate("Loading");
    }
    setHistory(canGoBack);
  };
  
// console.log('his',history);

  return (
    <View style={{ flex: 1 }}>
      <MainHeader {...{ navigation }} />
      <SafeAreaView style={{ flex: 1 }}>
        <WebView
          ref={web}
          style={{ flex: 1 }}
          source={{
            uri: "https://members.yourfitster.com/home"
          }}
          injectedJavaScript={webScript}
          javaScriptEnabled
          bounces={false}
          showsVerticalScrollIndicator={false}
          onNavigationStateChange={handleHistory}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
        />

        {history && <HistoryButton onPress={() => web.current.goBack()} />}

        {loading && <WebLoading />}
      </SafeAreaView>
    </View>
  );
};
