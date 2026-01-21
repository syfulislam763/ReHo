import React from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';

const PrimaryInputField = ({value="",onChange=()=>{}, label="Name", type="default", placeholder=""}) => {
    return (
        <>

            <Text className="text-sm ml-1 font-archivo-semi-bold text-black mt-6">{label}</Text>
            <TextInput
                className="rounded-2xl px-4 py-5 mt-2 bg-[#E6E6E680] font-inter-regular text[12px] text-black"
                placeholder={placeholder}
                placeholderTextColor="#7D848D"
                value={value}
                onChangeText={e=>onChange(e)}
                keyboardType={type}
            />
        
        </>
    );
}

const styles = StyleSheet.create({})

export default PrimaryInputField;
