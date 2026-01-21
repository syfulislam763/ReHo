import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  Platform
} from 'react-native';
import CommponentWrapper from '../../../../components/ComponentWrapper';
import { useNavigation } from '@react-navigation/native';
import { calculate_historical_inflation, calculate_inflation } from '../../ScreensAPI';
import Indicator from '../../../../components/Indicator';
import { ActivityIndicator } from 'react-native';
import ToastMessage from '../../../../constants/ToastMessage';

const coin = require("../../../../../assets/img/coin.png")

const FutureValueCalculator = () => {
  const [activeTab, setActiveTab] = useState('future');
  const [futureValues, setFutureValues] = useState({
    initialAmount: '1000',
    inflationRate: '3',
    yearsToProject: '5'
  });
  const [historicalValues, setHistoricalValues] = useState({
    fromYear: '2021',
    toYear: '2025',
    amount: '100',
    multiplier: 'Auto Fill'
  });

  const [visible, setVisible] = useState(false);

  const tableData = [
    { year: '2021', value: '£100', rate: '6.5%' },
    { year: '2022', value: '£132', rate: '7%' },
    { year: '2023', value: '£140', rate: '7.5%' },
    { year: '2025', value: '£142', rate: '8.0%' },
    { year: '2025', value: '£146', rate: '8.5%' }
  ];
  const navigation = useNavigation()

  // Future Values handlers - memoized with useCallback
  const handleInitialAmountChange = useCallback((text) => {
    setFutureValues(prev => ({...prev, initialAmount: text}));
  }, []);

  const handleInflationRateChange = useCallback((text) => {
    setFutureValues(prev => ({...prev, inflationRate: text}));
  }, []);

  const handleYearsToProjectChange = useCallback((text) => {
    setFutureValues(prev => ({...prev, yearsToProject: text}));
  }, []);

  // Historical Values handlers - memoized with useCallback
  const handleFromYearChange = useCallback((text) => {
    setHistoricalValues(prev => ({...prev, fromYear: text}));
  }, []);

  const handleToYearChange = useCallback((text) => {
    setHistoricalValues(prev => ({...prev, toYear: text}));
  }, []);

  const handleAmountChange = useCallback((text) => {
    setHistoricalValues(prev => ({...prev, amount: text}));
  }, []);

  const handleCalculateFutureValue = () => {
    console.log("fu", futureValues);
    const payload = {
      initialAmount:parseInt(futureValues.initialAmount),
      annualInflationRate: parseInt(futureValues.inflationRate),
      years: parseInt(futureValues.yearsToProject)
    }
    setVisible(true);

    calculate_inflation(payload, res => {
      if(res){
        navigation.navigate("FutureValueProjection", {...payload, ...res.data, flag:0})
      }else{

      }
      setVisible(false);
    })

  }

  const handleCalculateHistoricalValue = () => {
    console.log("his", historicalValues);
    setVisible(true);
    const payload = {
        amount: Number(historicalValues.amount),
        toYear: Number(historicalValues.toYear),
        fromYear: Number(historicalValues.fromYear)
    }
    calculate_historical_inflation(payload, res => {
      if(res){
        navigation.navigate("FutureValueProjection", {...payload, ...res.data, flag:1})
      }else{

      }
      setVisible(false);
    })
  
  }

  const TabButton = ({ title, isActive, onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-1 py-3 px-4 rounded-[5px] ${
        isActive 
          ? 'bg-red-50 border-2 border-red-500' 
          : 'bg-transparent border-2 border-transparent'
      }`}
    >
      <Text className={`text-center text-sm font-medium ${
        isActive ? 'text-red-500' : 'text-gray-700'
      }`}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <CommponentWrapper container_bg='bg-white' title='Inflation Calculator'>
      <ScrollView contentContainerStyle={{ 
                  flexGrow: 1, 
                  paddingBottom: Platform.OS === 'android' ? 200 : 20 
                }}
                keyboardShouldPersistTaps="handled"  showsVerticalScrollIndicator={false} className="flex-1 pt-8 bg-gray-50 px-3 border border-gray-200 rounded-[5px]">
        {/* Tab Switcher */}
        <View className="flex-row bg-gray-100 rounded-[5px] mb-6">
          <TabButton
            title="Future Value"
            isActive={activeTab === 'future'}
            onPress={() => setActiveTab('future')}
          />
          <TabButton
            title="Historical Value"
            isActive={activeTab === 'historical'}
            onPress={() => setActiveTab('historical')}
          />
        </View>

        {activeTab === 'future' ? (
          // Future Value Content
          <View>
            <View className="mb-6">
              <Text className="text-gray-800 text-lg font-medium mb-3">Initial Amount</Text>
              <TextInput
                value={futureValues.initialAmount}
                onChangeText={handleInitialAmountChange}
                placeholder=""
                className="w-full bg-white rounded-[5px] p-4 text-lg border border-gray-200 text-gray-800"
                placeholderTextColor="#9CA3AF"
                keyboardType='numeric'
              />
            </View>
            
            <View className="mb-6">
              <Text className="text-gray-800 text-lg font-medium mb-3">Annual Inflation Rate (%)</Text>
              <TextInput
                value={futureValues.inflationRate}
                onChangeText={handleInflationRateChange}
                placeholder=""
                className="w-full bg-white rounded-[5px] p-4 text-lg border border-gray-200 text-gray-800"
                placeholderTextColor="#9CA3AF"
                keyboardType='numeric'
              />
            </View>
            
            <View className="mb-6">
              <Text className="text-gray-800 text-lg font-medium mb-3">Years to Project</Text>
              <TextInput
                value={futureValues.yearsToProject}
                onChangeText={handleYearsToProjectChange}
                placeholder=""
                className="w-full bg-white rounded-[5px] p-4 text-lg border border-gray-200 text-gray-800"
                placeholderTextColor="#9CA3AF"
                keyboardType='numeric'
              />
            </View>

            <TouchableOpacity onPress={()=> handleCalculateFutureValue()} className="w-full bg-red-500 rounded-[5px] py-3">
              <Text className="text-white text-lg font-semibold text-center">
                Calculate Future Value
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Historical Value Content
          <View>
            <View className="mb-6">
              <Text className="text-gray-800 text-lg font-medium mb-3">From Year</Text>
              <TextInput
                value={historicalValues.fromYear}
                onChangeText={handleFromYearChange}
                placeholder=""
                className="w-full bg-white rounded-[5px] p-4 text-lg border border-gray-200 text-gray-800"
                placeholderTextColor="#9CA3AF"
                keyboardType='numeric'
              />
            </View>
            
            <View className="mb-6">
              <Text className="text-gray-800 text-lg font-medium mb-3">To Year</Text>
              <TextInput
                value={historicalValues.toYear}
                onChangeText={handleToYearChange}
                placeholder=""
                className="w-full bg-white rounded-[5px] p-4 text-lg border border-gray-200 text-gray-800"
                placeholderTextColor="#9CA3AF"
                keyboardType='numeric'
              />
            </View>
            
            <View className="mb-6">
              <Text className="text-gray-800 text-lg font-medium mb-3">Amount</Text>
              <TextInput
                value={historicalValues.amount}
                onChangeText={handleAmountChange}
                placeholder=""
                className="w-full bg-white rounded-[5px] p-4 text-lg border border-gray-200 text-gray-800"
                placeholderTextColor="#9CA3AF"
                keyboardType='numeric'
              />
            </View>

            <TouchableOpacity onPress={()=> handleCalculateHistoricalValue()} className="w-full bg-red-500 rounded-[5px] py-3 mb-8">
              <Text className="text-white text-lg font-semibold text-center">
                Calculate Historical Value
              </Text>
            </TouchableOpacity>

            
            {/* <View>
              <Text className="text-gray-800 text-lg font-semibold mb-4">
                Equivalent of 100 in 2021 is 146 in 2025
              </Text>
              
             
              <View className="bg-white rounded-[5px] border border-gray-200 overflow-hidden mb-10">
              
                <View className="flex-row">
                  <View className="flex-1 p-3 border-r border-gray-200 bg-gray-50">
                    <Text className="text-sm text-gray-700 font-medium">Year</Text>
                  </View>
                  <View className="flex-1 p-3 border-r border-gray-200 bg-gray-50">
                    <Text className="text-sm text-gray-700 font-medium">Value</Text>
                  </View>
                  <View className="flex-1 p-3 bg-gray-50">
                    <Text className="text-sm text-gray-700 font-medium">Rate</Text>
                  </View>
                </View>
                
              
                {tableData.map((row, index) => (
                  <View key={index} className="flex-row">
                    <View className="flex-1 p-3 border-r border-gray-200 bg-white border-t">
                      <Text className="text-sm text-gray-800">{row.year}</Text>
                    </View>
                    <View className="flex-1 p-3 border-r border-gray-200 bg-white border-t">
                      <Text className="text-sm text-gray-800">{row.value}</Text>
                    </View>
                    <View className="flex-1 p-3 bg-white border-t border-gray-200">
                      <Text className="text-sm text-gray-800">{row.rate}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View> */}
          </View>
        )}
      </ScrollView>


      {visible && <Indicator visible={visible} onClose={() => setVisible(false)}>
          <ActivityIndicator size={"large"}/>
        </Indicator>}
    </CommponentWrapper>
  );
};

export default FutureValueCalculator;