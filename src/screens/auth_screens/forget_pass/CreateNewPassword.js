import React, { useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import BackButtion from '../../../components/BackButtion';
import AppHeader from '../../../components/AppHeader';
import PrimaryButton from '../../../components/PrimaryButton';
import { useNavigation } from '@react-navigation/native';
import PrimaryInputFieldWithVisibility from '../../../components/PrimaryInputFieldWithVisibility';
import Indicator from '../../../components/Indicator';
import { reset_password } from '../AuthAPI';
import ToastMessage from '../../../constants/ToastMessage';
import { useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CreateNewPassword = () => {

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState("");
    const [showConfrimPassword, setShowConfirmPassword] = useState("");
    const [loader, setLoader] = useState(false);
    const route = useRoute()
    const navigation = useNavigation()


    const handleChangePassword = () => {
        if(password == confirmPassword){
            setLoader(true);
            const payload = {
                newPassword: password,
                confirmPassword
            }

            const token = route.params.verifyToken;

            reset_password(payload, token, (data) => {
                if(data){
                
                    navigation.navigate("ConfirmPasswordChange")
                }else{
                    // ToastMessage("error", "Something went wrong try again!", 3000)
                }
                setLoader(false);
            })


        }else{
            ToastMessage("error", "Password is not same!", 3000)
        }
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="">
                <AppHeader
                    left={()=> <BackButtion/>}
                />


                <View className="items-center my-5">
                    <Text className="font-archivo-semi-bold text-lg mb-3">Forgot Password</Text>
                    <Text className="font-inter-regular text-sm text-[#7D848D]">The password must be different than previous</Text>
                </View>


                <PrimaryInputFieldWithVisibility
                    value={password}
                    onChange={setPassword}
                    type='default'
                    label='Password'
                    visible={showPassword}
                    setIsVisible={setShowPassword}
                    placeholder='Enter your new password'
                />

                <PrimaryInputFieldWithVisibility
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    type='default'
                    label='Confirm password'
                    visible={showConfrimPassword}
                    setIsVisible={setShowConfirmPassword}
                    placeholder='Re-enter password'
                />

                <View className="h-7"/>

                <PrimaryButton 
                    onPress={()=>{handleChangePassword()}}
                    text='Update Password'
                />





            </View>
            {loader && <Indicator onClose={() => setLoader(false)} visible={loader}>
                    <ActivityIndicator size={"large"}/>
                </Indicator>}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({})

export default CreateNewPassword;
