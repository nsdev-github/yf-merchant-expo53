import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image
} from "react-native";
import { Icon } from "./rne";
import * as Linking from 'expo-linking';

export const WebLoading = () => {
  return (
    <View style={[StyleSheet.absoluteFill, webLoadingStyles.overlay]}>
      <View style={webLoadingStyles.content}>
        <Image
          source={require("../assets/loading.gif")}
          style={webLoadingStyles.spinner}
        />
        <Text style={webLoadingStyles.label}>Loading...</Text>
      </View>
    </View>
  );
};

const webLoadingStyles = StyleSheet.create({
  overlay: {
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999
  },
  content: {
    backgroundColor: "#fff",
    paddingVertical: 24,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: "center",
    minWidth: 140
  },
  spinner: {
    width: 48,
    height: 48,
    marginBottom: 8
  },
  label: {
    color: "#F250A9",
    fontSize: 16,
    fontWeight: "600"
  }
});

export const API_URI = "https://members.yourfitster.com/login";

const redirectUri = Linking.createURL("admin-login");

export const AUTH_URI = `https://members.yourfitster.com/login?redirect=${encodeURIComponent(
  redirectUri
)}&app=true`;

/** OAuth callback after members site login (WebView cannot load custom schemes). */
export function parseAdminLoginCallback(url) {
  if (!url || !url.includes("admin-login")) {
    return null;
  }

  const parsed = Linking.parse(url);
  const isAppScheme =
    parsed.scheme === "yourfitster-merchant" || parsed.scheme === "exp";

  if (!isAppScheme) {
    return null;
  }

  const { code } = parsed.queryParams ?? {};
  if (!code) {
    return null;
  }

  return parsed.queryParams;
}

/** Members pages reached only after a successful admin login. */
export function isAuthenticatedMembersUrl(url) {
  if (!url || url.includes("admin-login")) {
    return false;
  }

  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }

  if (parsed.hostname !== "members.yourfitster.com") {
    return false;
  }

  const path = parsed.pathname.replace(/\/+$/, "") || "/";
  return path !== "/" && path !== "/login" && !path.startsWith("/password");
}


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

const hideWebChrome = selectors => `
(function () {
  var css = '${selectors}{display:none!important}.main-wrapper{padding-top:16px!important}';
  var apply = function () {
    var root = document.head || document.documentElement;
    if (!root || document.getElementById('yf-hide-web-header')) return;
    var style = document.createElement('style');
    style.id = 'yf-hide-web-header';
    style.appendChild(document.createTextNode(css));
    root.appendChild(style);
  };
  apply();
  document.addEventListener('DOMContentLoaded', apply);
})();
true;
`;

/** Hide the members-site header; the app already shows a native bar. */
export const webScript = hideWebChrome(".app-nav,.navbar,.breadcrumb");

/** Login page also shows the site logo above the form. */
export const loginWebScript = hideWebChrome(
  ".app-nav,.navbar,.breadcrumb,.main-logo"
);

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
