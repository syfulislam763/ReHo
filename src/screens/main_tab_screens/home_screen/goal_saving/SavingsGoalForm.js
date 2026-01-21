import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch, ScrollView, ActivityIndicator } from 'react-native';
import { ChevronDown, Calendar, Clock, MapPin, InfoIcon } from 'lucide-react-native';
import AppHeader from '../../../../components/AppHeader';
import ComponentWrapper from '../../../../components/ComponentWrapper';
import { useNavigation } from '@react-navigation/native';
import Indicator from '../../../../components/Indicator';
import { post_saving_goal, update_saving_goal } from '../../ScreensAPI';
import ToastMessage from '../../../../constants/ToastMessage';
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import { useRoute } from '@react-navigation/native';
import { convertToISO } from '../../../../utils/utils';

const SavingsGoalForm = () => {
  const [goalName, setGoalName] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [monthlyTarget, setMonthlyTarget] = useState('');
  const [date, setDate] = useState(dayjs());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentValue, setCurrentValue] = useState(0);

  const route = useRoute();


  const [visible, setVisible] = useState(false);

  const repeatOptions = ['Monthly', 'Yearly'];
  const navigation = useNavigation();

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

  useEffect(() => {
    if(route.params?.isEdit){
      const iso = convertToISO(route?.params?.date);
      setDate(dayjs(iso))
      setGoalName(route.params?.title);
      setCurrentValue(route.params?.currentAmount+"");
      setTotalAmount(route.params?.targetAmount+"");
      setMonthlyTarget(route.params?.monthlyTarget+"");
    }
  }, [])

  const handleSavingGoal = () => {
    const payload = {
      name: goalName,
      totalAmount: Number(totalAmount),
      monthlyTarget: Number(monthlyTarget),
      date: formatDateForPayload(date),
      savedMoney: currentValue
    }

    console.log(payload);

    setVisible(true);

    if(route.params?.isEdit){
      update_saving_goal(payload, route.params?.id, res => {
        if(res){
          ToastMessage("success", "Savings goal updated successfully!", 2000);
          navigation.goBack();
        }else{
          
        }
        setVisible(false);
      })
    }else{

      post_saving_goal(payload, res => {
        if(res){
          //success
          console.log("created", JSON.stringify(res, null, 2));
          ToastMessage("success", "Savings goal added successfully!", 2000);
          navigation.goBack();
        }else{
          //failed
          //ToastMessage("error", "Failed to add savings goal", 2000);
        }
        setVisible(false);
      })

    }
  }

  return (
    <ComponentWrapper title={route.params?.isEdit?"Edit Savings Goal":'Add Savings Goal'} bg_color='bg-[#2E7D32]' >
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="">
            
            {/* Goal Name Field */}
            <View className="mb-6">
            <Text className="text-lg font-archivo-semi-bold text-gray-900 mb-3">
                Goal Name
            </Text>
            <TextInput
                className="bg-white rounded-[5px] px-4 py-4 text-lg text-gray-900"
                placeholder="Enter goal name"
                placeholderTextColor="#9CA3AF"
                value={goalName}
                onChangeText={setGoalName}
            />
            </View>

            {/* Total Goal Amount Field */}
            <View className="mb-6">
              <Text className="text-lg font-archivo-semi-bold text-gray-900 mb-3">
                  Current Savings Amount
              </Text>
              <TextInput
                  className="bg-white rounded-[5px] px-4 py-4 text-lg text-gray-900"
                  placeholder="Enter total amount"
                  placeholderTextColor="#9CA3AF"
                  value={currentValue}
                  onChangeText={setCurrentValue}
                  keyboardType="numeric"
              />
            </View>

            <View className="mb-6">
              <Text className="text-lg font-archivo-semi-bold text-gray-900 mb-3">
                  Total Goal Amount
              </Text>
              <TextInput
                  className="bg-white rounded-[5px] px-4 py-4 text-lg text-gray-900"
                  placeholder="Enter total amount"
                  placeholderTextColor="#9CA3AF"
                  value={totalAmount}
                  onChangeText={setTotalAmount}
                  keyboardType="numeric"
              />
            </View>

            {/* Monthly Saving Target */}
            <View className="mb-6">
            <Text className="text-lg font-archivo-semi-bold text-gray-900 mb-3">
                Monthly Saving Target
            </Text>
            <View className="flex-row space-x-3">
                <View className="flex-1">
                <View className="bg-white rounded-[5px] px-4 py-4 flex-row items-center">
                    <TextInput
                      className="flex-1 text-lg text-gray-900"
                      placeholder="Enter monthly target"
                      placeholderTextColor="#9CA3AF"
                      value={monthlyTarget}
                      onChangeText={setMonthlyTarget}
                      keyboardType='numeric'
                    />
                </View>
                </View>
            </View>
            </View>

            {/* Start Date Field */}
            <View className="mb-6">
              <Text className="text-lg font-archivo-semi-bold text-gray-900 mb-3">
                Start Date
              </Text>
              <TouchableOpacity 
                onPress={() => setShowDatePicker(true)}
                className="bg-white rounded-[5px] px-4 py-4 flex-row items-center"
              >
                  <Calendar size={20} color="#9CA3AF" className="mr-3" />
                  <Text className="flex-1 text-lg text-gray-900 ml-3">
                    {formatDateForDisplay(date)}
                  </Text>
              </TouchableOpacity>
            </View>

            {/* Save Button */}
            <TouchableOpacity 
              onPress={handleSavingGoal} 
              className="bg-[#2E7D32] rounded-[5px] py-3 items-center"
            >
            <Text className="text-white text-lg font-semibold">
                Save
            </Text>
            </TouchableOpacity>

        </View>
        </ScrollView>

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
                className="bg-[#2E7D32] rounded-lg py-3 mt-4"
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

export default SavingsGoalForm;