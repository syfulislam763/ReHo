import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AppHeader from '../../../components/AppHeader';
import { useNavigation } from '@react-navigation/native';
import PrimaryButton from '../../../components/PrimaryButton';
import dayjs from 'dayjs';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useRoute } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import Indicator from '../../../components/Indicator';
import { ActivityIndicator } from 'react-native';
import { create_appointments } from '../ScreensAPI';
import ToastMessage from '../../../constants/ToastMessage';



const TimeSelector = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedTime, setSelectedTime] = useState('10:00 AM - 10:30 AM');
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const navigation = useNavigation();
  const route = useRoute();

  const timeSlots = [
    '9:00 AM - 9:30 AM',
    '10:00 AM - 10:30 AM', 
    '10:30 AM - 11:00 AM',
    '11:00 AM - 11:30 AM',
    '1:00 PM - 1:30 PM',
    '2:00 PM - 2:30 PM',
    '3:00 PM - 3:30 PM'
  ];

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };


  const [visible, setVisible] = useState(false);

  const handleSubmit = () => {
    const payload = {
      date: dayjs(selectedDate).format('YYYY-MM-DD'),
      timeSlot: selectedTime,
      title: route.params.formData.title,
      number: route.params.formData.number,
      bestContact: route.params.formData.bestContact,
      name: route.params.formData.name,
      email: route.params.formData.email,
      attendant: route.params.formData.additionalAttendees,
      isChild: route.params.formData.hasChildren,
      approxIncome: Number(route.params.formData.householdIncome),
      investment: Number(route.params.formData.investmentValue),
      discuss: route.params.formData.whatToDiscuss,
      reachingFor: route.params.formData.whyReachingOut,
      ask: route.params.formData.askYouThis,
    };

    console.log('Payload:', JSON.stringify(payload, null, 2));

    setVisible(true);


    create_appointments(payload, res => {
      if(res ){
        setVisible(false);
        ToastMessage("success", "Appointment Booked!", 2000, () => {
          navigation.dispatch(state => {
            const routes = state.routes.slice(0, -2);

            routes.push({
                name:"ProfileScreen",
            });

            return CommonActions.reset({
                ...state,
                index: routes.length-1,
                routes
            })
            
        })
        })
      }else{
        setVisible(false);
      }

      
    })



    
    
  
    // navigation.navigate('NextScreen', payload);
  };

  const getDaysInMonth = () => {
    const startOfMonth = currentMonth.startOf('month');
    const endOfMonth = currentMonth.endOf('month');
    const daysInMonth = endOfMonth.date();
    const startDay = startOfMonth.day();
    
    const days = [];
    
    // Add empty slots for days before month starts
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    
    // Add all days in month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(currentMonth.date(i));
    }
    
    return days;
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(currentMonth.subtract(1, 'month'));
  };

  const goToNextMonth = () => {
    setCurrentMonth(currentMonth.add(1, 'month'));
  };

  const isToday = (date) => {
    return date && date.isSame(dayjs(), 'day');
  };

  const isSelected = (date) => {
    return date && date.isSame(selectedDate, 'day');
  };

  const isPastDate = (date) => {
    return date && date.isBefore(dayjs(), 'day');
  };

  const TimeButton = ({ time, isSelected }) => (
    <TouchableOpacity
      className={`px-6 py-3 rounded-full mr-3 mb-3 ${
        isSelected 
          ? 'bg-[#4F55BA]' 
          : 'bg-gray-100'
      }`}
      onPress={() => handleTimeSelect(time)}
    >
      <Text 
        className={`text-base font-medium ${
          isSelected 
            ? 'text-white' 
            : 'text-gray-800'
        }`}
      >
        {time}
      </Text>
    </TouchableOpacity>
  );

  const DayButton = ({ date }) => {
    if (!date) {
      return <View style={{ width: '14.28%', aspectRatio: 1 }} />;
    }

    const today = isToday(date);
    const selected = isSelected(date);
    const past = isPastDate(date);

    return (
      <View style={{ width: '14.28%', aspectRatio: 1, padding: 4 }}>
        <TouchableOpacity
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 100,
            backgroundColor: selected ? '#6C63FF' : 'transparent',
          }}
          onPress={() => !past && handleDateSelect(date)}
          disabled={past}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: '500',
              color: selected ? '#FFFFFF' : past ? '#D1D5DB' : '#000000',
            }}
          >
            {date.date()}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const days = getDaysInMonth();
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <SafeAreaView className="flex-1 bg-[#4F55BA]">
      <StatusBar style="light" backgroundColor="#4F55BA" />
      <View className="px-5 pb-4">
        <AppHeader 
          left={() => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ChevronLeft size={28} color="white" />
            </TouchableOpacity>
          )}
          middle={() => (
            <Text className="text-white font-inter-regular text-lg">
              Book Appointment
            </Text>
          )}
        />
      </View>
      <View className="h-full bg-white">
        <ScrollView className="px-5" showsVerticalScrollIndicator={false}>
          <Text className="text-center font-archivo-regular text-2xl my-4">
            Select Date & Time
          </Text>

          {/* Date Picker Section */}
          <View className="mb-6">
            <View className="bg-white rounded-2xl px-4 py-6">
              {/* Month Navigation */}
              <View className="flex-row items-center justify-between mb-6">
                <Text className="text-2xl font-semibold text-gray-900">
                  {currentMonth.format('MMMM YYYY')}
                </Text>
                
                <View className="flex-row items-center">
                  <TouchableOpacity 
                    onPress={goToPreviousMonth}
                    className="p-2 mr-2"
                  >
                    <ChevronLeft size={24} color="#9CA3AF" />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    onPress={goToNextMonth}
                    className="p-2"
                  >
                    <ChevronRight size={24} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Divider */}
              <View className="h-[1px] bg-gray-200 mb-4" />

              {/* Week Day Headers */}
              <View className="flex-row mb-4">
                {weekDays.map((day, index) => (
                  <View key={index} style={{ width: '14.28%' }} className="items-center">
                    <Text className="text-gray-400 text-sm font-medium">
                      {day}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Calendar Grid */}
              <View className="flex-row flex-wrap">
                {days.map((date, index) => (
                  <DayButton key={index} date={date} />
                ))}
              </View>
            </View>
            
            {/* Display Selected Date */}
            <View className="mt-4 bg-indigo-50 rounded-xl p-4">
              <Text className="text-[#4F55BA] font-semibold">
                Selected Date: {dayjs(selectedDate).format('MMMM D, YYYY')}
              </Text>
            </View>
          </View>

          {/* Time Slot Section */}
          <View className="mb-6">
            <Text className="text-xl font-semibold text-gray-900 mb-4">
              Select Time Slot
            </Text>
          
            <View className="flex-row flex-wrap">
              {timeSlots.map((time, index) => (
                <TimeButton 
                  key={index}
                  time={time}
                  isSelected={selectedTime === time}
                />
              ))}
            </View>
            
            {/* Display Selected Time */}
            <View className="mt-4 bg-indigo-50 rounded-xl p-4">
              <Text className="text-[#4F55BA] font-semibold">
                Selected Time: {selectedTime}
              </Text>
            </View>
          </View>

          {/* Submit Button */}
          <View className="mb-20">
            <PrimaryButton 
              text='Submit Appointment'
              bgColor='bg-[#4F55BA]'
              onPress={handleSubmit}
            />
          </View>
        </ScrollView>
      </View>



      {visible && <Indicator visible={visible} onClose={() => setVisible(false)}>

          <ActivityIndicator size={"large"}/>
        
        </Indicator>}
    </SafeAreaView>
  );
};

export default TimeSelector;