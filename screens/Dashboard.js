import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Platform
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Styles } from "../components";
import { Camera, CameraView, useCameraPermissions } from "expo-camera";
import { MaterialIcons } from "@react-native-vector-icons/material-icons";
import Modal from "@gadhiyamanan/react-native-modal";
import { Button, Icon } from "../components/rne";
import { useSelector, useDispatch } from "react-redux";
import { getCard } from "../redux/selector";
import { fetchCard } from "../redux/actions";
import { width, height } from "../components/Style";
// import Lottie from "lottie-react-native";
import Devices from "react-native-device-detection";
import Device from "react-native-device-detection";
import { useFocusEffect } from "@react-navigation/native";

const flashModeOrder = {
  off: "torch",
  torch: "off"
};

const flashIcons = {
  off: "flash-on",
  torch: "flash-off"
};

export const Dashboard = ({ navigation }) => {
  // const [permission, setPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [flash, setFlash] = useState("off");
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraActive, setCameraActive] = useState(false);

  const [showIntro, setShowIntro] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const dispatch = useDispatch();
  const scanInFlightRef = useRef(false);

  const cardState = useSelector(getCard);

  const { error, loading, card } = cardState;
  useFocusEffect(
    useCallback(() => {
      setCameraActive(true);
      return () => setCameraActive(false);
    }, [])
  );

  

  // useEffect(() => {
  //   (async () => {
  //     const { status } = await BarCodeScanner.requestPermissionsAsync();
  //     setPermission(status === "granted");
  //   })();
  // }, [cardState]);


  // useEffect(() => {
  //   const getBarCodeScannerPermissions = async () => {
  //     setScanned(false);
  //     const { status } = await BarCodeScanner.requestPermissionsAsync();
  //     setPermission(status === 'granted');
  //   };

  //   getBarCodeScannerPermissions();
  // }, []);



  useFocusEffect(() => {
    requestPermission();
  })

  const resetScan = useCallback(() => {
    scanInFlightRef.current = false;
    setScanned(false);
  }, []);

  const barCodeScanned = useCallback(
    ({ data }) => {
      if (scanInFlightRef.current) {
        return;
      }
      scanInFlightRef.current = true;
      setScanned(true);
      console.log("fetch card for", data);
      dispatch(fetchCard(data));
      setShowModal(true);
    },
    [dispatch]
  );

  const toggleFlash = () => {
    setFlash(flash => flashModeOrder[flash]);
  };

  return (
    <SafeAreaView style={[Styles.GLOBAL_BG, { flex: 1 }]}>
      <ScrollView
        contentContainerStyle={[
          Styles.wrapper,
          { flex: 1, position: "relative" }
        ]}
        bounces={false}
      >
        <View
          style={{
            position: "absolute",
            right: 10,
            zIndex: 999
          }}
        >
          <TouchableOpacity
            style={{
              width: 32,
              height: 32,
              alignSelf: "flex-end",
              marginTop: 16
            }}
            onPress={() => {
              setShowIntro(true);
            }}
          >
            <Icon
              name="help-circle-outline"
              type="ionicon"
              color="#fff"
              size={28}
            />
          </TouchableOpacity>
        </View>
        {!permission?.granted ? (
          <View style={Styles.cameraWrapper}>
            <Text style={{ color: "#fff" }}>Need Camera Permission</Text>
          </View>
        ) : (
          <View style={{ flex: 1, alignItems: "center" }}>
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Text
                style={{
                  fontSize: 24,
                  color: "#fff",
                  fontWeight: "bold",
                  textAlign: "center"
                }}
              >
                Scan "VIP Member Card" to Continue
              </Text>
            </View>
            <View style={Styles.cameraWrapper}>
              {/* <Camera
                  flashMode={flash}
                  style={{ width: width / 1.5, height: height / 3 }}
                  zoom={0}
                  autoFocus="on"
                  barCodeScannerSettings={{
                    barCodeTypes: ['qr']
                  }}
                  onBarCodeScanned={scanned ? barCodeScanned : undefined}
                /> */}
              {/* <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : barCodeScanned}
                style={{
                  width: width / 1.5,
                  height: height / 3
                  // transform: [{ rotate: "90deg" }]
                }}
              /> */}

              <CameraView
                facing={"back"}
                active={cameraActive}
                flashMode={flash}
                style={{ width: width / 1.5, height: height / 3 }}
                // type={Camera.Constants.Type.back}
                zoom={0}
                autoFocus="on"
                barcodeScannerSettings={{ barcodeTypes: ["qr", "pdf417"] }}
                onBarcodeScanned={scanned ? undefined : barCodeScanned}
              />


            </View>
            {/* <View style={{ flex: 1, justifyContent: "center" }}>
              <TouchableOpacity
                onPress={toggleFlash}
                activeOpacity={0.8}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  borderWidth: 2,
                  borderColor: "#F250A9",
                  justifyContent: "center",
                  alignItems: "center",
                  marginVertical: 32,
                  backgroundColor: "#fff"
                }}
              >
                <MaterialIcons
                  name={flashIcons[flash]}
                  size={34}
                  color="#F250A9"
                />
              </TouchableOpacity>
            </View> */}
          </View>
        )}
        <Modal
          isVisible={showModal}
          coverScreen
          animationIn="zoomInDown"
          animationOut="zoomOutUp"
          animationInTiming={600}
          animationOutTiming={600}
          backdropTransitionInTiming={600}
          backdropTransitionOutTiming={600}
          onBackButtonPress={() => {
            setShowModal(false);
            resetScan();
          }}
          useNativeDriver
        >
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            {loading ? (
              <View
                style={{
                  width: Devices.isTablet ? "75%" : width - 100,
                  height: height / 3,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#fff",
                  alignSelf: "center"
                }}
              >
                {/* <Lottie
                  autoPlay
                  loop
                  source={require("../assets/scanner.json")}
                  style={{ width: "100%" }}
                /> */}
                <Image
                  source={require("../assets/loading.gif")}
                  style={{
                    width: 100,
                    height: 100,
                    flex: 1,
                    resizeMode: "cover"
                  }}
                />
              </View>
            ) : error ? (
              <View
                style={{
                  width: Devices.isTablet ? "75%" : width - 100,
                  padding: 24,
                  backgroundColor: "#fff",
                  borderRadius: 8,
                  alignItems: "center",
                }}
              >
                <Text style={{ textAlign: "center", marginBottom: 16, color: "#333" }}>
                  {error}
                </Text>
                <Button
                  title="Close"
                  onPress={() => {
                    setShowModal(false);
                    resetScan();
                  }}
                  buttonStyle={{ backgroundColor: "#F250A9" }}
                />
              </View>
            ) : card ? (
              <View style={Styles.modalWrapper}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative"
                  }}
                >
                  <View
                    style={{
                      width: Devices.isTablet ? 150 : 120,
                      height: Devices.isTablet ? 150 : 120,
                      borderColor: "#F250A9",
                      borderWidth: 2,
                      borderRadius: Devices.isTablet ? 75 : 60,
                      overflow: "hidden",
                      position: "absolute",
                      top: Devices.isTablet ? -75 : -60
                    }}
                  >
                    <Image
                      source={{ uri: card.image }}
                      style={{
                        width: null,
                        height: null,
                        flex: 1,
                        resizeMode: "cover"
                      }}
                    />
                  </View>

                  <TouchableOpacity
                    style={{
                      width: Device.isTablet ? 32 : 24,
                      height: Device.isTablet ? 32 : 24,
                      borderColor: "#F250A9",
                      borderWidth: 1,
                      borderRadius: Device.isTablet ? 16 : 12,
                      position: "absolute",
                      right: Device.isTablet ? 20 : 10,
                      top: 10,
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                    onPress={() => {
                      setShowModal(false);
                      resetScan();
                    }}
                  >

                    <Icon name="close-outline" type="ionicon" />
                  </TouchableOpacity>
                </View>

                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 18,
                    textAlign: "center",
                    marginBottom: 4
                  }}
                >
                  {card.username}
                </Text>

                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 14,
                    textAlign: "center"
                  }}
                >
                  Code: {card.card}
                </Text>

                <View
                  style={{
                    flex: 1,
                    paddingHorizontal: 8,
                    justifyContent: "flex-end",
                    marginBottom: 8
                  }}
                >
                  <Button
                    title="Give Discount"
                    buttonStyle={{ backgroundColor: "#F250A9" }}
                    onPress={() => {
                      setShowModal(false);
                      resetScan();
                      navigation.navigate("Discount", { usermeta: card });
                    }}
                  />
                </View>
              </View>
            ) : null}
          </View>
        </Modal>
      </ScrollView>

      <Modal
        isVisible={showIntro}
        coverScreen
        animationIn="zoomInDown"
        animationOut="zoomOutUp"
        animationInTiming={600}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}
        useNativeDriver
      >
        <View
          style={{
            width: Device.isTablet ? "70%" : "80%",
            height: Device.isTablet ? "60%" : "40%",
            backgroundColor: "#fff",
            alignSelf: "center",
            position: "relative"
          }}
        >
          <TouchableOpacity
            style={{
              width: 32,
              height: 32,
              borderColor: "#F250A9",
              borderWidth: 1,
              borderRadius: 16,
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "flex-end",
              marginTop: 8,
              marginRight: 8
            }}
            onPress={() => {
              setShowIntro(false);
            }}
          >

            <Icon name="close-outline" type="ionicon" />
          </TouchableOpacity>
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            {/* <Lottie
              autoPlay
              loop
              source={require("../assets/intro-scan.json")}
              style={{ width: "60%" }}
            /> */}
            <Image
              source={require("../assets/loading.gif")}
              style={{
                width: 100,
                height: 100,
                flex: 1,
                resizeMode: "cover"
              }}
            />
          </View>
          <Text
            style={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: 16,
              marginBottom: 8,
              paddingHorizontal: 4
            }}
          >
            Hold Steady and Scan VIP Member Card
          </Text>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
