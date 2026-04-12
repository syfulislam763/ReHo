import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import ComponentWrapper from '../../../../components/ComponentWrapper';
import { useFocusEffect } from '@react-navigation/native';
import Indicator from '../../../../components/Indicator';
import { ActivityIndicator } from 'react-native';
import { useCallback } from 'react';
import { get_debt_suggestions } from '../../ScreensAPI';
import { useAuth } from '../../../../context/AuthProvider';
export const highlightKeywords = (text) => {
  const redKeywords = ['income', 'incomes', 'debts', 'debt', 'expense', 'expenses', 'loss', 'inflation', 'decreased', ];
  const greenKeywords = ['savings goal', 'savings goals', 'saving goal', 'savings', 'budget', 'budgets', 'saving goals'];

  const allKeywords = [
    ...greenKeywords.map(k => ({ word: k, color: '#22C55E' })),
    ...redKeywords.map(k => ({ word: k, color: '#EF4444' }))
  ].sort((a, b) => b.word.length - a.word.length);

  const pattern = new RegExp(
    `(${allKeywords.map(k => k.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`,
    'gi'
  );

  const parts = text.split(pattern);

  return (
    <Text>
      {parts.map((part, index) => {
        if (!part) return null;

        const keyword = allKeywords.find(
          k => k.word.toLowerCase() === part.toLowerCase()
        );

        if (keyword) {
          return (
            <Text key={index} style={{ color: keyword.color, fontWeight: '600' }}>
              {part}
            </Text>
          );
        }

        return <Text key={index}>{part}</Text>;
      })}
    </Text>
  );
};


const renderSuggestionLines = (text) => {
  const lines = text.split('\n');
  return lines.map((line, index) => {
    const isBullet = line.trimStart().startsWith('-');
    const content = isBullet ? line.replace(/^\s*-\s*/, '') : line;

    if (!content.trim()) return null;

    return (
      <View key={index} className="flex-row items-start mb-1">
        {isBullet ? (
          <View
            style={{
              width: 5,
              height: 2,
              backgroundColor: '#1F2937', // gray-800
              marginTop: 10,
              marginRight: 20,
              borderRadius: 1,
            }}
          />
        ) : (
          <View style={{ marginRight: 23 }} /> // indent non-bullet lines same amount
        )}
        <Text className="text-gray-600 text-base flex-1">
          {highlightKeywords(content)}
        </Text>
      </View>
    );
  });
};
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
            
            }else{

            }

            setVisible(false);
        })
    }

    useEffect(() => {
        handleGetDebtSuggestion()
    }, [])

    console.log("__", JSON.stringify(rehoSuggestions.insights, null, 2))


  return (
    <ComponentWrapper title='Reho Suggestions' bg_color='bg-[#FFA950]'>
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Header */}
        <Text className="text-gray-900 text-xl font-bold mb-8">
            Reho Suggestions to Pay Off Faster
        </Text>

        {/* Suggestions List */}
        <View className="space-y-8 pb-16">
            {/* Suggestion 1 */}
            
            {
                rehoSuggestions?.insights?.map((item, idx) => {
                    return <View key={idx}>
                        <Text className="text-gray-900 text-lg font-semibold flex-row">
                            <View className="h-2 w-2 bg-black "/> <View className='w-3'></View><Text className=''>{item?.insight}</Text>
                        </Text>
                        <Text className="text-gray-600 text-base p-4">
                            {renderSuggestionLines(item?.suggestion)}
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