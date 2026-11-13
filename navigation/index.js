import React from "react";
import { Text, View, Image, StyleSheet, Platform,ScrollView } from "react-native";

import { NavigationContainer,createSwitchNavigator } from '@react-navigation/native';

import { SafeAreaView } from "react-native-safe-area-context";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
  createDrawerNavigator,
} from "@react-navigation/drawer"
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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
  import { Button, Icon } from "react-native-elements";
  
import { Styles, WebLoading, MainHeader } from "../components";
  
import { TouchableOpacity, Alert } from "react-native";
  

  import { useDispatch, useSelector } from "react-redux";
  import { getUser } from "../redux/selector";
  import { Greet } from "../components/WebLoading";
import { LOGOUT_USER } from "../redux/constant";


const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();


  const CustomDrawer = (props) => {
    const { user } = useSelector(getUser);
if(user){
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
                <DrawerItemList {...props} />
            </ScrollView>
          </SafeAreaView>
        </View>
      );
}
   
  };

const AdminDrawNavigator =() =>{
 return(
    <Drawer.Navigator 
    screenOptions={{
      headerShown: false,
      drawerPosition: "left",
      drawerType: "front",
      drawerStyle: {
        width: "75%",
      },
    }}
      
    drawerContent={CustomDrawer}
    >
         <Drawer.Screen
        name="Admin-dashoard"
        component={AdminDashboard}
        options={{
          title: "Dashboard",
        }}
      />
        <Drawer.Screen
        name="Scan"
        component={Dashboard}
        options={{
          title: "Scan",
          headerShown:true,
          header:({ navigation })=>(<MainHeader {...{ navigation }} />)
        }}
      />
      <Drawer.Screen
      name="Discount"
      component={Discount}
      options={
        { 
        drawerLabel: ()=>null,
        drawerItemStyle: { display: "none" },
        headerShown:true,
        header:({ navigation })=>(<MainHeader {...{ navigation }} />)
      }
    }
    />
    <Drawer.Screen
    name="Success"
    component={Success}
    options={
      { 
      drawerLabel: ()=>null,
      drawerItemStyle: { display: "none" },
      headerShown:true,
      header:({ navigation })=>(<MainHeader {...{ navigation }} />)
    }
  }
  />
        <Drawer.Screen
        name="Category"
        component={Category}
        options={{
          title: "Category",
        }}
      />
       <Drawer.Screen
        name="Subcategory"
        component={SubCategory}
        options={{
          title: "Sub Category",
        }}
      />
      <Drawer.Screen
       name="History"
       component={History}
       options={{
         title: "History",
       }}
     />
     <Drawer.Screen
      name="Subscribers"
      component={Subscribers}
      options={{
        title: "Subscribers",
      }}
    />
    <Drawer.Screen
     name="Password"
     component={Password}
     options={{
       title: "Change Password",
     }}
   />
   <Drawer.Screen
    name="Logout"
    component={AdminLogout}
    options={{
      title: "Logout",
    }}
  />
    </Drawer.Navigator>
 )
}
const AppAuthStackNavigator = () => {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="AdminLogin" component={AdminLogin} />
      <Stack.Screen name="Loading" component={Loading} />
      </Stack.Navigator>
    );
  };
  const AppStackNavigator = () => {
    const dispatch = useDispatch();
    return (
      <Stack.Navigator screenOptions={({ navigation }) => ({
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
                  onPress: () => dispatch({ type: LOGOUT_USER })
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
          backgroundColor: "#343A40",
          marginTop:25
        }
      })}>
        <Stack.Screen name="Scan" component={Dashboard} />
        <Stack.Screen name="Discount" component={Discount} />
        <Stack.Screen name="Logout" component={Logout} />
      <Stack.Screen name="Success" component={Success} />
      </Stack.Navigator>
    );
  };

export default function App() {
  const { user, admin } = useSelector(getUser);
  const navKey = admin ? "admin" : user ? "merchant" : "auth";
  console.log("App Navigation Rendered", { navKey, user, admin });

  return (
    <NavigationContainer key={navKey}>
      {admin ? (
        <AdminDrawNavigator />
      ) : user ? (
        <AppStackNavigator />
      ) : (
        <AppAuthStackNavigator />
      )}
    </NavigationContainer>
  );
}