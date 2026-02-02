import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { ChevronDown, Calendar, Clock, MapPin, ConstructionIcon } from 'lucide-react-native';
import AppHeader from '../../../../components/AppHeader';
import ComponentWrapper from '../../../../components/ComponentWrapper';
import { useNavigation } from '@react-navigation/native';
import { calculate_regular_savings } from '../../ScreensAPI';
import Indicator from '../../../../components/Indicator';
import { ActivityIndicator } from 'react-native';
import ToastMessage from '../../../../constants/ToastMessage';
import vi from 'dayjs/locale/vi';


const FinancialForm = () => {

  const [budget, setBudget] = useState('');
  const [repeatEvery, setRepeatEvery] = useState('Monthly');
 
  const [showDropdown, setShowDropdown] = useState(false);
  const [returnRate, setReturnRate] = useState("")
  const [inflationRate, setInflationRate] = useState("")
  const [taxation, setTaxation] = useState('20% - BRT')
  const [customTaxation, setCustomTaxation] = useState(0)
  const [taxationDropdown, setTaxationDropdown] = useState(false);
  const values = {
    '20% - BRT': 20,
    '40% - HRT': 40,
    '45% - ADRT': 45,
    '': 0
  }
  const taxationOptions = ['20% - BRT', '40% - HRT', '45% - ADRT', 'Custom']

  const repeatOptions = ['Monthly', 'Yearly'];

  const navigation = useNavigation()


  const [visible, setVisible]  = useState(false);


  const handleCalculateSavings = () => {
    const payload = {
        amount: Number(budget),
        frequency: repeatEvery,
        returnRate:parseInt(returnRate),
        years:1,
        inflationRate:parseInt(inflationRate),
        taxRate: taxation=="Custom"?Number(customTaxation):values[taxation]
    }

    setVisible(true);



    calculate_regular_savings(payload, res => {
        if(res){
            navigation.navigate("FinancialSummary", {...res.data})
        }else{
            ToastMessage("error", "Faild to calculate, try again!")
        }

        setVisible(false);
    })




  }

  return (
    <ComponentWrapper title='Regular Savings Calculator' bg_color='bg-[#2E7D32]' >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          style={{ flex: 1 }}
          contentContainerStyle={{ 
            flexGrow: 1, 
            paddingBottom: Platform.OS === 'android' ? 200 : 20 
            }}
          keyboardShouldPersistTaps="handled"
        >
        <View style={{ paddingBottom: 20 }}>
            

            <View className="mb-6">
            <Text className="text-lg font-archivo-semi-bold text-gray-900 mb-3">
                Amount
            </Text>
            <TextInput
                className="bg-white rounded-[5px] px-4 py-4 text-lg text-gray-900"
                placeholder="£85"
                placeholderTextColor="#9CA3AF"
                value={budget}
                onChangeText={setBudget}
                keyboardType="numeric"
            />
            </View>

            <View className="mb-6">
                <Text className="text-lg font-archivo-semi-bold text-gray-900 mb-3">
                    Frequency:
                </Text>
                <TouchableOpacity
                    className="bg-white rounded-[5px] px-4 py-4 flex-row items-center justify-between"
                    onPress={() => setShowDropdown(!showDropdown)}
                >
                    <Text className="text-lg text-gray-900">{repeatEvery}</Text>
                    <ChevronDown size={20} color="#6B7280" />
                </TouchableOpacity>
                
                {showDropdown && (
                    <View className="bg-white rounded-[5px] mt-2 shadow-sm">
                    {repeatOptions.map((option, index) => (
                        <TouchableOpacity
                        key={index}
                        className="px-4 py-3 border-b border-gray-100 last:border-b-0"
                        onPress={() => {
                            setRepeatEvery(option);
                            setShowDropdown(false);
                        }}
                        >
                        <Text className="text-lg text-gray-900">{option}</Text>
                        </TouchableOpacity>
                    ))}
                    </View>
                )}
            </View>
           


            <View className="mb-6">
            <Text className="text-lg font-archivo-semi-bold text-gray-900 mb-3">
                Return Rate(%)
            </Text>
            <TextInput
                className="bg-white rounded-[5px] px-4 py-4 text-lg text-gray-900"
                placeholder="5%"
                placeholderTextColor="#9CA3AF"
                value={returnRate}
                onChangeText={setReturnRate}
                keyboardType="numeric"
            />
            </View>

            <View className="mb-6">
            <Text className="text-lg font-archivo-semi-bold text-gray-900 mb-3">
                Inflation Rate (Years):
            </Text>
            <TextInput
                className="bg-white rounded-[5px] px-4 py-4 text-lg text-gray-900"
                placeholder="1"
                placeholderTextColor="#9CA3AF"
                value={inflationRate}
                onChangeText={setInflationRate}
                keyboardType="numeric"
            />
            </View>



        
             <View className="mb-6">
                <Text className="text-lg font-archivo-semi-bold text-gray-900 mb-3">
                    Taxation:
                </Text>
                <TouchableOpacity
                    className="bg-white rounded-[5px] px-4 py-4 flex-row items-center justify-between"
                    onPress={() => setTaxationDropdown(!taxationDropdown)}
                >
                    <Text className="text-lg text-gray-900">{taxation}</Text>
                    <ChevronDown size={20} color="#6B7280" />
                </TouchableOpacity>

                {taxation == 'Custom' && <TextInput
                    className="bg-white rounded-[5px] mt-3 px-4 py-4 text-lg text-gray-900"
                    placeholder="Enter custom taxation"
                    placeholderTextColor="#9CA3AF"
                    value={customTaxation}
                    onChangeText={setCustomTaxation}
                    keyboardType="numeric"
                />}
                
                {taxationDropdown && (
                    <View className="bg-white rounded-[5px] mt-2 shadow-sm">
                    {taxationOptions.map((option, index) => (
                        <TouchableOpacity
                        key={index}
                        className="px-4 py-3 border-b border-gray-100 last:border-b-0"
                        onPress={() => {
                            setTaxation(option);
                            setTaxationDropdown(false);
                        }}
                        >
                        <Text className="text-lg text-gray-900">{option}</Text>
                        </TouchableOpacity>
                    ))}
                    </View>
                )}
            </View>


            <TouchableOpacity onPress={() => handleCalculateSavings()} className="bg-[#2E7D32] rounded-[5px] py-3 items-center ">
            <Text className="text-white text-lg font-semibold">
                Calculate Savings
            </Text>
            </TouchableOpacity>

        </View>
        </ScrollView>
      </KeyboardAvoidingView>


        {visible && <Indicator visible={visible} onClose={() => setVisible(false)}>
            
                <ActivityIndicator size={"large"}/>
            </Indicator>}
    </ComponentWrapper>
  );
};

export default FinancialForm;