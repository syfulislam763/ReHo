import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "../../screens/main_tab_screens/profile_screen/ProfileScreen";
import ContactFormScreen from "../../screens/main_tab_screens/profile_screen/ContactFormScreen";
import TimeSelector from "../../screens/main_tab_screens/profile_screen/TimeSelector";
import SendExpences from "../../screens/main_tab_screens/profile_screen/SendExpences";
import VideoTutorialsScreen from "../../screens/main_tab_screens/profile_screen/VideoTutorialsScreen";
import FinancialRemindersSettings from "../../screens/main_tab_screens/profile_screen/FInancialRemindersSettiings";
import NotificationsFeedScreen from "../../screens/main_tab_screens/profile_screen/NotificationsFeedScreen";
import PremiumFinancialAdvice from "../../screens/main_tab_screens/profile_screen/PremiumFinancialAdvice";
import PaymentMethodsSelector from "../../screens/main_tab_screens/profile_screen/PaymentMethodsSelector";
import CongratulationsScreen from "../../screens/main_tab_screens/profile_screen/CongratulationsScreen";
import TermsAndPolicy from "../../screens/main_tab_screens/profile_screen/TermsAndPolicy";
import ChatUIScreen from "../../screens/main_tab_screens/profile_screen/ChatUIScreen";
import ChangePassword from "../../screens/main_tab_screens/profile_screen/ChangePassword";
import PartnerForm from "../../screens/auth_screens/otp_verification/PartnerForm";
import PartnerRequestScreen from "../../screens/auth_screens/otp_verification/PartnerRequestScreen";


const Stack = createNativeStackNavigator();

export default function ProfileStack(){
    return (
        <Stack.Navigator screenOptions={{headerShown:false}}>
            <Stack.Screen
                name="ProfileScreen"
                component={ProfileScreen}
            />
            <Stack.Screen 
                name="ContactFormScreen"
                component={ContactFormScreen}
            />
            <Stack.Screen 
                name="TimeSelector"
                component={TimeSelector}
            />
            <Stack.Screen name="SendExpences" component={SendExpences} />

            <Stack.Screen name="VideoTutorialsScreen" component={VideoTutorialsScreen} />

            <Stack.Screen name="FinancialRemindersSettings" component={FinancialRemindersSettings}  />

            <Stack.Screen name="NotificationsFeedScreen" component={NotificationsFeedScreen}  />

            <Stack.Screen name="PremiumFinancialAdvice" component={PremiumFinancialAdvice} />

            <Stack.Screen name="PaymentMethodsSelector" component={PaymentMethodsSelector}  />

            <Stack.Screen name="CongratulationsScreen" component={CongratulationsScreen} />
            <Stack.Screen name="TermsAndPolicy" component={TermsAndPolicy} />
            <Stack.Screen name="ChatUIScreen" component={ChatUIScreen} />

            <Stack.Screen name="ChangePassword" component={ChangePassword} />


            <Stack.Screen name="PartnerForm" component={PartnerForm}/>
            <Stack.Screen name="PartnerRequestScreen" component={PartnerRequestScreen}/>


        </Stack.Navigator>
    )
}