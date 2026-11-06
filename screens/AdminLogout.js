import React, { useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  SafeAreaView,
  Dimensions
} from "react-native";
import { useDispatch } from "react-redux";
import { LOGOUT_USER } from "../redux/constant";
import WebView from "react-native-webview";

const { width, height } = Dimensions.get("screen");

export const AdminLogout = ({ navigation }) => {
  const dispatch = useDispatch();

  const uri = "https://members.yourfitster.com/api-logout";

  const logoutUser = ({ nativeEvent }) => {
    if (nativeEvent.progress === 1) {
      dispatch({ type: LOGOUT_USER });
      // navigation.navigate("Loading");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          width,
          height,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <ActivityIndicator
          size="small"
          color="#F250A9"
          style={{ marginBottom: 8 }}
        />
        <Text>Please Wait...</Text>
      </View>

      <WebView
        source={{ uri }}
        style={{
          display: "none"
        }}
        onLoadProgress={logoutUser}
      />
    </SafeAreaView>
  );
};
