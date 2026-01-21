import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import BudgetStack from "./tabs/BudgetStack";
import CalculatorStack from "./tabs/CalculatorStack";
import FinadateStack from "./tabs/FinadateStack";
import ProfileStack from "./tabs/ProfileStack";
import HomeStack from "./tabs/HomeStack";
import { Ionicons } from "@expo/vector-icons";
import {Home, User, Calendar, Calculator, Wallet} from 'lucide-react-native'
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const Tab = createBottomTabNavigator();


export default function MainTabs() {
    const insets = useSafeAreaInsets();
   return (
    <Tab.Navigator
        screenOptions={({ route }) => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? '';
            const hiddenRoutes = ['ChatUIScreen']
            const shouldHideTabBar = hiddenRoutes.includes(routeName);

            return {
                headerShown: false,
                tabBarShowLabel: true,
                tabBarHideOnKeyboard:true,
                tabBarActiveTintColor: "#4F55BA",
                tabBarInactiveTintColor: "gray",
                tabBarStyle: shouldHideTabBar?{display:'none'}: {
                    paddingTop:10,
                    height:60+insets.bottom,
                    paddingBottom: insets.bottom
                },
                tabBarIcon: ({ color, size }) => {
                let iconName;

                if (route.name === "HomeStack") iconName = "home";
                else if (route.name === "ProfileStack") iconName = "person-circle-outline";
                else if (route.name === "FindateStack") iconName = "calendar";
                else if (route.name === "CalculatorStack") iconName = "calculator";
                else if (route.name === "BudgetStack") iconName = "wallet";

                return <Ionicons name={iconName} size={size} color={color} />;
                },
            }
        }}
    >
        <Tab.Screen name="HomeStack" component={HomeStack} options={{ title: "Home" }} />
        <Tab.Screen name="BudgetStack" component={BudgetStack} options={{ title: "Budget" }} />
        <Tab.Screen name="CalculatorStack" component={CalculatorStack} options={{ title: "Calculator" }} />
        <Tab.Screen name="FindateStack" component={FinadateStack} options={{ title: "Date Night" }} />
        
        <Tab.Screen name="ProfileStack" component={ProfileStack} options={{ title: "Profile" }} />
        
    </Tab.Navigator>
  );
}