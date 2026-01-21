import React, { useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import BackButtion from '../../../components/BackButtion';
import AppHeader from '../../../components/AppHeader';
import PrimaryInputField from '../../../components/PrimaryInputField';
import PrimaryButton from '../../../components/PrimaryButton';
import { useNavigation } from '@react-navigation/native';
import Indicator from '../../../components/Indicator';
import { forget_password } from '../AuthAPI';
import ToastMessage from '../../../constants/ToastMessage';
import { SafeAreaView } from 'react-native-safe-area-context';

const ForgetPassword = () => {

    const [email, setEmail] = useState("")
    const navigation = useNavigation()
    const [loader, setLoader] = useState(false);


    const handleForgetPassword = () => {
        setLoader(true);

        forget_password({email:email}, (data) => {
            if(data){
                navigation.navigate("SignUpOTPVerification", {email, flag:true})
            }else{
                ToastMessage("error", "Try again!", 3000)
            }
            setLoader(false);
        })


    }


    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="px-5">
                <AppHeader
                    left={()=> <BackButtion/>}
                />


                <View className="items-center my-5">
                    <Text className="font-archivo-semi-bold text-lg mb-3">Forgot Password</Text>
                    <Text className="font-inter-regular text-sm text-[#7D848D]">Enter your email account to reset your password</Text>
                </View>


                <PrimaryInputField
                    value={email}
                    onChange={setEmail}
                    type='default'
                    label='Email'
                    placeholder='Enter your new email'
                />

                <View className="h-7"/>

                <PrimaryButton 
                    onPress={()=> handleForgetPassword()}
                    text='Forgot Password'
                />





            </View>

            {loader && <Indicator visible={loader} onClose={() => setLoader(false)}>
                
                    <ActivityIndicator size={"large"}/>
                </Indicator>}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({})

export default ForgetPassword;
