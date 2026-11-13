import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { getUser } from "../redux/selector";
import * as Linking from "expo-linking";
import {
  buildAdminUserPayload,
  parseAdminLoginCallback,
} from "../components/WebLoading";

import * as Types from "../redux/constant";

export const Loading = ({ navigation }) => {
  const userState = useSelector(getUser);
  const dispatch = useDispatch();

  useEffect(() => {

    const subscription = Linking.addEventListener("url", event => {
      const params = parseAdminLoginCallback(event.url);
      if (params) {
        dispatch({
          type: Types.SET_AS_ADMIN,
          payload: buildAdminUserPayload(params),
        });
        navigation.navigate("Admin");
      }
    });

    let navigate = "Login";
    const { user, admin } = userState;
    if (user && admin) {
      navigate = "Admin";
    } else if (user) {
      navigate = "Home";
    }
    navigation.navigate(navigate);

    return () => subscription.remove();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignContent: "center" }}>
      <ActivityIndicator size="small" color="#333" />
    </View>
  );
};
