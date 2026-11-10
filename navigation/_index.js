import React from "react";
import { Text, View, Image, StyleSheet, Platform } from "react-native";
import {
  createAppContainer,
  createSwitchNavigator,
  SafeAreaView
} from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import {
  Loading,
  Login,
  Dashboard,
  Success,
  Logout,
  Discount,
  AdminDashboard,
  Category,
  SubCategory,
  History,
  Subscribers,
  Password,
  AdminLogin,
  AdminLogout
} from "../screens";
import { Icon } from "../components/rne";
import { TouchableOpacity, Alert } from "react-native";
import { createDrawerNavigator, DrawerItems } from "react-navigation-drawer";
import { ScrollView } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import { getUser } from "../redux/selector";
import { Greet } from "../components/WebLoading";

const AppStackNavigator = createStackNavigator(
  {
    Dashboard: {
      screen: Dashboard,
      navigationOptions: {
        title: "Scan"
      }
    },
    Discount,
    Logout: {
      screen: Logout,
      navigationOptions: {
        headerShown: false
      }
    }
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      headerRight: () => (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            Alert.alert("Logout", "Are you sure you want to Logout?", [
              {
                text: "No",
                onPress: () => null
              },
              {
                text: "Yes",
                onPress: () => navigation.navigate("Logout")
              }
            ]);
          }}
        >
          <Icon
            name="log-out-outline"
            type="ionicon"
            color="#fff"
            iconStyle={{ marginRight: 16 }}
          />
        </TouchableOpacity>
      ),
      headerTintColor: "#fff",
      headerStyle: {
        backgroundColor: "#343A40"
      }
    })
  }
);

const CustomDrawerComponent = props => {
  const { user } = useSelector(getUser);

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView
        style={{ flex: 1, paddingTop: Platform.OS === "android" ? 25 : 0 }}
      >
        <View
          style={{
            width: "100%",
            height: 100,
            borderBottomWidth: StyleSheet.hairlineWidth,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Image
            source={{ uri: user.image || "//unsplash.it/50" }}
            resizeMode="center"
            style={{ width: 80, height: 80, borderRadius: 16 }}
          />

          <View
            style={{
              marginLeft: 8
            }}
          >
            <Text>Good {Greet()}</Text>
            <Text style={{ color: "#333", fontWeight: "bold" }}>
              {user.name}
            </Text>
          </View>
        </View>
        <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
          <DrawerItems {...props} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const AdminDrawNavigator = createDrawerNavigator(
  {
    AdminDashboard: {
      screen: AdminDashboard,
      navigationOptions: {
        drawerLabel: "Dashboard"
      }
    },
    AdminScan: {
      screen: Dashboard,
      navigationOptions: {
        drawerLabel: "Scan"
      }
    },
    Category,
    SubCategory: {
      screen: SubCategory,
      navigationOptions: {
        drawerLabel: "Sub Category"
      }
    },
    History,
    Subscribers,
    Password: {
      screen: Password,
      navigationOptions: {
        drawerLabel: "Change Password"
      }
    },
    AdminLogout: {
      screen: AdminLogout,
      navigationOptions: {
        drawerLabel: "Logout"
      }
    }
  },
  {
    contentComponent: props => <CustomDrawerComponent {...props} />,
    contentOptions: {
      activeTintColor: "#FFF",
      activeBackgroundColor: "#F250A9",
      itemStyle: {
        marginHorizontal: 8,
        borderRadius: 4
      }
    }
  }
);

const AppAuthStackNavigator = createStackNavigator(
  {
    LoginScreen: {
      screen: Login
    },
    AdminLogin: {
      screen: AdminLogin
    }
  },
  {
    defaultNavigationOptions: {
      headerShown: false
    }
  }
);

const AppSwtichNavigation = createSwitchNavigator({
  Loading,
  Login: {
    screen: AppAuthStackNavigator
  },
  Home: {
    screen: AppStackNavigator
  },
  Admin: {
    screen: AdminDrawNavigator
  },
  Success
});

export default createAppContainer(AppSwtichNavigation);
