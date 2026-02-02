import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { ChevronDown, } from 'lucide-react-native';
import ComponentWrapper from '../../../components/ComponentWrapper';
import { post_budget, update_budget } from '../ScreensAPI';
import Indicator from '../../../components/Indicator';
import ToastMessage from '../../../constants/ToastMessage';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';

const BudgetFormComponent = () => {
  const [budgetName, setBudgetName] = useState('Mortgage or Rent');
  const [otherBudgetName, setOtherBudgetName] = useState("")
  const [budgetType, setBudgetType] = useState('Personal');
  const [amount, setAmount] = useState('5000');
  const [category, setCategory] = useState('Essential(Needs)');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showBudgetName, setSHowBudgetName] = useState(false);
  const budgetNames = [
    'Mortgage or Rent',
    'Building or Home insurance',
    'Travel expenses',
    'Car insurance',
    'Food and grocery shopping',
    'Childcare cost',
    'Clothing',
    'Gas Bill',
    'Electricity Bill',
    'Water Bill',
    'Broadband cost',
    'Mobile phone bill',
    'Entertainment',
    'Credit card',
    'Student Loan',
    'Loans',
    'Personal Upkeep',
    'Health Insurance',
    'Gym Membership',
    'Sport Membership',
    'Life insurance',
    'TV Licence',
    'Council Tax',
    'Subscription i.e. TV packages, netflix',
    'Savings',
    'Other'
  ];

  const navigation = useNavigation();
  const route = useRoute();



  useEffect(() => {
    if(route?.params?.isEdit){

      if(budgetNames.includes(route?.params?.title)){
        setBudgetName(route?.params?.title);
      }else{
        setBudgetName("Other")
        setOtherBudgetName(route?.params?.title)
      }

      setAmount(route.params?.amount+"");
      setCategory(route.params?.category);
      setBudgetType(route?.params?.type);
    }
  }, [])

  const categories = ['Essential(Needs)', 'Discretionary(Wants)', 'Savings'];
  

  const handleCreateBudget = () => {
    const payload = {
      name: budgetName=="Other"?otherBudgetName:budgetName,
      amount: Number(amount),
      category: category,
      type: budgetType?.toLowerCase()
    }



    setVisible(true);

    if(route.params?.isEdit){
      update_budget(payload, route?.params?.id, res => {
      if(res){
        //success
     
        ToastMessage("success", "Budget updated successfully!", 2000);
        navigation.goBack();
      }
      else{
        //failed
        ToastMessage("error", "Failed to update budget", 2000);
      }
      setVisible(false);
    })
    }else{
      post_budget(payload, res => {
        if(res){
          //success
    
          ToastMessage("success", "Budget added successfully!", 2000);
          navigation.goBack();
        }
        else{
          //failed
          ToastMessage("error", "Failed to add budget", 2000);
        }
        setVisible(false);
      })
    }

    
  }

  const RadioButton = ({ selected, onPress, label }) => (
    <TouchableOpacity 
      onPress={onPress}
      className="flex-row items-center mr-8"
    >
      <View className="w-5 h-5 rounded-full border-2 border-gray-400 items-center justify-center mr-2">
        {selected && (
          <View className="w-2.5 h-2.5 rounded-full bg-blue-500" />
        )}
      </View>
      <Text className="text-sm font-inter-regular text-gray-900">
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ComponentWrapper bg_color='bg-[#1976D2]' title={route.params?.isEdit?"Edit Budget Form":'Add New Budget'}>
        <View className="flex-1">
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1 py-6">
            
            {/* Budget Name Field */}
            {/* <View className="mb-6">
            <Text className="text-lg font-archivo-semi-bold text-gray-900 mb-3">
                Budget
            </Text>
            <TextInput
                className="bg-white rounded-[5px] px-4 py-4 font-archivo-semi-bold text-gray-900"
                value={budgetName}
                onChangeText={setBudgetName}
                placeholder="Enter budget name"
                placeholderTextColor="#9CA3AF"
            />
            </View> */}

            <View className="mb-8">
              <Text className="text-lg font-archivo-semi-bold text-gray-900 mb-3">
                  Budget Description
              </Text>
              <TouchableOpacity
                  className="bg-white rounded-[5px] px-4 py-4 flex-row items-center justify-between"
                  onPress={() => setSHowBudgetName(!showBudgetName)}
              >
                  <Text className="text-base text-gray-900">{budgetName}</Text>
                  <ChevronDown size={20} color="#6B7280" />
              </TouchableOpacity>

              {budgetName == "Other" && <View className="my-2">
          
              <TextInput
                  className="bg-white rounded-[5px] px-4 py-4 text-lg text-gray-900"
                  value={otherBudgetName}
                  onChangeText={setOtherBudgetName}
                  placeholder="Enter budget name"
                  placeholderTextColor="#9CA3AF"
              />
            </View>}
              
              {showBudgetName && (
                  <View className="bg-white rounded-[7px] mt-2 shadow-sm">
                  {budgetNames.map((cat, index) => (
                      <TouchableOpacity
                      key={index}
                      className={`px-4 py-3 border-b border-gray-100 ${
                        budgetName === cat ? 'bg-blue-50' : ''
                      }`}
                      onPress={() => {
                          setBudgetName(cat);
                          setSHowBudgetName(false);
                      }}
                      >
                      <Text className={`text-base ${
                        budgetName === cat ? 'text-[#1976D2] font-semibold' : 'text-gray-900'
                      }`}>
                        {cat}
                      </Text>
                      </TouchableOpacity>
                  ))}
                  </View>
              )}
            </View>

            {/* Budget Type Radio Buttons */}
            <View className="mb-6">
            <Text className="text-lg font-archivo-semi-bold text-gray-900 mb-4">
                Budget Type
            </Text>
            <View className="flex-row">
                <RadioButton
                selected={budgetType?.toLowerCase() === 'personal'}
                onPress={() => setBudgetType('Personal')}
                label="Personal"
                />
                <RadioButton
                selected={budgetType?.toLowerCase() === 'household'}
                onPress={() => setBudgetType('Household')}
                label="Household"
                />
            </View>
            </View>

            {/* Amount Field */}
            <View className="mb-6">
            <Text className="text-lg font-archivo-semi-bold text-gray-900 mb-3">
                Amount
            </Text>
            <TextInput
                className="bg-white rounded-[5px] px-4 py-4 text-lg text-gray-900"
                value={amount}
                onChangeText={setAmount}
                placeholder="Enter amount"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
            />
            </View>

            {/* Budget Category Dropdown */}
            <View className="mb-8">
            <Text className="text-lg font-archivo-semi-bold text-gray-900 mb-3">
                Budget Category
            </Text>
            <TouchableOpacity
                className="bg-white rounded-[5px] px-4 py-4 flex-row items-center justify-between"
                onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
            >
                <Text className="text-base text-gray-900">{category}</Text>
                <ChevronDown size={20} color="#6B7280" />
            </TouchableOpacity>
            
            {showCategoryDropdown && (
                <View className="bg-white rounded-[7px] mt-2 shadow-sm">
                {categories.map((cat, index) => (
                    <TouchableOpacity
                    key={index}
                    className={`px-4 py-3 border-b border-gray-100 ${
                      category === cat ? 'bg-blue-50' : ''
                    }`}
                    onPress={() => {
                        setCategory(cat);
                        setShowCategoryDropdown(false);
                    }}
                    >
                    <Text className={`text-base ${
                      category === cat ? 'text-[#1976D2] font-semibold' : 'text-gray-900'
                    }`}>
                      {cat}
                    </Text>
                    </TouchableOpacity>
                ))}
                </View>
            )}
            </View>

            {/* Save Button */}
            <TouchableOpacity 
              onPress={handleCreateBudget}
              className="bg-blue-500 rounded-[5px] py-3 items-center"
            >
              <Text className="text-white text-lg font-semibold">
                  Save
              </Text>
            </TouchableOpacity>

        </ScrollView>
        </View>

        {visible && <Indicator visible={visible} onClose={() => setVisible(false)}>
          <ActivityIndicator size={"large"}/>
        </Indicator>}
    </ComponentWrapper>
  );
};

export default BudgetFormComponent;