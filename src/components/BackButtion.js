import React from 'react';
import { StyleSheet, View, Image, Pressable} from 'react-native';
import { useNavigation } from '@react-navigation/native';


const left_arrow = require("../../assets/img/left-arrow.png");

const BackButtion = ({bg_color="bg-gray-50"}) => {
    const navigtation = useNavigation()
    return (
        <Pressable onPress={()=> navigtation.goBack()} className={`h-10 w-10 justify-center items-center rounded-full ${bg_color}`}>
            <Image 
                source={left_arrow}
                className="h-6 w-6"
                style={{objectFit:'contain'}}
            />
        </Pressable>
    );
}

const styles = StyleSheet.create({})

export default BackButtion;
