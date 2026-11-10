import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  ScrollView,
  Text,
  KeyboardAvoidingView,
  Alert,
  ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Styles, Picker as MultiPick } from "../components";
import {Picker} from '@react-native-picker/picker';

import { Input, Button } from "../components/rne";
import { useSelector, useDispatch } from "react-redux";
import {
  getUser,
  getDiscountStatus,
  getCategoryLists
} from "../redux/selector";
import { addDiscountDB, fetchCategories } from "../redux/actions";
import Device from "react-native-device-detection";

export const Discount = ({ navigation, route }) => {
  const {usermeta: card} = route.params;
  const staff = useSelector(getUser);

  const dispatch = useDispatch();

  const [lists, setLists] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [note, setNote] = useState(null);

  const categoryLists = useSelector(getCategoryLists);

  const subscrition = useSelector(getDiscountStatus);

  const { loading: Loading, error, categories } = categoryLists;



  const selectionChange = selectedItems => {
    setLists(lists =>
      lists.includes(selectedItems)
        ? lists.filter(i => i !== selectedItems)
        : [...lists, selectedItems]
    );
  };

  useEffect(() => {
    dispatch(fetchCategories(staff.user.id));

    if (subscrition.data) {
      dispatch({ type: "RESET_DISCOUNT_STATUS" });
      navigation.navigate("Success");
    }
  }, [subscrition.data]);

  const giveDiscount = () => {
    if (lists && lists.length === 0) {
      Alert.alert("Hold On", "You Need to Select at least one Discount Type. ");
      return;
    }

    dispatch(
      addDiscountDB({ lists, discount, note, ...staff.user, user_id: card.id })
    );
  };

  if (Loading || (categories && categories.length < 0)) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="small" color="#333" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
          <View
            style={{
              flex: 2,
              backgroundColor: "#e94da3",
              justifyContent: "center",
              alignItems: "center",
              padding: 16
            }}
          >
            <View
              style={{
                width: 150,
                height: 150,
                borderRadius: 150 / 2,
                overflow: "hidden"
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

            <Text
              style={{
                fontWeight: "bold",
                fontSize: 22,
                color: "#fff",
                marginTop: 16
              }}
            >
              {card.username}
            </Text>

            <Text
              style={{
                fontWeight: "bold",
                fontSize: 14,
                color: "#fff",
                marginTop: 8
              }}
            >
              {card.card}
            </Text>
          </View>
          <View style={{ flex: 3, alignItems: "center" }}>
            <View
              style={[
                Styles.wrapper,
                { width: Device.isTablet ? "90%" : "100%" }
              ]}
            >
              <MultiPick
                items={categories}
                onSelectChange={selectionChange}
                selectedItems={lists}
                style={{ marginVertical: 16 }}
              />

              <View
                style={{
                  borderWidth: 1,
                  borderColor: "#333",
                  borderRadius: 8,
                  marginVertical: 16
                }}
              >
                <Picker
                  selectedValue={discount}
                  onValueChange={val => setDiscount(val)}
                >
                  {[...Array(100).keys()].map(item => (
                    <Picker.Item
                      label={`${item} % Discount`}
                      value={item}
                      key={item.toString()}
                    />
                  ))}
                </Picker>
              </View>
            </View>
            <View style={{ width: Device.isTablet ? "90%" : "100%" }}>
              <Input
                onChangeText={text => setNote(text)}
                placeholder="Note (Optional)"
                autoCorrect={false}
                multiline
                numberOfLines={6}
                inputContainerStyle={{
                  borderColor: "transparent"
                }}
                underlineColorAndroid="transparent"
                inputStyle={{
                  borderColor: "#333",
                  borderWidth: 1,
                  borderRadius: 8,
                  marginVertical: 16,
                  textAlignVertical: "top",
                  padding: 8,
                  height: 200
                }}
              />

              <Button
                onPress={giveDiscount}
                title="Give Discount"
                containerStyle={{ paddingHorizontal: 8, marginBottom: 8 }}
                buttonStyle={{
                  backgroundColor: "#f250a9",
                  paddingVertical: 12
                }}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
