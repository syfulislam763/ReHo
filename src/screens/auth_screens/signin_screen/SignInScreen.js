import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, ActivityIndicator, Alert} from "react-native";
//import { CheckBox } from "react-native-elements";
import Checkbox from "expo-checkbox";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from 'react-native';
import { useAuth } from '../../../context/AuthProvider';
import { useNavigation } from '@react-navigation/native';
import PrimaryButton from "../../../components/PrimaryButton";
import Indicator from "../../../components/Indicator";
import { login_user, resend_otp } from "../AuthAPI";
import Toast from "react-native-toast-message";
import ToastMessage from "../../../constants/ToastMessage";
import { SafeAreaView } from "react-native-safe-area-context";



const google = require("../../../../assets/img/google.png");
const apple = require("../../../../assets/img/apple.png")


const SignInScreen = () => {
    const navigation = useNavigation()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const {setIsAuthenticated, SignInUser} = useAuth();

    const [loader, setLoader] = useState(false);


    const handleLogin = () => {
        const payload = {
            email: email,
            password: password
        }
        if(!email){
            ToastMessage("error", "Email is required!");
            return;
        }
        if(password.length < 8){
            ToastMessage("error", "Password should be minimum 8 character");
            return;
        }
     
        setLoader(true)
        //setIsAuthenticated(true)
        login_user(payload, (data) => {
          
            if(data?.statusCode==409){
              
                resend_otp({email: payload.email}, (data) => {
                    if(data){
                        navigation.navigate("SignUpOTPVerification", {...payload})
                    }else{

                    }
                })
                
            }
            else if(data){
                SignInUser(data?.data);
              
            }
            else{
               
            }
            setLoader(false);
        })

    }

    

    return (
    <SafeAreaView className="flex-1 bg-white px-5 pt-10">
        <ScrollView className="">
            {/* Title */}
            <View className="flex-col items-center">
                <Text className="text-2xl font-archivo-semi-bold text-[#090909]">Log In</Text>
                <Text className="text-sm text-gray-400 mt-2 text-center font-inter-regular">
                Please sign in to continue
                </Text>
            </View>

            {/* Email / Phone Input */}
            <Text className="text-sm ml-1 font-archivo-semi-bold text-black mt-6">Email</Text>
            <TextInput
                className="rounded-2xl px-4 py-5 mt-2 bg-[#E6E6E680] font-inter-regular text[12px]"
                placeholder="Enter your email"
                placeholderTextColor="#7D848D"
                value={email}
                onChangeText={setEmail}
            />

            {/* Password Input */}
            <Text className="text-sm ml-1 font-medium text-black mt-4 font-archivo-semi-bold">Password</Text>
            <View className="relative mt-2">
            <TextInput
                className="rounded-2xl px-4 py-5 bg-[#E6E6E680] font-inter-regular text-black text[12px] pr-12"
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
                placeholderTextColor="#7D848D"
                value={password}
                onChangeText={setPassword}
            />
            <TouchableOpacity
                className="absolute right-0 top-1 p-4"
                onPress={() => setShowPassword(!showPassword)}
            >
                <Ionicons
                    name={showPassword ? "eye" : "eye-off"}
                    size={20}
                    color="gray"
                />
            </TouchableOpacity>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity onPress={()=> navigation.navigate("ForgetPassword")} className="mt-4 mb-2 self-end">
                <Text className="text-[14px] font-inter-semi-bold text-[#4F55BA]">Forgot Password?</Text>
            </TouchableOpacity>

            {/* Checkbox */}
            <View className="flex-row items-center my-6">
                <Checkbox
                    color={agreeTerms?"#4F55BA":undefined}
                    value={agreeTerms}
                    onValueChange={() => setAgreeTerms(!agreeTerms)}
                />
                <TouchableOpacity onPress={() => navigation.navigate("TermsAndPolicy")} className="flex-row items-center">
                    <Text className="text-sm text-gray-500 ml-2">I agree with{" "}</Text>

                        <Text className="text-[12px] font-inter-regular text-[#4F55BA]">Terms <Text className="text-title-color">&</Text> Conditions</Text>
                </TouchableOpacity>
            </View>

            {/* Log In Button */}
            <PrimaryButton 
                onPress={()=>{handleLogin()}}
                text="Log In"
                disabled={!agreeTerms}
                bgColor= {!agreeTerms ? "bg-button-bg/60":"bg-button-bg"}
            />

            {/* Or Separator */}
            <View className="flex-row items-center my-6">
            <View className="flex-1 h-[1px] bg-[#090909]" />
            <Text className="mx-4 text-[#090909]">Or</Text>
            <View className="flex-1 h-[1px] bg-[#090909]" />
            </View>

            {/* Social Login Buttons */}
            {/* <TouchableOpacity className="flex-row items-center border border-gray-300 rounded-[25px] py-4 justify-center mb-4">
                <Image 
                    source={apple}
                    className="h-[21px] w-[21px] mr-2"
                    style={{objectFit:"contain"}}
                />
                <Text className="text-black text-base font-medium">Login with Apple</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center border border-gray-300 rounded-[25px] py-4 justify-center">
                <Image 
                    source={google}
                    className="h-[21px] w-[21px] mr-2"
                    style={{objectFit:"contain"}}
                />
                <Text className="text-black text-base font-medium">Login with Google</Text>
            </TouchableOpacity> */}

            {/* Sign Up */}
            <View className="flex-row justify-center mt-6">
            <Text className="text-[#707B81] font-inter-regular">Don't have an account? </Text>
            <TouchableOpacity onPress={()=>{
                navigation.navigate("SignUpScreen")
            }}>
                <Text className="text-[#013D3B] font-inter-regular">Sign Up</Text>
            </TouchableOpacity>
            </View>
        </ScrollView>

        {loader && <Indicator 
            visible={loader}
            onClose={()=>setLoader()}>
                <ActivityIndicator size={"large"}/>
            </Indicator>
        }
    </SafeAreaView>
    );
}

const styles = StyleSheet.create({})

export default SignInScreen;
