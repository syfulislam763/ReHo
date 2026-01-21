import React from 'react';
import { StyleSheet, View , Text} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AppHeader = ({left=()=>{}, middle=()=>{}, right=()=>{}}) => {
    return (
        <View className="flex-row justify-between items-center h-auto py-3">
            <View>
                {left()}
            </View>
            <View>
                {middle()}
            </View>
            <View>
                {right()}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({})

export default AppHeader;
