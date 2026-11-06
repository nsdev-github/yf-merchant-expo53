import React from "react";
import { View, Text, Image } from "react-native";
import { Header } from "react-native-elements";

export const MainHeader = ({ navigation }) => {
  return (
    <Header
      backgroundColor="#343A40"
      leftComponent={{
        icon: "menu",
        color: "#fff",
        onPress: () => navigation.openDrawer(),
        underlayColor: "transparent"
      }}
      centerComponent={
        <Image
          source={require("../assets/logo/logo.png")}
          style={{ resizeMode: "center", aspectRatio: 5,height:35 }}
        />
      }
    />
  );
};
