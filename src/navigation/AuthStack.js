import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "../screens/auth_screens/welcome_screen/WelcomeScreen";
import SignInScreen from "../screens/auth_screens/signin_screen/SignInScreen";
import SignUpScreen from "../screens/auth_screens/sign_up_screen/SignUpScreen";
import SingUpOTPVerification from "../screens/auth_screens/otp_verification/SignUpOTPVerification";
import ForgetPassword from "../screens/auth_screens/forget_pass/ForgetPassword";
import ForgetPassOTPVerification from "../screens/auth_screens/otp_verification/ForgetPassOTPVerification";
import PartnerForm from "../screens/auth_screens/otp_verification/PartnerForm";
import CreateNewPassword from "../screens/auth_screens/forget_pass/CreateNewPassword";
import ConfirmPasswordChange from "../screens/auth_screens/forget_pass/ConfirmPasswordChange";
import TermsAndPolicy from "../screens/main_tab_screens/profile_screen/TermsAndPolicy";

const Stack = createNativeStackNavigator();

export default function AuthStack () {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown:false
            }}
        >
            <Stack.Screen
                name="WelcomeScreen"
                component={WelcomeScreen}
            />
            <Stack.Screen 
                name="SignInScreen"
                component={SignInScreen}
            />
            <Stack.Screen 
                name="SignUpScreen"
                component={SignUpScreen}
            />
            <Stack.Screen 
                name="SignUpOTPVerification"
                component={SingUpOTPVerification}
            />
            <Stack.Screen 
                name="ForgetPassOTPVerification"
                component={ForgetPassOTPVerification}
            />
            <Stack.Screen 
                name="ForgetPassword"
                component={ForgetPassword}
            />
            <Stack.Screen 
                name="CreateNewPassword"
                component={CreateNewPassword}
            />

            <Stack.Screen
                name="PartnerForm"
                component={PartnerForm}
            />

            <Stack.Screen 
                name="ConfirmPasswordChange"
                component={ConfirmPasswordChange}
            />

            <Stack.Screen 
                name="TermsAndPolicy"
                component={TermsAndPolicy}   
            />

        </Stack.Navigator>
    )
}
