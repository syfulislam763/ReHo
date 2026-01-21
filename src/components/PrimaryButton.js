import React from 'react';
import { StyleSheet, View, Pressable, Text } from 'react-native';

const PrimaryButton = ({onPress=()=>{}, text="Button", disabled=false, bgColor="bg-button-bg"}) => {
    return (
        <Pressable disabled={disabled} onPress={onPress}>
            <View className={`${bgColor} items-center py-4 rounded-md`}>
                <Text className="text-white font-archivo-semi-bold text-[15px]">{text}</Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({})

export default PrimaryButton;
