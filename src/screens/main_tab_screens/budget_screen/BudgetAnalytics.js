import React, { useState } from 'react';
import { View, Text, SafeAreaView , TouchableOpacity, ScrollView} from 'react-native';
import ComponentWrapper from '../../../components/ComponentWrapper';
import { useNavigation } from '@react-navigation/native';
import { get_budget_analysis, get_budget_suggestions } from '../ScreensAPI';
import Indicator from '../../../components/Indicator';
import { ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { useAuth } from '../../../context/AuthProvider';
import { highlightKeywords } from '../../../utils/utils';

const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};


const BarChart = ({budgetDataFromAPI}) => {
  const getLast6Months = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      last6Months.push(months[monthIndex]);
    }
    
    return last6Months;
  };

  const getBudgetExpensesData = () => {
    const months = getLast6Months();
    
    const budgetMap = budgetDataFromAPI.reduce((acc, item) => {
      acc[item.month] = {
        totalBudget: item.totalBudget,
        essential: item.essential || 0,
        discresonary: item.discresonary || 0,
        savings: item.savings || 0
      };
      return acc;
    }, {});

    return months.map(month => ({
      month,
      ...(budgetMap[month] || { totalBudget: 0, essential: 0, discresonary: 0, savings: 0 })
    }));
  };

  const expenseData = getBudgetExpensesData();
  const trueMaxAmount = Math.max(...expenseData.map(item => item.totalBudget));
  const SCALING_CAP = 15000;
  const chartHeight = 135;

  const colors = {
    essential: '#EF4444',  
    discretionary: '#F59E0B', 
    savings: '#10B981',    
  };

  const chartData = expenseData.map(item => {
    const scaledAmount = Math.min(item.totalBudget, SCALING_CAP);
    const referenceMax = SCALING_CAP;
    const totalHeight = referenceMax > 0 
      ? Math.max((scaledAmount / referenceMax) * chartHeight, 4) 
      : 4;

    const total = item.totalBudget;
    let essentialHeight = 0;
    let discretionaryHeight = 0;
    let savingsHeight = 0;

    if (total > 0) {
      const essentialPercent = item.essential / total;
      const discretionaryPercent = item.discresonary / total;
      const savingsPercent = item.savings / total;

      essentialHeight = totalHeight * essentialPercent;
      discretionaryHeight = totalHeight * discretionaryPercent;
      savingsHeight = totalHeight * savingsPercent;
    }

    return {
      ...item,
      totalHeight,
      essentialHeight,
      discretionaryHeight,
      savingsHeight
    };
  });

  const getYAxisLabels = () => {
    const displayMax = SCALING_CAP;
    return [
      `£${formatNumber(displayMax)}${trueMaxAmount > displayMax ? '+' : ''}`,
      `£${formatNumber(Math.round(displayMax * 0.75))}`,
      `£${formatNumber(Math.round(displayMax * 0.5))}`,
      `£${formatNumber(Math.round(displayMax * 0.25))}`,
      '£0'
    ];
  };

  const yAxisLabels = getYAxisLabels();

  return (
    <View className="bg-white rounded-2xl p-6 mb-6">
      <Text className="text-gray-900 font-semibold text-lg mb-6">
        Monthly Budget
      </Text>

      <View className="flex-row">
        <View className="mr-3">
          <View className="h-40 justify-between">
            {yAxisLabels.map((label, index) => (
              <Text key={index} className="text-gray-600 text-xs">
                {label}
              </Text>
            ))}
          </View>
        </View>

        <View className="flex-1">
          <View className="h-40 flex-row items-end justify-between px-2">
            {chartData.map((data, index) => (
              <View key={index} className="items-center relative">
                <View 
                  className="w-8 rounded-t-sm overflow-hidden"
                  style={{ height: data.totalHeight }}
                >
                  {data.savingsHeight > 0 && (
                    <View 
                      style={{ 
                        height: data.savingsHeight, 
                        backgroundColor: colors.savings 
                      }} 
                    />
                  )}
                  
                  {data.discretionaryHeight > 0 && (
                    <View 
                      style={{ 
                        height: data.discretionaryHeight, 
                        backgroundColor: colors.discretionary 
                      }} 
                    />
                  )}
                  
                  {data.essentialHeight > 0 && (
                    <View 
                      style={{ 
                        height: data.essentialHeight, 
                        backgroundColor: colors.essential 
                      }} 
                    />
                  )}
                </View>
                {data.totalBudget > SCALING_CAP && (
                  <Text 
                    className="text-xs font-semibold"
                    numberOfLines={1}
                    ellipsizeMode="clip"
                    style={{
                      position: 'absolute',
                      bottom: 40,
                      left: -25,
                      width: 120,
                      transform: [{ rotate: '-90deg' }],
                      color: '#000',
                      textAlign: 'center',
                    }}
                  >
                    £{formatNumber(data.totalBudget)}
                  </Text>
                )}
              </View>
            ))}
          </View>

          <View className="flex-row justify-between px-2 mt-2">
            {chartData.map((data, index) => (
              <Text key={index} className="text-gray-600 text-xs">
                {data.month}
              </Text>
            ))}
          </View>
        </View>
      </View>

      <View className="flex-row justify-center gap-x-4 mt-4 pt-4 border-t border-gray-200">
        <View className="flex-row items-center">
          <View className="w-3 h-3 rounded-sm mr-1" style={{ backgroundColor: colors.essential }} />
          <Text className="text-xs text-gray-700">Essential</Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-3 h-3 rounded-sm mr-1" style={{ backgroundColor: colors.discretionary }} />
          <Text className="text-xs text-gray-700">Discretionary</Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-3 h-3 rounded-sm mr-1" style={{ backgroundColor: colors.savings }} />
          <Text className="text-xs text-gray-700">Savings</Text>
        </View>
      </View>
    </View>
  );
};

const AIsuggestion = ({ number, text }) => (
  <View className="flex-row flex-wrap mb-3 items-center relative">
    <View className="h-2 w-2 bg-black mr-3 absolute top-2.5"/>
    <View className='ml-5'>
      <Text className="text-gray-700 text-base ">{highlightKeywords(text)}</Text>
    </View>
  </View>
);

export default function BudgetAnalytics() {
  const navigation = useNavigation();
  const {userProfile, authToken, isSubscribed} = useAuth();
  const [visible, setVisible] = useState(false);
  const [budgetDataFromAPI, setBudgetDataFromAPI] = useState([]);
  const [rehoSuggestions, setRehoSuggestions] = useState({})

  const handleGetChartData = () => {
    setVisible(true);

    get_budget_analysis(res => {

      if(res){
        setBudgetDataFromAPI(res.data)
      }else{

      }

      setVisible(false);
    })
  }

  const handleGetRehoSuggetions = () => {
    get_budget_suggestions(authToken.accessToken, res => {
      if(res){
        setRehoSuggestions(res);
       
      }
    })
  }

  useFocusEffect(
    useCallback(() => {
      handleGetChartData()
      handleGetRehoSuggetions()
    }, [])
  )
  const suggestions = [
    { id: 1, text: "You are spending 15% more on entertainment" },
    { id: 2, text: "Consider Cutting Down on Subscriptions" },
    { id: 3, text: "Reduce Transportation Costs by 10%" }
  ];

  return (
    <ComponentWrapper bg_color='bg-[#1976D2]' title='Monthly Budget Analytics'>
        <ScrollView showsVerticalScrollIndicator={false} className=" pt-4 flex-1 bg-[##e7eaef]">
            {/* Bar Chart Component */}
            <BarChart budgetDataFromAPI={budgetDataFromAPI} />

            {/* AI Suggestions Section */}
            <View className="rounded-2xl pb-16">
            
            
            {isSubscribed ? //
              <View>
                <Text className="text-gray-900 font-bold text-lg mb-4">
                  ReHo Suggests:
                </Text>
                
              {
                rehoSuggestions?.insights?.map((suggestion, idx) => (
                  <AIsuggestion
                    key={idx}
                    number={idx+1}
                    text={suggestion?.suggestion}
                  />
                ))
              }

              {rehoSuggestions?.summary && <Text className="text-gray-600 text-base mb-4 border border-[#1976D2] p-4 rounded-sm mt-5">
                    {highlightKeywords(rehoSuggestions?.summary)}
                </Text>}
              


              </View>:

            <View> 

              <TouchableOpacity onPress={() => navigation.navigate("PremiumFinancialAdvice")} className="bg-[#1976D2] p-4 rounded-sm">
                <Text className="text-white text-center font-archivo-semi-bold text-md">Subscribe to optimize budget with ReHo </Text>
              </TouchableOpacity>

            </View>
          
          
            }
            </View>
        </ScrollView>

          

          {visible && <Indicator visible={visible} onClose={() => setVisible(false)}>
              <ActivityIndicator size={"large"}/>
            </Indicator>}
        
    </ComponentWrapper>
  );
}