import React, { useState } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { Lightbulb, Voicemail } from 'lucide-react-native';
import AppHeader from '../../../components/AppHeader';
import ComponentWrapper from '../../../components/ComponentWrapper';
import { useRoute } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { get_ad, get_savings_tips } from '../ScreensAPI';
import { useAuth } from '../../../context/AuthProvider';
import { highlightKeywords, formatLoanImpactText } from '../../../utils/utils';


const LoanResultComponent = ({ 
  monthlyPayment = 5060.00, 
  totalPayableAmount = 30352.27,
  financialTip = "Your monthly disposable Income will decrease by %5060.00 due to this loan. Plan accordingly!"
}) => {
    

    const [adData, setAdData] = useState(null);
    const {isSubscribed, authToken} = useAuth();
    const [tips, setTips] = useState(null);


    const handleGetAdData = () => {
        get_ad(res => {
            if(res){
           
                setAdData(res?.data);
            }
        })
    }
    const handleGetTips = () => {
        get_savings_tips(authToken.accessToken, res => {
          if(res){
      
            setTips(res);
          }
        })
      }

    useFocusEffect(
        useCallback(() => {
            handleGetAdData();
            handleGetTips();
        }, [])
    )

    const route = useRoute()




  return (
    <ComponentWrapper container_bg='bg-white' bg_color='bg-[#1976D2]' title='Calculator Results'>
        <ScrollView  showsVerticalScrollIndicator={false} className="flex-1">
        <View className="">
            
            {/* Monthly Payment Section */}
            <View className="border border-gray-300 rounded-[5px] mb-4 p-4">
                <View className="items-center mb-8">
                    <Text className="text-lg font-medium text-gray-800 mb-2">
                        Monthly Payment
                    </Text>
                    <Text className="text-4xl font-bold text-blue-500">
                        £{route.params.monthlyPayment?.toFixed(2)}
                    </Text>
                </View>

                {/* Total Payable Amount Section */}
                <View className="items-center mb-8">
                <Text className="text-base text-gray-400 mb-2">
                    Total Payable Amount
                </Text>
                <Text className="text-2xl font-semibold text-gray-900">
                    £{route.params.totalPayableAmount?.toFixed(2)}
                </Text>
                </View>
            </View>

            {/* Financial Tip Section */}
            <View className="bg-gray-50 rounded-[5px] p-6 border border-gray-200 mb-6">
            <View className="flex-row items-center mb-3">
                <View className="w-6 h-6 mr-1">
                <Lightbulb size={24} color="#3B82F6" />
                </View>
                <Text className="text-blue-600 font-semibold text-base">
                Financial Tip
                </Text>
            </View>
                {/* <Text className="text-gray-600 text-sm leading-5">
                    {tips && formatLoanImpactText(tips?.loanTip)}
                </Text> */}
                {tips && formatLoanImpactText(tips?.loanTip)}
            </View>

            {/* Ads Section */}
            { <View className="bg-gray-100 rounded-[5px] items-center justify-center min-h-[120px] mb-20">
                {(adData)?
                    <Image
                        source={{uri: adData?.url}}
                        style={{
                            objectFit:'fill'
                        }}
                        className="min-h-[300px] w-full"
                    />:
                    
                    <View className=" ">
                        <Text className="text-gray-700 text-xl font-medium">Ads</Text>
                    </View>
                    
            
                }
            </View>}

        </View>
        </ScrollView>
    </ComponentWrapper>
  );
};

export default LoanResultComponent;