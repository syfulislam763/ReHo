import React, { useState } from 'react';
import { StyleSheet, View, Text} from 'react-native';
import BackButtion from '../../../components/BackButtion';
import AppHeader from '../../../components/AppHeader';
import PrimaryButton from '../../../components/PrimaryButton';
import { useNavigation, CommonActions } from '@react-navigation/native';
import PrimaryInputFieldWithVisibility from '../../../components/PrimaryInputFieldWithVisibility';
import { SafeAreaView } from 'react-native-safe-area-context';

const ConfirmPasswordChange = () => {

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState("");
    const [showConfrimPassword, setShowConfirmPassword] = useState("")

    const navigation = useNavigation()


    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="">
                <AppHeader
                    left={()=> <BackButtion/>}
                />


                
                <View className="h-screen flex-col justify-center">
                    <View className="w-full h-1/2">
                        <View className="items-center my-5">
                            <Text className="font-archivo-semi-bold text-lg mb-3">Forgot Password</Text>
                            <Text className="font-inter-regular text-sm text-[#7D848D]">Your password has been successfully reset.</Text>
                        </View>

                

                        <View className="h-7"/>

                        <PrimaryButton 
                            onPress={()=>{
                                navigation.dispatch(state => {
                                    const routes = state.routes.slice(0, -4);

                                    routes.push({
                                        name:"SignInScreen",
                                    });

                                    return CommonActions.reset({
                                        ...state,
                                        index: routes.length-1,
                                        routes
                                    })
                                })

                            }}
                            text='Confirm'
                        />
                    </View>
                </View>





            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({})

export default ConfirmPasswordChange;
