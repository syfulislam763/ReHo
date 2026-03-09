import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import AppHeader from '../../../../components/AppHeader';
import BackButtion from '../../../../components/BackButtion';
import { useNavigation } from '@react-navigation/native';
import Indicator from '../../../../components/Indicator';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { useAuth } from '../../../../context/AuthProvider';
import { ActivityIndicator } from 'react-native';
import { get_expense_analysis, get_expence_suggestions, get_budget_suggestions } from '../../ScreensAPI';
import ComponentWrapper from '../../../../components/ComponentWrapper';
import { highlightKeywords } from '../../../../utils/utils';

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
        acc[item.month] = item.totalExpenses;
        return acc;
    }, {});

    return months.map(month => ({
      month,
      amount: budgetMap[month] !== undefined ? budgetMap[month] : 0
    }));
  };

  const expenseData = getBudgetExpensesData();
  
  const trueMaxAmount = Math.max(...expenseData.map(item => item.amount));
  
 
  const SCALING_CAP = 15000; 
  
  const chartHeight = 135; 


  const chartData = expenseData.map(item => {
  
    const scaledAmount = Math.min(item.amount, SCALING_CAP); 
    
    const referenceMax = SCALING_CAP;
    
    const height = referenceMax > 0 
      ? Math.max((scaledAmount / referenceMax) * chartHeight, 4) 
      : 4; 

    return {
      ...item,
      height: height
    };
  });

  const getYAxisLabels = () => {
    const displayMax = SCALING_CAP; 

    return [
      `£${formatNumber(displayMax)}${trueMaxAmount > displayMax ? '+' : ''}`, 
      `£${formatNumber(Math.round(displayMax * 0.75))}`, // £11,250
      `£${formatNumber(Math.round(displayMax * 0.5))}`,  // £7,500
      `£${formatNumber(Math.round(displayMax * 0.25))}`, // £3,750
      '£0'
    ];
  };

  const yAxisLabels = getYAxisLabels();

  return (
    <View className="bg-white rounded-2xl p-6 mb-6 ">
      {/* Chart Header */}
      <Text className="text-gray-900 font-semibold text-lg mb-6">
        Monthly Expense
      </Text>

      {/* Y-axis Labels and Chart Container */}
      <View className="flex-row">
        {/* Y-axis Labels */}
        <View className="mr-3">
          <View className="h-40 justify-between">
            {yAxisLabels.map((label, index) => (
              <Text key={index} className="text-gray-600 text-xs ">
                {label}
              </Text>
            ))}
          </View>
        </View>

        {/* Chart Bars Container */}
        <View className="flex-1">
          {/* Chart Area */}
          <View className="h-40 flex-row items-end justify-between px-2">
            {chartData.map((data, index) => (
              <View key={index} className="items-center">
                {/* Bar Value Display (Only for values exceeding the cap) */}

                <View 
                  className="bg-red-500 w-8 rounded-t-sm"
                  style={{ height: data.height, position:'relative' }}
                > 
                  <Text 
                    className="text-white text-xs font-semibold mb-1" 
                    numberOfLines={1}
                    ellipsizeMode="clip"
                    style={{
                      position: 'absolute',
                      bottom: 40,
                      left: -47,
                      width: 120,
                      transform: [{ rotate: '-90deg' }],
                      color: '#fff',
                      textAlign: 'center',
                    }}
                  >
                      {data.amount > SCALING_CAP ? `£${formatNumber(data.amount)}` : ''}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* X-axis Labels */}
          <View className="flex-row justify-between px-2 mt-2">
            {chartData.map((data, index) => (
              <Text key={index} className="text-gray-600 text-xs">
                {data.month}
              </Text>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

const AIsuggestion = ({ number, text }) => (
  <View className="flex-row flex-wrap mb-3 items-center relative">
    <View className="h-2 w-2 rounded-full bg-black mr-3 absolute top-2.5"/>
    <View className='ml-5'>
      <Text className="text-gray-700 text-base ">{highlightKeywords(text)}</Text>
    </View>
  </View>
);
export default function ExpenseAnalytics() {



  const navigation = useNavigation();
  const {userProfile, authToken, isSubscribed} = useAuth();
    const [visible, setVisible] = useState(false);
    const [budgetDataFromAPI, setBudgetDataFromAPI] = useState([]);
    const [rehoSuggestions, setRehoSuggestions] = useState([])
  
    const handleGetChartData = () => {
      setVisible(true);
  
      get_expense_analysis(res => {
  
        if(res){
          setBudgetDataFromAPI(res.data)
        }else{
  
        }
  
        setVisible(false);
      })
    }
  
    const handleGetRehoSuggetions = () => {
      get_expence_suggestions(authToken.accessToken, res => {
  
        if(res){
          setRehoSuggestions(res)
  
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
    <ComponentWrapper bg_color="bg-red-500" title='Expenses Analytics Chart'>
      {/* Header with Back Button */}
    
      <ScrollView showsVerticalScrollIndicator={false} className=" pt-4 flex-1 bg-[##e7eaef]">
        {/* Bar Chart Component */}
        <BarChart budgetDataFromAPI={budgetDataFromAPI}/>

        {/* AI Suggestions Section */}
        <View className="rounded-2xl pb-16">
         {isSubscribed? //
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

            {rehoSuggestions?.summary && <Text className="text-gray-600 text-base mb-4 border border-red-500 p-4 rounded-sm mt-5">
                {highlightKeywords(rehoSuggestions?.summary)}
            </Text>}


            </View>:

          <View> 

            <TouchableOpacity onPress={() => navigation.navigate("PremiumFinancialAdvice")} className="bg-red-500 p-4 rounded-sm">
              <Text className="text-white text-center font-archivo-semi-bold text-md">Subscribe to optimize expense with ReHo </Text>
            </TouchableOpacity>

          </View>
        
        
          }
        </View>
      </ScrollView>


      {visible && <Indicator onClose={() => setVisible(false)} visible={visible}>
            
                <ActivityIndicator size={"large"}/>
            </Indicator>}
    </ComponentWrapper>
  );
}