import React, { useState, useRef } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebLoading, MainHeader } from "../components";
import { WebView } from "react-native-webview";
import { webScript, HistoryButton, API_URI } from "../components/WebLoading";
import { useDispatch } from "react-redux";
import { LOGOUT_USER } from "../redux/constant";

export const AdminDashboard = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState(false);
  const web = useRef(null);
  const dispatch = useDispatch();
  const handleHistory = ({ canGoBack, url }) => {
    if (url === API_URI) {
      dispatch({ type: LOGOUT_USER });
    }
    setHistory(canGoBack);
  };
  
// console.log('his',history);

  return (
    <View style={{ flex: 1 }}>
      <MainHeader navigation={navigation} />
      <SafeAreaView style={{ flex: 1 }} edges={["bottom", "left", "right"]}>
        <WebView
          ref={web}
          style={{ flex: 1 }}
          source={{
            uri: "https://members.yourfitster.com/home"
          }}
          injectedJavaScriptBeforeContentLoaded={webScript}
          injectedJavaScript={webScript}
          javaScriptEnabled
          domStorageEnabled
          sharedCookiesEnabled
          thirdPartyCookiesEnabled
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
