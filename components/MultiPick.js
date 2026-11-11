import React, { Component } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import { Icon } from "./rne";
import Fancy from "@gadhiyamanan/react-native-modal";
import { height } from "./Style";
import Device from "react-native-device-detection";

class MultiPick extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      selected: []
    };
  }

  render() {
    return (
      <View style={this.props.style || {}}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => this.setState({ showModal: true })}
          style={{
            borderWidth: 1,
            borderColor: "#333",
            borderRadius: 8,
            padding: 12,
            marginVertical: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <Text style={{ fontSize: 16 }}>
            {this.props.selectedItems.length
              ? `${this.props.selectedItems.length} Selected`
              : "Select Discount Category"}
          </Text>
          <Icon name="chevron-down-circle-outline" type="ionicon" color="#f250a9" />
        </TouchableOpacity>

        <Fancy
          coverScreen
          isVisible={this.state.showModal}
          onBackButtonPress={() => this.setState({ showModal: false })}
          onBackdropPress={() => this.setState({ showModal: false })}
        >
          <View
            style={{
              backgroundColor: "#fff",
              width: Device.isTablet ? "90%" : "100%",
              height: height / 1.5,
              padding: 8,
              paddingVertical: 16,
              alignSelf: "center"
            }}
          >
            <FlatList
              data={this.props.items || []}
              renderItem={this._renderLists}
              showsVerticalScrollIndicator={false}
              extraData={this.props.selectedItems}
            />
          </View>
        </Fancy>
      </View>
    );
  }

  _renderLists = ({ item }) => (
    <View key={item.id.toString()} style={{ marginBottom: 16 }}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          borderBottomWidth: StyleSheet.hairlineWidth,
          marginBottom: 4
        }}
      >
        {item.name}
      </Text>
      <View>
        {item.children.map((sub, index) => (
          <TouchableOpacity
            onPress={() => this.props.onSelectChange(sub.id)}
            key={index.toString()}
            style={{
              borderWidth: StyleSheet.hairlineWidth,
              marginVertical: 8,
              padding: 10,
              borderRadius: 8,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <Text style={{ fontSize: 14 }}>{sub.name}</Text>
            {this.props.selectedItems.includes(sub.id) && (
              <Icon
                name="checkmark-circle-outline"
                type="ionicon"
                size={18}
                color="#f250a9"
              />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export default MultiPick;
