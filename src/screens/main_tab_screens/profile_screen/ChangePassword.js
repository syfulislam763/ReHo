import React, { useState } from 'react';
import { StyleSheet, View, Text,ActivityIndicator } from 'react-native';
import BackButtion from '../../../components/BackButtion';
import AppHeader from '../../../components/AppHeader';
import PrimaryButton from '../../../components/PrimaryButton';
import { useNavigation } from '@react-navigation/native';
import PrimaryInputFieldWithVisibility from '../../../components/PrimaryInputFieldWithVisibility';
import Indicator from '../../../components/Indicator';
import { change_password } from '../ScreensAPI';

import ToastMessage from '../../../constants/ToastMessage';
import { useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ChangePassword = () => {

    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState("")
    const [showConfrimPassword, setShowConfirmPassword] = useState("");


    const [visible, setVisible] = useState(false);
    const route = useRoute()
    const navigation = useNavigation()


    const handleChangePassword = () => {
        const payload = {
            currentPassword: password,
            newPassword: newPassword,
            confirmPassword: confirmPassword
        }


        if(newPassword == confirmPassword){
            setVisible(true);

            change_password(payload, res => {
                if(res){
                    ToastMessage("success", "Password changed successfully!", 2000, () => {
                        navigation.goBack()
                    })
                }else{
                    ToastMessage("error", "Try again!", 2000)
                }

                setVisible(false);
            })


        }else{
            ToastMessage("error", "Password is not same!", 2000)
        }


    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="px-5">
                <AppHeader
                    left={()=> <BackButtion/>}
                />


                <View className="items-center my-5">
                    <Text className="font-archivo-semi-bold text-lg mb-3">Change Password</Text>
                    <Text className="font-inter-regular text-sm text-[#7D848D]">The password must be different than previous</Text>
                </View>


                <PrimaryInputFieldWithVisibility
                    value={password}
                    onChange={setPassword}
                    type='default'
                    label='Old Password'
                    visible={showPassword}
                    setIsVisible={setShowPassword}
                    placeholder='Enter your old password'
                />
                <PrimaryInputFieldWithVisibility
                    value={newPassword}
                    onChange={setNewPassword}
                    type='default'
                    label='New Password'
                    visible={showNewPassword}
                    setIsVisible={setShowNewPassword}
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
          

                {visible && <Indicator>
                    
                        <ActivityIndicator size={"large"}/>
                    </Indicator>}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({})

export default ChangePassword;
