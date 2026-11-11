import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, Text, Platform, BackHandler } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Styles, WebLoading, MainHeader } from "../components";
import { Button } from "../components/rne";
import { WebView } from "react-native-webview";
import * as Linking from "expo-linking";
import { useDispatch, useSelector } from "react-redux";
import { LOGOUT_USER, SET_AS_ADMIN } from "../redux/constant";
import { AUTH_URI, parseAdminLoginCallback } from "../components/WebLoading";

const TRANSIENT_WEBVIEW_ERRORS = [
  "ERR_NETWORK_CHANGED",
  "ERR_INTERNET_DISCONNECTED",
  "ERR_CONNECTION_RESET",
  "ERR_CONNECTION_ABORTED",
  "ERR_NAME_NOT_RESOLVED",
];

const MAX_AUTO_RETRIES = 3;

export const AdminLogin = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const dispatch = useDispatch();
  const { admin } = useSelector(state => state.user);
  const authHandledRef = useRef(false);
  const webViewRef = useRef(null);
  const retryCountRef = useRef(0);

  useEffect(() => {
    dispatch({ type: LOGOUT_USER });
  }, [dispatch]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => true);
    return () => subscription.remove();
  }, []);

 
  useEffect(() => {
    const subscription = Linking.addEventListener("url", event => {
      if (authHandledRef.current) {
        return;
      }
      const params = parseAdminLoginCallback(event.url);
      if (params) {
        authHandledRef.current = true;
        dispatch({ type: SET_AS_ADMIN, payload: params });
      }
    });

    return () => subscription.remove();
  }, [dispatch]);

  const handleAuthRedirect = useCallback(
    url => {
      if (authHandledRef.current) {
        return true;
      }
      const params = parseAdminLoginCallback(url);
      if (params) {
        authHandledRef.current = true;
        dispatch({ type: SET_AS_ADMIN, payload: params });
        setLoading(false);
        return false;
      }
      return true;
    },
    [dispatch]
  );

  const scheduleRetry = useCallback(() => {
    retryCountRef.current += 1;
    setLoading(true);
    setLoadError(null);
    setTimeout(() => {
      webViewRef.current?.reload();
    }, 600);
  }, []);

  const onWebViewError = useCallback(
    event => {
      const { description = "" } = event.nativeEvent;
      setLoading(false);

      const isTransient = TRANSIENT_WEBVIEW_ERRORS.some(code =>
        description.includes(code)
      );

      if (isTransient && retryCountRef.current < MAX_AUTO_RETRIES) {
        scheduleRetry();
        return;
      }

      setLoadError(
        description.includes("ERR_NETWORK_CHANGED")
          ? "Network changed while loading. Check Wi‑Fi or mobile data, then tap Retry."
          : description || "Unable to load the login page."
      );
    },
    [scheduleRetry]
  );

  const onRetry = useCallback(() => {
    retryCountRef.current = 0;
    setLoadError(null);
    setLoading(true);
    webViewRef.current?.reload();
  }, []);

  if (admin) {
    return null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#343A40" }}>
      <MainHeader navigation={navigation} hideLeading />
      <SafeAreaView
        style={{ flex: 1 }}
        edges={["bottom", "left", "right"]}
      >
      <WebView
        ref={webViewRef}
        style={{ flex: 1 }}
        source={{ uri: AUTH_URI }}
        javaScriptEnabled
        domStorageEnabled
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        cacheEnabled
        setSupportMultipleWindows={false}
        originWhitelist={["https://*", "http://*", "yourfitster-merchant://*"]}
        {...(Platform.OS === "android"
          ? { mixedContentMode: "compatibility", androidLayerType: "hardware" }
          : {})}
        bounces={false}
        showsVerticalScrollIndicator={false}
        onShouldStartLoadWithRequest={request => handleAuthRedirect(request.url)}
        onNavigationStateChange={navState => {
          handleAuthRedirect(navState.url);
        }}
        onLoadStart={() => {
          setLoadError(null);
          setLoading(true);
        }}
        onLoadEnd={() => {
          setLoading(false);
          retryCountRef.current = 0;
        }}
        onError={onWebViewError}
        onRenderProcessGone={() => {
          if (retryCountRef.current < MAX_AUTO_RETRIES) {
            scheduleRetry();
          } else {
            setLoadError("Login page stopped responding. Tap Retry.");
            setLoading(false);
          }
          return true;
        }}
      />
      {loadError && (
        <View
          style={{
            ...Styles.wrapper,
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            top: 0,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#343A40",
            paddingHorizontal: 24,
          }}
        >
          <Text style={{ color: "#fff", textAlign: "center", marginBottom: 16 }}>
            {loadError}
          </Text>
          <Button
            title="Retry"
            onPress={onRetry}
            buttonStyle={[Styles.GLOBAL_BG_COLOR, { paddingHorizontal: 32 }]}
          />
        </View>
      )}
      {loading && !loadError && <WebLoading />}
      </SafeAreaView>
    </View>
  );
};
