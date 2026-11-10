import React from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon } from "./rne";

export const MainHeader = ({ navigation, showBack = false }) => {
  const insets = useSafeAreaInsets();

  const onLeadingPress = () => {
    if (showBack) {
      navigation.goBack();
      return;
    }
    if (navigation.openDrawer) {
      navigation.openDrawer();
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <TouchableOpacity
        onPress={onLeadingPress}
        style={styles.side}
        hitSlop={8}
      >
        <Icon name={showBack ? "arrow-back" : "menu"} color="#fff" />
      </TouchableOpacity>
      <View style={styles.center}>
        <Image
          source={require("../assets/logo/logo.png")}
          style={styles.logo}
        />
      </View>
      <View style={styles.side} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#343A40",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingBottom: 10
  },
  side: {
    width: 40,
    alignItems: "flex-start",
    justifyContent: "center"
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  logo: {
    height: 35,
    aspectRatio: 5,
    resizeMode: "contain"
  }
});
