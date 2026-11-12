import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { LOGOUT_USER } from "../redux/constant";
import WebView from "react-native-webview";
import { WebLoading } from "../components";

export const AdminLogout = ({ navigation }) => {
  const dispatch = useDispatch();

  const uri = "https://members.yourfitster.com/api-logout";

  const logoutUser = ({ nativeEvent }) => {
    if (nativeEvent.progress === 1) {
      dispatch({ type: LOGOUT_USER });
      console.log("admin logout");
      // navigation.navigate("Loading");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <WebView
        source={{ uri }}
        style={{
          display: "none",
        }}
        onLoadProgress={logoutUser}
      />
      <WebLoading />
    </SafeAreaView>
  );
};
