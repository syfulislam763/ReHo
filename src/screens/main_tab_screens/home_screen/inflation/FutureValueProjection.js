import React, { useState } from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { Lightbulb } from 'lucide-react-native';
import CommponentWrapper from '../../../../components/ComponentWrapper';
import { useRoute } from '@react-navigation/native';
import { get_savings_tips } from '../../ScreensAPI';
import { useAuth } from '../../../../context/AuthProvider';
import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { highlightKeywords, renderSuggestionLines } from '../../../../utils/utils';

const coin = require("../../../../../assets/img/coin.png")

const FutureValueProjection = () => {

    const route = useRoute();
    const params = route.params;
    const [tips, setTips] = useState(null);
    const {authToken} = useAuth();


    const handleGetTips = () => {
        get_savings_tips(authToken.accessToken, res => {
            if(res){
            setTips(res);
            }
        })
    }

    useFocusEffect(
        useCallback(() => {
            handleGetTips();
        }, [])
    )

    console.log(JSON.stringify(tips, null, 2), "tips")


  return (
    <CommponentWrapper container_bg='bg-white' title='Inflation Calculator Results'>
        <ScrollView contentContainerStyle={{paddingBottom:100}} showsVerticalScrollIndicator={false} className="flex-1">
        
            <View className="bg-gray-50 rounded-[5px] border border-gray-200 p-6 mb-4 ">
     
                {!(params.flag) && <Text className="text-gray-700 text-lg font-medium text-center mb-4">
                    Future Value Projection
                </Text>}
                
           
                {!(params.flag) && <Text className="text-red-500 text-4xl font-bold text-center mb-6 w-auto border border-red-400 rounded-[5px] py-5">
                    £{params?.futureValue}
                </Text>}


                {(params.flag) && <Text className=" text-2xl font-bold text-center mb-6">
                    Value in {params?.fromYear}
                </Text>}
                {(params.flag) && <Text className="text-red-500 text-4xl font-bold text-center mb-6 w-auto border border-red-400 rounded-[5px] py-5">
                    £{params?.amount}
                </Text>}

                {(params.flag) && <Text className=" font-bold text-center mb-2">
                    To buy same amount of item for £{params?.amount} in {params?.toYear} will cost you £{params?.equivalentAmountInToYear}
                </Text>}

                {(params.flag) && <Text className=" text-2xl font-bold text-center mb-6">
                    Value in {params?.toYear}
                </Text>}

                {(params.flag) && <Text className="text-red-500 text-4xl font-bold text-center mb-6 w-auto border border-red-400 rounded-[5px] py-5">
                    £{params?.equivalentAmountInToYear}
                </Text>}
                {(params.flag) && <Text className=" font-bold text-center mb-2">
                    The Cost of Inflation
                </Text>}
                {(params.flag) && <Text className=" text-center mb-2">
                    The percentage fall in the value of money
                </Text>}
                {(params.flag) && <Text className=" font-bold text-center mb-6">
                    {params?.purchasingPowerLossPercent}%
                </Text>}
                
          
                {!(params?.flag) && <Text className="text-gray-500 text-sm text-center leading-5 mb-8">
                This is the estimated cost of an item{'\n'}
                currently worth £{params.initialAmount} in {params.years}{'\n'}
                years, assuming an average annual{'\n'}
                inflation rate of {params.annualInflationRate}%.
                </Text>}
                
             
                <View className="flex-row justify-center items-center space-x-6">
       
                <View className="w-10 h-10 border-2 border-red-500 rounded-md flex items-center justify-center">
                    <Text className="text-red-500 text-lg font-bold">£</Text>
                </View>
                
                {/* Coin Image */}
                <View>
                    <Image  
                        source={coin}
                        style={{
                            objectFit:'contain'
                        }}
                        className="w-32 h-32 ml-4"
                    />
                </View>
                {/* <View className="w-10 h-10">
                    <View className="w-full h-full bg-yellow-600 rounded-full border-2 border-yellow-700 flex items-center justify-center">
                    <Text className="text-yellow-100 text-xs font-bold">£</Text>
                    </View>
                </View> */}
                </View>
            </View>
            
            {/* Information Card */}
            <View className="bg-gray-50 rounded-[5px] border border-gray-200 p-4 ">
                {/* Header with Icon */}
                <View className="flex-row items-center mb-3">
                   <Lightbulb size={18} color="#ef4444" fill="#ef4444" />
                    <Text className="text-red-500 text-base font-semibold ml-2">
                        Understanding Inflation
                    </Text>
                </View>
                
                {/* Description */}
                <Text className="text-gray-700 text-sm leading-5">
                    {tips?
                        <Text>{params?.flag?renderSuggestionLines(tips?.historicalTip, "square", {marginLeft:10}):renderSuggestionLines(tips?.futureValueTip, "square", {marginLeft: 23})}</Text>
                        : ' '
                    }
                </Text>
            </View>
            </ScrollView>
    </CommponentWrapper>
  );
};

export default FutureValueProjection;