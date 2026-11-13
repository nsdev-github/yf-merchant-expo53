import React, { useEffect } from "react";
import { View } from "react-native";
import { useDispatch } from "react-redux";
import WebView from "react-native-webview";
import { LOGOUT_USER } from "../redux/constant";
const MEMBERS_LOGOUT_URI = "https://members.yourfitster.com/api-logout";

export const AdminLogout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: LOGOUT_USER });
  }, [dispatch]);

  return (
    <View style={{ width: 0, height: 0, overflow: "hidden" }} pointerEvents="none">
      <WebView
        source={{ uri: MEMBERS_LOGOUT_URI }}
        javaScriptEnabled
        domStorageEnabled
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
      />
    </View>
  );
};
