import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import { Icon } from "react-native-elements";
import * as Linking from 'expo-linking';

export const WebLoading = () => {
  return (
    <View
      style={
        (StyleSheet.absoluteFill,
        {
          backgroundColor: "rgba(0,0,0,0.2)",
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center"
        })
      }
    >
      <ActivityIndicator color="#F250A9" />
    </View>
  );
};

export const API_URI = "https://members.yourfitster.com/login";

const redirectUri = Linking.createURL("admin-login");

export const AUTH_URI = `https://members.yourfitster.com/login?redirect=${(
  redirectUri
)}&app=true`;


export const HistoryButton = ({ onPress }) => (
  <TouchableOpacity
    activeOpacity={0.8}
    onPress={onPress}
    style={{
      position: "absolute",
      right: 10,
      bottom: 40,
      width: 42,
      height: 42,
      backgroundColor: "#F250A9",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 21,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,

      elevation: 5
    }}
  >
    <Icon name="ios-arrow-back" type="ionicon" color="#fff" />
  </TouchableOpacity>
);

export const webScript =
  "document.querySelector('.app-nav').style.display = 'none'; document.querySelector('.breadcrumb').style.display = 'none';document.querySelector('.main-wrapper').style.paddingTop = '16px'";

export const Greet = () => {
  const time = new Date().getHours();
  if (time < 10) {
    return "Morning";
  } else if (time < 14) {
    return "Afternoon";
  } else if (time < 18) {
    return "Evening";
  } else {
    return "Night";
  }
};
