import React, { useEffect } from "react";
import { Text, View, ActivityIndicator } from "react-native";
import { useDispatch } from "react-redux";
import { LOGOUT_USER } from "../redux/constant";

export const Logout = ({ navigation }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: LOGOUT_USER });
    navigation.navigate("Loading");
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator color="#333" size="small" />
    </View>
  );
};
