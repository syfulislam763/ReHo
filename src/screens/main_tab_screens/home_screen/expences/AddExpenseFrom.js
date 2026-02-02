import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import AppHeader from '../../../../components/AppHeader';
import BackButtion from '../../../../components/BackButtion';
import { useNavigation } from '@react-navigation/native';
import PrimaryButton from '../../../../components/PrimaryButton';
import { post_expence, update_expense } from '../../ScreensAPI';
import Indicator from '../../../../components/Indicator';
import { ActivityIndicator } from 'react-native';
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import ToastMessage from '../../../../constants/ToastMessage';
import ComponentWrapper from '../../../../components/ComponentWrapper';
import { useRoute } from '@react-navigation/native';
import { ChevronDown } from 'lucide-react-native';

function convertToISO(dateStr) {
  const months = {
    January: 0, February: 1, March: 2, April: 3,
    May: 4, June: 5, July: 6, August: 7,
    September: 8, October: 9, November: 10, December: 11,
  };

  const [monthName, dayWithComma, year] = dateStr.split(" ");

  const month = months[monthName.trim()];
  const day = parseInt(dayWithComma.replace(",", "").trim(), 10);

  if (month === undefined || isNaN(day) || isNaN(year)) {
    throw new Error("Invalid date format");
  }

  const date = new Date(Date.UTC(year, month, day));
  return date.toISOString();  // always safe
}

const AddExpenseForm = () => {
  const [expenseName, setExpenseName] = useState('Mortgage or Rent');
  const [otherExpenseName, setOtherExpenseName] = useState("")
  const [amount, setAmount] = useState('5000');

  const [budgetType, setBudgetType] = useState('Personal');
  const [category, setCategory] = useState('Essential(Needs)');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const [frequency, setFrequency] = useState('Monthly');
  const [date, setDate] = useState(dayjs());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showExpenseDropdown, setShowExpenseDropdown] = useState(false);
  const capitalize = (str) => str?.charAt(0)?.toUpperCase() + str.slice(1);
  const route = useRoute();

  const navigation = useNavigation();

  const freqValidator = {"One-off": 'on-off', "one-off": "on-off"}

  const frequencies = ['Monthly', 'Yearly', 'One-off'];
  
  const expenseNames = [
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

  const [visible, setVisible] = useState(false);
  const categories = ['Essential(Needs)', 'Discretionary(Wants)', 'Savings'];

  // Format date to YYYY-MM-DD for payload
  const formatDateForPayload = (date) => {
    return dayjs(date).format('YYYY-MM-DD');
  };

  // Format date for display
  const formatDateForDisplay = (date) => {
    return dayjs(date).format('MMMM D, YYYY');
  };

  const handleDateSelect = (params) => {
    setDate(dayjs(params.date));
    setShowDatePicker(false);
  };

  const handleExpenseNameSelect = (name) => {
    setExpenseName(name);
    setShowExpenseDropdown(false);
  };

  const handleCreateExpense = () => {
    const payload = {
      name: expenseName == "Other"?otherExpenseName:expenseName,
      amount: Number(amount),
      endDate: formatDateForPayload(date),
      frequency: freqValidator[frequency?.toLowerCase()]?freqValidator[frequency?.toLowerCase()]:frequency?.toLowerCase(),
      type: budgetType?.toLowerCase(),
      category: category
    }



    setVisible(true);

    if(route?.params?.type == "edit"){
      update_expense(route?.params?.id, payload, res => {
        if(res){
          navigation.goBack()
        }
        setVisible(false);
      })
    }else{
      post_expence(payload, (res) => {
        if(res){
          //success
  
          ToastMessage("success", "Expense added successfully!", 2000);
          navigation.goBack();
        }else{
          //failed
          ToastMessage("error", "Failed to add expense", 2000);
        }
        setVisible(false);
      })
    }
  }

  useEffect(() => {
    if(route?.params?.type == "edit"){
  
      if(expenseNames.includes(route?.params?.title)){
        setExpenseName(route?.params?.title)
      }else{
        setExpenseName("Other")
        setOtherExpenseName(route?.params?.title);
      }
      
      setFrequency(capitalize(route?.params?.frequency))
      const iso = convertToISO(route?.params?.date);
      setAmount(route?.params?.amount+"");
      
      setDate(dayjs(iso))
      setBudgetType(route?.params?.budgetId?.type);
      setCategory(route?.params?.budgetId?.category)
      

    }
  }, [route?.params])

  const RadioButton = ({ selected, onPress, label }) => (
    <TouchableOpacity onPress={onPress} className="flex-row items-center mr-5">
      <View className="w-5 h-5 rounded-full border-2 border-gray-400 mr-2 items-center justify-center">
        {selected && (
          <View className="w-3 h-3 rounded-full bg-[#4F55BA]" />
        )}
      </View>
      <Text className="text-gray-800 text-base">{label}</Text>
    </TouchableOpacity>
  );

  return (
    <ComponentWrapper bg_color="bg-red-500" title= {route?.params?.type == "edit"?"Edit Expense":'Add Expense'} >
    

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom:20}} className="flex-1 py-2 bg-[##e7eaef]">
        {/* Expense Name Dropdown */}
        <View className="mb-6">
          <Text className="text-gray-900 text-base font-archivo-semi-bold mb-3">
            Expense Name
          </Text>
          <TouchableOpacity
            onPress={() => setShowExpenseDropdown(true)}
            className="bg-white rounded-xl px-4 py-4 border border-gray-300 flex-row items-center justify-between"
          >
            <Text className="text-gray-900 text-base flex-1 font-archivo-semi-bold">
              {expenseName}
            </Text>
            <Text className="text-gray-600 text-lg">▼</Text>
          </TouchableOpacity>
        </View>

        {expenseName == "Other" && <View className="mb-6">
          <TextInput
            value={otherExpenseName}
            onChangeText={setOtherExpenseName}
            className="bg-white rounded-xl px-4 py-4 text-gray-900 font-archivo-semi-bold border border-gray-300"
            placeholder="Enter expense name"
            placeholderTextColor="#9CA3AF"

          />
        </View>}

        <View className="mb-8">
            <Text className="text-lg font-archivo-semi-bold text-gray-900 mb-3">
                Category
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

        {/* Amount */}
        <View className="mb-6">
          <Text className="text-gray-900 font-archivo-semi-bold mb-3">
            Amount
          </Text>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            className="bg-white rounded-xl px-4 py-4 text-gray-900 font-archivo-semi-bold border border-gray-300"
            placeholder="Enter amount"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
          />
        </View>

        {/* Frequency */}
        <View className="mb-6">
          <Text className="text-gray-900 font-archivo-semi-bold mb-4">
            Frequency
          </Text>
          <View className="flex-row">
            {frequencies.map((freq) => (
                <RadioButton
                key={freq}
                selected={frequency === freq}
                onPress={() => setFrequency(freq)}
                label={freq}
                />
            ))}
          </View>
        </View>

        {/* Date Received */}
        <View className="mb-8">
          <Text className="text-gray-900 font-archivo-semi-bold mb-3">
            Date Received
          </Text>
          <TouchableOpacity 
            onPress={() => setShowDatePicker(true)}
            className="bg-white rounded-xl px-4 py-4 border border-gray-300 flex-row items-center"
          >
            <View className="mr-3">
              <Text className="text-gray-600 text-lg">📅</Text>
            </View>
            <Text className="text-gray-900 text-base flex-1">
              {formatDateForDisplay(date)}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Save Button */}
        <PrimaryButton 
          bgColor='bg-red-500'
          text='Save'
          onPress={handleCreateExpense}
        />
      </ScrollView>

      {/* Expense Name Dropdown Modal */}
      {showExpenseDropdown && (
        <Indicator visible={showExpenseDropdown} onClose={() => setShowExpenseDropdown(false)}>
          <View className="bg-white rounded-2xl mx-4 w-full max-h-96">
            <View className="px-4 py-4 border-b border-gray-200">
              <Text className="text-gray-900 text-lg font-semibold">Select Expense Name</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} className="max-h-80">
              {expenseNames.map((name, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleExpenseNameSelect(name)}
                  className={`px-4 py-4 border-b border-gray-100 ${
                    expenseName === name ? 'bg-red-50' : ''
                  }`}
                >
                  <Text className={`text-base ${
                    expenseName === name ? 'text-red-500 font-semibold' : 'text-gray-900'
                  }`}>
                    {name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Indicator>
      )}

      {/* Date Picker Modal */}
      {showDatePicker && (
        <Indicator visible={showDatePicker} onClose={() => setShowDatePicker(false)}>
          <View className="bg-white rounded-2xl p-4 mx-4">
            <DateTimePicker
              mode="single"
              date={date}
              onChange={handleDateSelect}
            />
            <TouchableOpacity 
              onPress={() => setShowDatePicker(false)}
              className="bg-red-500 rounded-lg py-3 mt-4"
            >
              <Text className="text-white text-center text-base font-semibold">
                Done
              </Text>
            </TouchableOpacity>
          </View>
        </Indicator>
      )}

      {visible && <Indicator visible={visible} onClose={() => setVisible(false)}>
          <ActivityIndicator size={"large"}/>
        </Indicator>}
    </ComponentWrapper>
  );
};

export default AddExpenseForm;