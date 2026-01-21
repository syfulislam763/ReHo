import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import * as Font from 'expo-font';


const FontLoader = ({children}) => {
    const [fontsLoaded, setFontsLoaded] = useState(false);


    useEffect(() => {

        (
            async function loadFonts () {
                await Font.loadAsync({
                    "Archivo_Regular": require("../../assets/fonts/archivo/Archivo-Regular.ttf"),
                    "Archivo-SemiBold":require("../../assets/fonts/archivo/Archivo-SemiBold.ttf"),
                    "Archivo-ExtraBold": require("../../assets/fonts/archivo/Archivo-ExtraBold.ttf"),
                    "Inter_18pt-Regular":require("../../assets/fonts/inter/Inter_18pt-Regular.ttf"),
                    "Inter_18pt-SemiBold":require("../../assets/fonts/inter/Inter_18pt-SemiBold.ttf")

                })
                setFontsLoaded(true);
            }


        )()




    }, [])



    if (!fontsLoaded) {
        return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" />
        </View>
        );
     }

    return children;


}


export default FontLoader;