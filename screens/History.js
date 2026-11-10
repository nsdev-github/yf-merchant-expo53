import React, { useState, useRef } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebLoading, MainHeader } from "../components";
import { WebView } from "react-native-webview";
import { webScript, HistoryButton, API_URI } from "../components/WebLoading";
import { LOGOUT_ADMIN } from "../redux/constant";

export const History = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState(false);
  const web = useRef(null);

  const handleHistory = ({ canGoBack, url }) => {
    if (url === API_URI) {
      dispatch({ type: LOGOUT_ADMIN });
      navigation.navigate("Loading");
    }
    setHistory(canGoBack);
  };

  return (
    <View style={{ flex: 1 }}>
      <MainHeader {...{ navigation }} />
      <SafeAreaView style={{ flex: 1 }} edges={["bottom", "left", "right"]}>
        <WebView
          ref={web}
          style={{ flex: 1 }}
          source={{
            uri: "https://members.yourfitster.com/history"
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
