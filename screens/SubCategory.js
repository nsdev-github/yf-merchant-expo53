import React, { useState } from "react";
import { View, Text, SafeAreaView, StatusBar, Platform } from "react-native";
import { Styles, WebLoading, MainHeader } from "../components";
import { WebView } from "react-native-webview";
import { webScript, API_URI } from "../components/WebLoading";
import { LOGOUT_ADMIN } from "../redux/constant";

export const SubCategory = ({ navigation }) => {
  const [loading, setLoading] = useState(true);

  const handleHistory = ({ canGoBack, url }) => {
    if (url === API_URI) {
      dispatch({ type: LOGOUT_ADMIN });
      navigation.navigate("Loading");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <MainHeader {...{ navigation }} />
      <SafeAreaView style={{ flex: 1 }}>
        <WebView
          style={{ flex: 1 }}
          source={{
            uri: "https://members.yourfitster.com/subCategory"
          }}
          injectedJavaScript={webScript}
          javaScriptEnabled
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
