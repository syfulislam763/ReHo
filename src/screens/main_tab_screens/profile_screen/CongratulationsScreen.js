import React from 'react';
import { View, Text } from 'react-native';
import { Check } from 'lucide-react-native';
import ComponentWrapper from '../../../components/ComponentWrapper';
import { useNavigation, CommonActions } from '@react-navigation/native';
import PrimaryButton from '../../../components/PrimaryButton';

const CongratulationsScreen = () => {
    const navigation = useNavigation()
  return (
    <ComponentWrapper bg_color='bg-[#5055ba]' title='Payment Successful'>
        <View className="flex-1 ">
        {/* Success Icon with Circular Background */}
        <View className="items-center justify-center mb-8">
            {/* Outer light purple circle */}
            <View className="w-40 h-40 bg-purple-100 rounded-full items-center justify-center">
            {/* Inner purple circle with checkmark */}
            <View className="w-24 h-24 bg-indigo-600 rounded-full items-center justify-center">
                <Check size={32} color="white" strokeWidth={3} />
            </View>
            </View>
        </View>

        {/* Congratulations Title */}
        <Text className="text-gray-900 text-3xl font-bold text-center mb-6">
            Congratulations!
        </Text>

        {/* Success Message */}
        <View className="items-center">
            <Text className="text-gray-800 text-lg font-medium text-center mb-2">
            Thanks for subscribing!
            </Text>
            <Text className="text-gray-700 text-base text-center leading-6">
            You now have access to smart budgeting tools, AI suggestions, and expert financial guidance to help you stay in control.
            </Text>
        </View>


        <View className="mt-10">
            <PrimaryButton 
                text='Done'
                onPress={() => {
                    navigation.dispatch(state => {
                        const routes = state.routes.slice(0, -3);

                        routes.push({
                            name:"ProfileScreen"
                        })

                        return CommonActions.reset({
                            ...state,
                            index: routes.length-1,
                            routes
                        })
                    })
                }}
            />
        </View>


        </View>
    </ComponentWrapper>
    
  );
};

export default CongratulationsScreen;