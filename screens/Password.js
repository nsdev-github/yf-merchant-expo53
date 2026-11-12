import React, { useState, useRef } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebLoading, MainHeader } from "../components";
import { WebView } from "react-native-webview";
import { webScript, API_URI } from "../components/WebLoading";
import { LOGOUT_ADMIN } from "../redux/constant";

export const Password = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState(false);

  const handleHistory = ({ canGoBack, url }) => {
    if (url === API_URI) {
      dispatch({ type: LOGOUT_ADMIN });
      navigation.navigate("Loading");
    }
    setHistory(canGoBack);
  };

  return (
    <View style={{ flex: 1 }}>
      <MainHeader navigation={navigation} />
      <SafeAreaView style={{ flex: 1 }} edges={["bottom", "left", "right"]}>
        <WebView
          style={{ flex: 1 }}
          source={{
            uri: "https://members.yourfitster.com/profile"
          }}
          injectedJavaScriptBeforeContentLoaded={webScript}
          injectedJavaScript={webScript}
          javaScriptEnabled
          domStorageEnabled
          sharedCookiesEnabled
          thirdPartyCookiesEnabled
          bounces={false}
          onNavigationStateChange={handleHistory}
          showsVerticalScrollIndicator={false}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
        />
        {loading && <WebLoading />}
      </SafeAreaView>
    </View>
  );
};
