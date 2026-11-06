import { StyleSheet, Platform, Dimensions } from "react-native";
import Devices from "react-native-device-detection";
export const { width, height } = Dimensions.get("window");

export const Styles = StyleSheet.create({
  GLOBAL_COLOR: {
    color: "pink"
  },
  GLOBAL_BG: {
    backgroundColor: "#343A40"
  },
  GLOBAL_BG_COLOR: {
    backgroundColor: "#F250A9"
  },
  wrapper: {
    paddingHorizontal: 8
  },
  droidSafeArea: {
    paddingTop: Platform.OS === "android" ? 25 : 0
  },
  lightShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3
  },
  cameraWrapper: {
    // justifyContent: "center",
    alignItems: "center",
    flex: 2
  },
  modalWrapper: {
    width: Devices.isTablet ? "75%" : "85%",
    height: height / 3,
    backgroundColor: "#fff",
    borderRadius: 8
  },
  roundedBtn: {
    width: 54,
    height: 54,
    borderRadius: 54 / 2,
    backgroundColor: "#fff",
    elevation: 3,
    justifyContent: "center",
    alignItems: "center"
  }
});
