import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator, Platform } from 'react-native';
import { StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../../../components/AppHeader';
import BackButtion from '../../../components/BackButtion';
import PrimaryButton from '../../../components/PrimaryButton';
import { verify_email, resend_otp } from '../AuthAPI';
import { useRoute } from '@react-navigation/native';
import ToastMessage from '../../../constants/ToastMessage';
import Indicator from '@/components/Indicator';
import { ScrollView } from 'react-native-gesture-handler';

const roket = require("../../../../assets/img/roket.png")

const OTP_LIFETIME = 15 * 60; // 900 seconds

const SignUpOTPVerification = () => {
    const [otp, setOtp] = useState(['', '', '', '']);
    const [timer, setTimer] = useState(126);
    const inputRefs = useRef([]);
    const navigation = useNavigation();
    const [loader, setLoader] = useState(false);
    const route = useRoute();

    // ── Progress bar ──────────────────────────────────────
    const [timeLeft, setTimeLeft] = useState(OTP_LIFETIME);
    const [trackWidth, setTrackWidth] = useState(100);
    const timeLeftRef = useRef(OTP_LIFETIME);
    const intervalRef = useRef(null);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            if (timeLeftRef.current <= 0) {
                clearInterval(intervalRef.current);
                return;
            }
            timeLeftRef.current -= 1;
            setTimeLeft(timeLeftRef.current);
        }, 1000);

        return () => clearInterval(intervalRef.current);
    }, []);

    const fillWidth = trackWidth > 0 ? (timeLeft / OTP_LIFETIME) * trackWidth : 0;
    // ─────────────────────────────────────────────────────

    const handleOtpChange = (value, index) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const submitOTP = () => {
        const payload = {
            email: route.params?.email,
            oneTimeCode: +otp.join("")
        };
        setLoader(true);
        verify_email(payload, (data) => {
            if (data) {
                if (route.params?.flag) {
                    navigation.navigate("CreateNewPassword", { verifyToken: data.data.verifyToken });
                } else {
                    navigation.navigate("SignInScreen");
                }
            } else {
                ToastMessage("error", "Email varification failed, try again!", 3000);
            }
            setLoader(false);
        });
    };

    const resend = () => {
        setLoader(true);
        const payload = { email: route.params?.email };
        resend_otp(payload, (data) => {
            if (data) {
                ToastMessage("success", "OTP has been sent!", 3000);
                // Reset timer on resend
                clearInterval(intervalRef.current);
                timeLeftRef.current = OTP_LIFETIME;
                setTimeLeft(OTP_LIFETIME);
                intervalRef.current = setInterval(() => {
                    if (timeLeftRef.current <= 0) {
                        clearInterval(intervalRef.current);
                        return;
                    }
                    timeLeftRef.current -= 1;
                    setTimeLeft(timeLeftRef.current);
                }, 1000);
            } else {
                ToastMessage("error", "Try again to send OTP!", 3000);
            }
            setLoader(false);
        });
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="px-5 flex-1">
                <AppHeader
                    left={() => <BackButtion />}
                />

                {/* ── Progress Bar ── */}
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{
                          paddingBottom: Platform.OS === 'android' ? 350 : 350
                        }} className='flex-1'>
                    <View
                        style={styles.track}
                        onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
                    >
                        <View style={[styles.fill, { width: fillWidth }]} />
                    </View>
                    <View className=''>
                        <Text className='text-base text-right'>{formatTime(timeLeft)}</Text>
                    </View>
            

                    {/* Rocket Icon */}
                    <View className="items-center my-6">
                        <Image
                            source={roket}
                            className="h-20 w-20"
                            style={{ objectFit: 'contain' }}
                        />
                    </View>

                    <View className="px-7">
                        <Text className="text-3xl font-archivo-semi-bold text-gray-900 text-center mb-4">
                            Verify your email
                        </Text>
                        <Text className="text-gray-500 font-inter-regular text-center mb-12 px-4 leading-6">
                            Please enter the verification code{' '}
                            <Text className="font-inter-semi-bold text-gray-700">we sent to your email</Text>
                            {' '}to complete the verification process.
                            <Text className="font-inter-semi-bold text-gray-700"> If you don't see the email, please check your spam folder.</Text>
                        </Text>
                    </View>

                    <Text className="text-2xl font-inter-regular text-gray-900 mb-4">
                        OTP Code
                    </Text>

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

                    <PrimaryButton
                        onPress={() => {
                            if (!loader) submitOTP();
                        }}
                        text='Verify'
                        bgColor={otp.length >= 4 ? "bg-button-bg" : 'bg-[#EBEBEA]'}
                    />

                    <View className="flex-row justify-between items-center mt-2">
                        <TouchableOpacity onPress={resend}>
                            <Text className="text-gray-500 text-base underline font-inter-regular">
                                Resend code
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>

            {loader && (
                <Indicator visible={loader} onClose={() => setLoader()}>
                    <ActivityIndicator size={"large"} />
                </Indicator>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    track: {
        height: 6,
        backgroundColor: '#E5E7EB',
        borderRadius: 999,
        marginTop: 8,
        marginBottom: 4,
        overflow: 'hidden',
    },
    fill: {
        height: 6,
        backgroundColor: '#1976d2', // ← replace with your hex
        borderRadius: 999,
    },
});

export default SignUpOTPVerification;