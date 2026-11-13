import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, Text, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Styles, WebLoading, MainHeader } from "../components";
import { Button } from "../components/rne";
import { WebView } from "react-native-webview";
import * as Linking from "expo-linking";
import { useDispatch, useSelector } from "react-redux";
import { LOGOUT_USER, SET_AS_ADMIN } from "../redux/constant";
import {
  AUTH_URI,
  buildAdminUserPayload,
  isAuthenticatedMembersUrl,
  loginWebScript,
  membersProfileExtractionScript,
  parseAdminLoginCallback,
} from "../components/WebLoading";

const TRANSIENT_WEBVIEW_ERRORS = [
  "ERR_NETWORK_CHANGED",
  "ERR_INTERNET_DISCONNECTED",
  "ERR_CONNECTION_RESET",
  "ERR_CONNECTION_ABORTED",
  "ERR_NAME_NOT_RESOLVED",
];

const MAX_AUTO_RETRIES = 3;
const MEMBERS_LOGOUT_URI = "https://members.yourfitster.com/api-logout";

export const AdminLogin = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [webSource, setWebSource] = useState({ uri: MEMBERS_LOGOUT_URI });
  const dispatch = useDispatch();
  const { admin, user: merchantUser } = useSelector(state => state.user);
  const authHandledRef = useRef(false);
  const webViewRef = useRef(null);
  const retryCountRef = useRef(0);
  const pendingProfileRef = useRef(false);
  const profilePartialRef = useRef(null);
  const membersSessionClearedRef = useRef(false);
  const hasSeenLoginPageRef = useRef(false);

  useEffect(() => {
    authHandledRef.current = false;
    pendingProfileRef.current = false;
    profilePartialRef.current = null;
    membersSessionClearedRef.current = false;
    hasSeenLoginPageRef.current = false;
    setWebSource({ uri: MEMBERS_LOGOUT_URI });
    if (merchantUser && !admin) {
      dispatch({ type: LOGOUT_USER });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset session once per visit
  }, []);

  const completeAdminLogin = useCallback(
    partial => {
      if (authHandledRef.current) {
        return;
      }
      authHandledRef.current = true;
      pendingProfileRef.current = false;
      dispatch({
        type: SET_AS_ADMIN,
        payload: buildAdminUserPayload(partial),
      });
      setLoading(false);
    },
    [dispatch]
  );

  const tryParseCallbackUrl = useCallback(url => {
    const params = parseAdminLoginCallback(url);
    if (params) {
      return params;
    }
    if (/admin-login/i.test(url) && /[?&]code=/i.test(url)) {
      return parseAdminLoginCallback(
        url.replace(/^[^:]+:/i, "yourfitster-merchant:")
      );
    }
    return null;
  }, []);

  const requestMembersProfile = useCallback(() => {
    pendingProfileRef.current = true;
    setTimeout(() => {
      webViewRef.current?.injectJavaScript(membersProfileExtractionScript);
    }, 400);
  }, []);

  useEffect(() => {
    const subscription = Linking.addEventListener("url", event => {
      if (authHandledRef.current) {
        return;
      }
      const params = tryParseCallbackUrl(event.url);
      if (params) {
        completeAdminLogin(params);
      }
    });

    return () => subscription.remove();
  }, [completeAdminLogin, tryParseCallbackUrl]);

  const handleAuthRedirect = useCallback(
    url => {
      if (authHandledRef.current) {
        return true;
      }
      if (
        /members\.yourfitster\.com/i.test(url) &&
        /\/login/i.test(url)
      ) {
        hasSeenLoginPageRef.current = true;
      }
      const params = tryParseCallbackUrl(url);
      if (params) {
        completeAdminLogin(params);
        return false;
      }
      if (
        hasSeenLoginPageRef.current &&
        isAuthenticatedMembersUrl(url)
      ) {
        requestMembersProfile();
      }
      return true;
    },
    [completeAdminLogin, requestMembersProfile, tryParseCallbackUrl]
  );

  const onWebViewLoadEnd = useCallback(() => {
    setLoading(false);
    retryCountRef.current = 0;

    if (
      !membersSessionClearedRef.current &&
      webSource.uri === MEMBERS_LOGOUT_URI
    ) {
      membersSessionClearedRef.current = true;
      setWebSource({ uri: AUTH_URI });
      setLoading(true);
      return;
    }

    if (pendingProfileRef.current && !authHandledRef.current) {
      webViewRef.current?.injectJavaScript(membersProfileExtractionScript);
    }
  }, [webSource.uri]);

  const onWebViewMessage = useCallback(
    event => {
      if (!pendingProfileRef.current || authHandledRef.current) {
        return;
      }
      try {
        const data = JSON.parse(event.nativeEvent.data);
        if (data?.type !== "yfAdminProfile") {
          return;
        }
        completeAdminLogin({
          ...(profilePartialRef.current ?? {}),
          name: data.name,
          image: data.image,
        });
      } catch {
        // ignore non-JSON postMessage
      }
    },
    [completeAdminLogin]
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
    authHandledRef.current = false;
    hasSeenLoginPageRef.current = false;
    membersSessionClearedRef.current = false;
    setWebSource({ uri: MEMBERS_LOGOUT_URI });
  }, []);

  if (admin) {
    return (
      <View style={{ flex: 1, backgroundColor: "#343A40" }}>
        <WebLoading />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#343A40" }}>
      <MainHeader navigation={navigation} showBack hideLogo />
      <SafeAreaView style={{ flex: 1 }} edges={["bottom", "left", "right"]}>
        <WebView
          ref={webViewRef}
          style={{ flex: 1 }}
          source={webSource}
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
          injectedJavaScriptBeforeContentLoaded={loginWebScript}
          injectedJavaScript={loginWebScript}
          bounces={false}
          showsVerticalScrollIndicator={false}
          onShouldStartLoadWithRequest={request =>
            handleAuthRedirect(request.url)
          }
          onNavigationStateChange={navState => {
            handleAuthRedirect(navState.url);
          }}
          onLoadStart={() => {
            setLoadError(null);
            setLoading(true);
          }}
          onMessage={onWebViewMessage}
          onLoadEnd={onWebViewLoadEnd}
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
