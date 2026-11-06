import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { getUser } from "../redux/selector";
import * as Linking from 'expo-linking';

import * as Types from "../redux/constant";

export const Loading = ({ navigation }) => {
  const userState = useSelector(getUser);
  const dispatch = useDispatch();

  useEffect(() => {

    Linking.addEventListener("url", event => {
      const data = Linking.parse(event.url);

      if (data.queryParams.code) {
        dispatch({ type: Types.SET_AS_ADMIN, payload: data.queryParams });
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

    return () => {
      Linking.removeListener("url");
    };
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignContent: "center" }}>
      <ActivityIndicator size="small" color="#333" />
    </View>
  );
};
