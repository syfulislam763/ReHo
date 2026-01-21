import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BudgetScreen from "../../screens/main_tab_screens/budget_screen/BudgetScreen";
import MonthlyBudgetComponent from "../../screens/main_tab_screens/budget_screen/MonthlyBudgetComponent";   
import BudgetFormComponent from "../../screens/main_tab_screens/budget_screen/BudgetFormComponent";
import BudgetAnalytics from "../../screens/main_tab_screens/budget_screen/BudgetAnalytics";
import PremiumFinancialAdvice from "../../screens/main_tab_screens/profile_screen/PremiumFinancialAdvice";
import PartnerForm from "../../screens/auth_screens/otp_verification/PartnerForm";
import PartnerRequestScreen from "../../screens/auth_screens/otp_verification/PartnerRequestScreen";


const Stack = createNativeStackNavigator();


export default function BudgetStack() {

    return (
        <Stack.Navigator screenOptions={{headerShown:false}}>
            <Stack.Screen 
                name="BudgetScreen"
                component={BudgetScreen}
            />
            <Stack.Screen 
                name="MonthlyBudgetComponent"
                component={MonthlyBudgetComponent}
            />
            <Stack.Screen 
                name="BudgetFormComponent"
                component={BudgetFormComponent}
            />
            <Stack.Screen 
                name="BudgetAnalytics"
                component={BudgetAnalytics}
            />
            <Stack.Screen 
                name="PremiumFinancialAdvice"
                component={PremiumFinancialAdvice}
            />
            <Stack.Screen
                name="PartnerForm"
                component={PartnerForm}
            />

            <Stack.Screen 
                name="PartnerRequestScreen"
                component={PartnerRequestScreen}
            />
        </Stack.Navigator>
    )


}