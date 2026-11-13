import React, { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebLoading, MainHeader } from "../components";
import { WebView } from "react-native-webview";
import { webScript, API_URI } from "../components/WebLoading";
import { LOGOUT_USER } from "../redux/constant";

export const Category = ({ navigation }) => {
  const [loading, setLoading] = useState(true);

  const handleHistory = ({ canGoBack, url }) => {
    if (url === API_URI) {
      dispatch({ type: LOGOUT_USER });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <MainHeader navigation={navigation} />
      <SafeAreaView style={{ flex: 1 }} edges={["bottom", "left", "right"]}>
        <WebView
          style={{ width: "100%", height: "100%" }}
          source={{
            uri: "https://members.yourfitster.com/category"
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
        {loading && <WebLoading />}
      </SafeAreaView>
    </View>
  );
};
