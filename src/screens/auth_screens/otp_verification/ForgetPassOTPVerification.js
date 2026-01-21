
import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../../../components/AppHeader';
import BackButtion from '../../../components/BackButtion';
import PrimaryButton from '../../../components/PrimaryButton';

const roket = require("../../../../assets/img/roket.png")

const ForgetPassOTPVerification = () => {
    const [otp, setOtp] = useState(['', '', '', '']);
    const [timer, setTimer] = useState(126); // 01:26 = 86 seconds
    const inputRefs = useRef([]);
    const navigation = useNavigation()

    const handleOtpChange = (value, index) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto focus next input
        if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e, index) => {
        // Handle backspace
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };


    return (
        <SafeAreaView  className="flex-1 bg-white ">
            <View className="px-5">
                <AppHeader 
                    left={() => {
                        return <BackButtion/>
                    }}
                />
                {/* Rocket Icon */}
                <View className="items-center my-6">
                    {/* <Image
                        source={roket}
                        className="h-20 w-20"
                        style={{objectFit:'contain'}}
                    /> */}
                </View>

                <View className="px-7">
                    {/* Title */}
                    <Text className="text-3xl font-archivo-semi-bold text-gray-900 text-center mb-4">
                        OTP Verification
                    </Text>

                    {/* Subtitle */}
                    <Text className="text-gray-500 font-inter-regular text-center mb-12 px-4 leading-6">
                        Please check your email {' '}
                        <Text className="font-inter-semi-bold text-gray-700">arraiahn815@gmail.com</Text>
                        {' '}to find code.
                    </Text>
                </View>

                {/* OTP Label */}
                <Text className="text-2xl font-inter-regular text-gray-900 mb-4">
                    OTP Code
                </Text>

                {/* OTP Input Fields */}
                <View className="flex-row justify-between mb-10">
                    {otp.map((digit, index) => (
                    <TextInput
                        key={index}
                        ref={(ref) => (inputRefs.current[index] = ref)}
                        className="w-1/5 h-16 rounded-lg text-center text-xl font-semibold bg-[#F7F7F9]"
                        value={digit}
                        onChangeText={(value) => handleOtpChange(value, index)}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                        keyboardType="numeric"
                        maxLength={1}
                        selectTextOnFocus
                    />
                    ))}
                </View>

                {/* Verify Button */}
                <PrimaryButton
                    onPress={()=>{navigation.navigate("CreateNewPassword")}}
                    text='Verify'
                    bgColor='bg-[#EBEBEA]'
                />
                

                {/* Resend Code */}
                <View className="flex-row justify-between items-center mt-2">
                    <TouchableOpacity>
                    <Text className="text-gray-500 text-base underline font-inter-regular">
                        Resend code to
                    </Text>
                    </TouchableOpacity>
                    <Text className="text-gray-500 text-base font-inter-regular">
                    {formatTime(timer)}
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({})

export default ForgetPassOTPVerification;
