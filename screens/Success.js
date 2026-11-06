import React from "react";
import { View, Text, BackHandler, SafeAreaView, Platform, Pressable } from "react-native";
import { Icon } from "react-native-elements";
import { Styles } from "../components";
import Device from "react-native-device-detection";

export const Success = ({ navigation }) => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#F250A9"
      }}
    >
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 42 }}>
          Success
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: Device.isTablet ? "40%" : "60%",
            marginTop: 32,
            justifyContent: "space-around"
          }}
        >
          <View style={{ alignItems: "center" }}>
            <Pressable
              activeOpacity={0.8}
              style={Styles.roundedBtn}
              onPress={() => navigation.navigate("Scan")}
            >
              <Icon name="qr-code-outline" type="ionicon" size={26} />
            </Pressable>
            <Text style={{ color: "#fff", marginTop: 8 }}>Scan</Text>
          </View>

          <View style={{ alignItems: "center" }}>
            <Pressable
              activeOpacity={0.8}
              style={Styles.roundedBtn}
              onPress={() => navigation.navigate("Logout")}
            >
              <Icon name="log-out-outline" type="ionicon" size={26} />
            </Pressable>
            <Text style={{ color: "#fff", marginTop: 8 }}>Logout</Text>
          </View>

          {Platform.OS === "android" && (
            <View style={{ alignItems: "center" }}>
              <Pressable
                activeOpacity={0.8}
                style={Styles.roundedBtn}
                onPress={() => BackHandler.exitApp()}
              >
                <Icon name="log-out-outline" type="ionicon" size={26} />
              </Pressable>
              <Text style={{ color: "#fff", marginTop: 8 }}>Exit</Text>
            </View>
          )}
        </View>
      </View>

      <View style={{ marginBottom: 8 }}>
        <Text style={{ textAlign: "center", color: "#fff" }}>
          Powered By - NetScriper
        </Text>
      </View>
    </SafeAreaView>
  );
};
