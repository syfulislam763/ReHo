import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
const PrimaryInputFieldWithVisibility = ({
    value="",
    onChange=()=>{},
    visible=false,
    setIsVisible=()=>{},
    label="Password",
    type="default",
    placeholder=""
}) => {
    return (
       <>
       
        <Text className="text-sm ml-1 font-medium text-black mt-4 font-archivo-semi-bold">{label}</Text>
        <View className="relative mt-2">
            <TextInput
                className="rounded-2xl px-4 py-5 bg-[#E6E6E680] font-inter-regular text[12px] pr-12 text-black"
                placeholder={placeholder}
                secureTextEntry={!visible}
                placeholderTextColor="#7D848D"
                value={value}
                onChangeText={e=>onChange(e)}
                keyboardType={type}
            />
            <TouchableOpacity
                className="absolute right-4 top-5"
                onPress={() => setIsVisible(!visible)}
            >
                <Ionicons
                name={visible ? "eye" : "eye-off"}
                size={20}
                color="gray"
                />
            </TouchableOpacity>
        </View>
       
       </>
    );
}

const styles = StyleSheet.create({})

export default PrimaryInputFieldWithVisibility;
