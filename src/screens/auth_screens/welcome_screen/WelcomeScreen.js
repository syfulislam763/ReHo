import React from 'react';
import { StyleSheet, View, Text, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import PrimaryButton from '../../../components/PrimaryButton';

const welcome_iamge = require("../../../../assets/img/welcome.png")

const WelcomeScreen = () => {
    const navigation = useNavigation();
    return (
        <SafeAreaView className="p-5 flex-col justify-between" style={{flex:1, backgroundColor:'white'}}>
            <View>
                <Image 
                    source={welcome_iamge}
                    style={styles.img}
                />
                <View className="flex-col items-center">
                    <Text className="font-archivo-semi-bold text-[30px] text-title-color" >Welcome!</Text>
                    <Text className="font-inter-regular text-primary-color text-center mt-5 leading-7">Financial Awareness to Financial Security to Financial Freedom .Your journey begins here</Text>
                </View>
            </View>
            

            <PrimaryButton
                onPress={()=> navigation.navigate("SignInScreen")}
                text='Get Started'
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    img:{
        width:"100%",
        height: "60%",
        objectFit:'contain'
    },
})

export default WelcomeScreen;
