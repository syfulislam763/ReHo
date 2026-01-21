import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import ComponentWrapper from '../../../components/ComponentWrapper';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronDown } from 'lucide-react-native';

const ContactFormScreen = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    additionalAttendees: '',
    age: '',
    hasChildren: true,
    householdIncome: 'Less than £50k',
    investments: 'Less than £50K',
    investmentValue: '15000',
    whatToDiscuss: 'Pensions and investment',
    whyReachingOut: '',
    askYouThis: '',
    bestContact: 'Email',
    title: '',
    number: ''
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const [incomeDropdown, setIncomeDropdown] = useState(false);
  const [bestMethodDropdown, setBestMethodDropdown] = useState(false);
  const contactOptions = [
    'Number',
    'Email',
  ]
  const incomeOptions = [
    'Less than £50k',
    '£50k - £100k',
    '£100k - £200k',
    '£200k and above'
  ]

  const householdValue = {
    'Less than £50k': 40,
    '£50k - £100k':65,
    '£100k - £200k': 110,
    '£200k and above': 210
  }
  const repeatOptions = [
    'Pensions and investment',
    'Tax advice',
    'Savings advice',
    'Life insurance, critical illness cover',
    'Retirement Advice/Options',
    'Inheritance tax planning'
  ]

  const navigation = useNavigation()

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleChildrenSelect = (value) => {
    setFormData(prev => ({ ...prev, hasChildren: value }));
  };

  const handleInvestmentSelect = (value, n) => {
    setFormData(prev => ({ ...prev, investments: value, investmentValue: String(n) }));
  };

  const handleContinue = () => {
    console.log("form", formData)
    navigation.navigate("TimeSelector", {formData: {...formData, householdIncome: householdValue[formData.householdIncome]}})
  };

  return (
    <ComponentWrapper title='Book Appointment' bg_color='bg-[#5055ba]'>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView 
          className="flex-1 bg-gray-200" 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ 
            flexGrow: 1, 
            paddingBottom: Platform.OS === 'android' ? 200 : 20 
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="">
            <View className="mb-4">
              <Text className="text-gray-800 text-base mb-2 font-medium">Title</Text>
              <TextInput
                className="bg-white border border-gray-300 rounded-md px-3 py-4 text-gray-800"
                value={formData.title}
                onChangeText={(value) => handleInputChange('title', value)}
                placeholder=""
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <View className="mb-4">
              <Text className="text-gray-800 text-base mb-2 font-medium">Name</Text>
              <TextInput
                className="bg-white border border-gray-300 rounded-md px-3 py-4 text-gray-800"
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                placeholder=""
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-800 text-base mb-2 font-medium">Email</Text>
              <TextInput
                className="bg-white border border-gray-300 rounded-md px-3 py-4 text-gray-800"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                placeholder=""
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
              />
            </View>
            <View className="mb-4">
              <Text className="text-gray-800 text-base mb-2 font-medium">Number</Text>
              <TextInput
                className="bg-white border border-gray-300 rounded-md px-3 py-4 text-gray-800"
                value={formData.number}
                onChangeText={(value) => handleInputChange('number', value)}
                placeholder=""
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View className="mb-6">
              <Text className="text-gray-800 text-base mb-2 font-medium">
                  Best method of contact
              </Text>
              <TouchableOpacity
                  className="bg-white rounded-[5px] px-4 py-4 flex-row items-center justify-between"
                  onPress={() => setBestMethodDropdown(!bestMethodDropdown)}
              >
                  <Text className="text-lg text-gray-900">{formData.bestContact}</Text>
                  <ChevronDown size={20} color="#6B7280" />
              </TouchableOpacity>
              
              {bestMethodDropdown && (
                  <View className="bg-white rounded-[5px] mt-2 shadow-sm">
                  {contactOptions.map((option, index) => (
                      <TouchableOpacity
                      key={index}
                      className={`px-4 py-3 border-b border-gray-100 ${
                        formData.bestContact === option ? 'bg-blue-50' : ''
                      }`}
                      onPress={() => {
                          handleInputChange('bestContact', option)
                          setBestMethodDropdown(false);
                      }}
                      >
                      <Text className={`text-lg ${
                        formData.bestContact === option ? 'text-[#1976D2] font-semibold' : 'text-gray-900'
                      }`}>
                        {option}
                      </Text>
                      </TouchableOpacity>
                  ))}
                  </View>
              )}
            </View>

            <View className="mb-4">
              <Text className="text-gray-800 text-base mb-2 font-medium">Additional Attendees:</Text>
              <TextInput
                className="bg-white border border-gray-300 rounded-md px-3 py-4 text-gray-800"
                value={formData.additionalAttendees}
                onChangeText={(value) => handleInputChange('additionalAttendees', value)}
                placeholder=""
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-800 text-base mb-2 font-medium">Your Age</Text>
              <TextInput
                className="bg-white border border-gray-300 rounded-md px-3 py-4 text-gray-800"
                value={formData.age}
                onChangeText={(value) => handleInputChange('age', value)}
                placeholder=""
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-800 text-base mb-3 font-medium">
                Do You Have Children?
              </Text>
              <TouchableOpacity 
                className="flex-row items-center mb-2"
                onPress={() => handleChildrenSelect(true)}
              >
                <View className="w-5 h-5 rounded-full border-2 border-gray-400 mr-3 items-center justify-center">
                  {formData.hasChildren === true && (
                    <View className="w-3 h-3 rounded-full bg-blue-600" />
                  )}
                </View>
                <Text className="text-gray-800 text-base">Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="flex-row items-center mb-2"
                onPress={() => handleChildrenSelect(false)}
              >
                <View className="w-5 h-5 rounded-full border-2 border-gray-400 mr-3 items-center justify-center">
                  {formData.hasChildren === false && (
                    <View className="w-3 h-3 rounded-full bg-blue-600" />
                  )}
                </View>
                <Text className="text-gray-800 text-base">No</Text>
              </TouchableOpacity>
            </View>

            {/* <View className="mb-4">
              <Text className="text-gray-800 text-base mb-2 font-medium">What is your approx. Household Income?</Text>
              <TextInput
                className="bg-white border border-gray-300 rounded-md px-3 py-4 text-gray-800"
                value={formData.householdIncome}
                onChangeText={(value) => handleInputChange('householdIncome', value)}
                placeholder=""
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              />
            </View> */}
            <View className="mb-6">
              <Text className="text-gray-800 text-base mb-2 font-medium">
                  What is your approximate Household Income?
              </Text>
              <TouchableOpacity
                  className="bg-white rounded-[5px] px-4 py-4 flex-row items-center justify-between"
                  onPress={() => setIncomeDropdown(!incomeDropdown)}
              >
                  <Text className="text-lg text-gray-900">{formData.householdIncome}</Text>
                  <ChevronDown size={20} color="#6B7280" />
              </TouchableOpacity>
              
              {incomeDropdown && (
                  <View className="bg-white rounded-[5px] mt-2 shadow-sm">
                  {incomeOptions.map((option, index) => (
                      <TouchableOpacity
                      key={index}
                      className={`px-4 py-3 border-b border-gray-100 ${
                        formData.householdIncome === option ? 'bg-blue-50' : ''
                      }`}
                      onPress={() => {
                          handleInputChange('householdIncome', option)
                          setIncomeDropdown(false);
                      }}
                      >
                      <Text className={`text-lg ${
                        formData.householdIncome === option ? 'text-[#1976D2] font-semibold' : 'text-gray-900'
                      }`}>
                        {option}
                      </Text>
                      </TouchableOpacity>
                  ))}
                  </View>
              )}
            </View>




            <View className="mb-4">
              <Text className="text-gray-800 text-base mb-3 font-medium">
                How much do you hold in investments?
              </Text>
              <TouchableOpacity 
                className="flex-row items-center mb-2"
                onPress={() => handleInvestmentSelect('Less than £50K', 15000)}
              >
                <View className="w-5 h-5 border-2 border-gray-400 mr-3 items-center justify-center">
                  {formData.investments === 'Less than £50K' && (
                    <Text className="text-blue-600 font-bold text-sm">✓</Text>
                  )}
                </View>
                <Text className="text-gray-800 text-base">Less than £50K</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="flex-row items-center mb-2"
                onPress={() => handleInvestmentSelect('£50K-£200K', 100000)}
              >
                <View className="w-5 h-5 border-2 border-gray-400 mr-3 items-center justify-center">
                  {formData.investments === '£50K-£200K' && (
                    <Text className="text-blue-600 font-bold text-sm">✓</Text>
                  )}
                </View>
                <Text className="text-gray-800 text-base">£50K-£200K</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="flex-row items-center mb-2"
                onPress={() => handleInvestmentSelect('£200K', 200001)}
              >
                <View className="w-5 h-5 border-2 border-gray-400 mr-3 items-center justify-center">
                  {formData.investments === '£200K' && (
                    <Text className="text-blue-600 font-bold text-sm">✓</Text>
                  )}
                </View>
                <Text className="text-gray-800 text-base">£200K</Text>
              </TouchableOpacity>
            </View>

            {/* <View className="mb-4">
              <Text className="text-gray-800 text-base mb-2 font-medium">What Would You Like to Discuss?</Text>
              <TextInput
                className="bg-white border border-gray-300 rounded-md px-3 py-3 text-gray-800"
                value={formData.whatToDiscuss}
                onChangeText={(value) => handleInputChange('whatToDiscuss', value)}
                placeholder=""
                placeholderTextColor="#9CA3AF"
                multiline={true}
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View> */}
            
            <View className="mb-6">
              <Text className="text-gray-800 text-base mb-2 font-medium">
                  What Would You Like to Discuss?
              </Text>
              <TouchableOpacity
                  className="bg-white rounded-[5px] px-4 py-4 flex-row items-center justify-between"
                  onPress={() => setShowDropdown(!showDropdown)}
              >
                  <Text className="text-lg text-gray-900">{formData.whatToDiscuss}</Text>
                  <ChevronDown size={20} color="#6B7280" />
              </TouchableOpacity>
              
              {showDropdown && (
                  <View className="bg-white rounded-[5px] mt-2 shadow-sm">
                  {repeatOptions.map((option, index) => (
                      <TouchableOpacity
                      key={index}
                      className={`px-4 py-3 border-b border-gray-100 ${
                        formData.whatToDiscuss === option ? 'bg-blue-50' : ''
                      }`}
                      onPress={() => {
                          handleInputChange('whatToDiscuss', option)
                          setShowDropdown(false);
                      }}
                      >
                      <Text className={`text-lg ${
                        formData.whatToDiscuss === option ? 'text-[#1976D2] font-semibold' : 'text-gray-900'
                      }`}>
                        {option}
                      </Text>
                      </TouchableOpacity>
                  ))}
                  </View>
              )}
            </View>

            <View className="mb-4">
              <Text className="text-gray-800 text-base mb-2 font-medium">Why Are You Reaching Out Now?</Text>
              <TextInput
                className="bg-white border border-gray-300 rounded-md px-3 py-3 text-gray-800"
                value={formData.whyReachingOut}
                onChangeText={(value) => handleInputChange('whyReachingOut', value)}
                placeholder=""
                placeholderTextColor="#9CA3AF"
                multiline={true}
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-800 text-base mb-2 font-medium">I'll Ask You This</Text>
              <TextInput
                className="bg-white border border-gray-300 rounded-md px-3 py-3 text-gray-800"
                value={formData.askYouThis}
                onChangeText={(value) => handleInputChange('askYouThis', value)}
                placeholder=""
                placeholderTextColor="#9CA3AF"
                multiline={true}
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity 
              className="bg-[#5055ba] py-4 rounded-md mt-4 mb-8"
              onPress={() => handleContinue()}
            >
              <Text className="text-white text-center font-semibold text-base">
                Continue
              </Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ComponentWrapper>
  );
};

export default ContactFormScreen;