import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  ActivityIndicator,
  Pressable
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Styles } from "../components";
import { Image } from "react-native";
import { Input, Button, Overlay } from "react-native-elements";
import { checkCode } from "../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../redux/selector";
import Device from "react-native-device-detection";
import * as WebBrowser from 'expo-web-browser';

const { width, height } = Dimensions.get("window");

export const Login = ({ navigation }) => {
  const [error, setError] = useState("");
  const [code, setCode] = useState("");
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();

  const userState = useSelector(getUser);

  const loginUser = () => {
    console.log('loginuser',show);
    if (code === "") {
      setError("Enter Your Staff Code");
      return;
    }
    //  setShow(true);
    dispatch(checkCode(code));
  };

  useEffect(() => {
    setShow(false);
    const { user, loading, error, admin } = userState;
    if (loading) {
      setShow(true);
    } else {
      setShow(false);
    }

    if (error) {
      setError(error);
      setShow(false);
      return;
    }

    if (user) {
      navigation.navigate(admin ? "Admin" : "Home");
    }
  }, [userState]);

  // console.log(width);
  return (
    <SafeAreaView style={[Styles.GLOBAL_BG, { flex: 1 }]}>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView contentContainerStyle={[Styles.wrapper, { flex: 1 }]}>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Image
              source={require("../assets/logo/logo.png")}
              style={{
                width: width > 700 ? "80%" : width - 100,
                // aspectRatio: 1,
                resizeMode: "contain",
                alignSelf: "center"
                // backgroundColor: "red"
              }}
            />
          </View>
          <View style={{ flex: 2, justifyContent: "center" }}>
            <View
              style={{
                width: Device.isTablet ? "80%" : "100%",
                alignSelf: "center"
              }}
            >
              <Input
                placeholder="Staff Code"
                autoCorrect={false}
                inputStyle={{
                  borderWidth: 1,
                  borderColor: "#ddd",
                  paddingLeft: 8,
                  borderRadius: 4,
                  paddingVertical: 8,
                  color: "#fff"
                }}
                onChangeText={text => setCode(text)}
                inputContainerStyle={{
                  borderBottomColor: "transparent"
                }}
                containerStyle={{ paddingHorizontal: 0, marginBottom: 32 }}
                underlineColorAndroid="transparent"
                errorMessage={error}
                onSubmitEditing={loginUser}
                placeholderTextColor="#ddd"
              />
              <Button
                title="Authorize"
                onPress={loginUser}
                buttonStyle={[
                  Styles.GLOBAL_BG_COLOR,
                  // Styles.lightShadow,
                  { paddingVertical: 10 }
                ]}
              />
              {/* <Pressable onPress={loginUser} >
               <Text style={[
                  Styles.GLOBAL_BG_COLOR,
                  // Styles.lightShadow,
                  { paddingVertical: 10 }
                ]}> Authorize</Text>
              </Pressable> */}

              <Button
                title="Login as Admin"
                onPress={() => {
                  navigation.navigate("AdminLogin");
                }}
                buttonStyle={[
                  // Styles.lightShadow,
                  {
                    paddingVertical: 10,
                    backgroundColor: "#666",
                    marginTop: 16
                  }
                ]}
              />
            </View>
          </View>
          {
            show && (
              // <Overlay overlayStyle={{ backgroundColor: 'transparent' }} isVisible={show}>
              
              // </Overlay>
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center", position: 'absolute', backgroundColor: '#000',opacity:0.5, left: 0, right: 0, top: 0, bottom: 0
                  }}
                >
                  <ActivityIndicator size="large" color="#fff" />
                </View>
            )
          }

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
