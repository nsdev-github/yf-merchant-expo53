import React from "react";
import { View, Image, StyleSheet } from "react-native";

/**
 * Drop-in replacement for RN ImageBackground used by react-native-elements.
 * Avoids the React Native 0.88 ImageBackground deprecation warning.
 */
export default function BackgroundImage({
  style,
  imageStyle,
  source,
  resizeMode,
  children,
  ...rest
}) {
  return (
    <View style={style} {...rest}>
      <Image
        source={source}
        resizeMode={resizeMode}
        style={[StyleSheet.absoluteFill, imageStyle]}
      />
      {children}
    </View>
  );
}
