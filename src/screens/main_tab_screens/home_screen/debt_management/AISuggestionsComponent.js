import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import ComponentWrapper from '../../../../components/ComponentWrapper';
import { useFocusEffect } from '@react-navigation/native';
import Indicator from '../../../../components/Indicator';
import { ActivityIndicator } from 'react-native';
import { useCallback } from 'react';
import { get_debt_suggestions } from '../../ScreensAPI';
import { useAuth } from '../../../../context/AuthProvider';
import { highlightKeywords } from '../../../../utils/utils';


const AIsuggestion = ({ number, text }) => (
  <View className="flex-row mb-3">
    <Text className="text-gray-700 font-archivo-regular text-base mr-2">{number}.</Text>
    <Text className="text-gray-700 text-base flex-1">{text}</Text>
  </View>
);

const AISuggestionsComponent = () => {

    const {authToken} = useAuth();
    const [visible, setVisible] = useState(false);
    const [rehoSuggestions, setRehoSuggestions] = useState({})

    const handleGetDebtSuggestion = () => {
        setVisible(true);
        get_debt_suggestions(authToken.accessToken, res => {
            
            if(res){
                setRehoSuggestions(res)
                console.log("Debt suggestions", JSON.stringify(res, null, 2))
            }else{

            }

            setVisible(false);
        })
    }

    useEffect(() => {
        handleGetDebtSuggestion()
    }, [])


  return (
    <ComponentWrapper title='Reho Suggestions' bg_color='bg-[#FFA950]'>
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Header */}
        <Text className="text-gray-900 text-xl font-bold mb-8">
            Reho Suggestions to Pay Off Faster
        </Text>

        {/* Suggestions List */}
        <View className="space-y-8">
            {/* Suggestion 1 */}
            
            {
                rehoSuggestions?.insights?.map((item, idx) => {
                    return <View key={idx}>
                        <Text className="text-gray-900 text-lg font-semibold flex-row items-center">
                            <View className="h-2 w-2 rounded-full bg-black mr-1"/> <Text>{item?.insight}</Text>
                        </Text>
                        <Text className="text-gray-600 text-base p-4">
                            {highlightKeywords(item?.suggestion)}
                        </Text>
                    </View>
                })
            }
            {
                rehoSuggestions?.summary && <Text className="text-gray-600 text-base mb-4 border border-[#FFA950] p-4 rounded-sm mt-5">
                {rehoSuggestions?.summary}
            </Text>
            }
            

        </View>
        </ScrollView>


        {visible && <Indicator onClose={() => setVisible(false)} visible={visible}>
            
                <ActivityIndicator size={"large"}/>
            </Indicator>}
    </ComponentWrapper>
  );
};

export default AISuggestionsComponent;