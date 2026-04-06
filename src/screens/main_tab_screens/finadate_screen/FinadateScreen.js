import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { ChevronDown, Calendar, Clock, MapPin } from 'lucide-react-native';
import AppHeader from '../../../components/AppHeader';
import ComponentWrapper from '../../../components/ComponentWrapper';
import { useNavigation } from '@react-navigation/native';
import Indicator from '../../../components/Indicator';
import { post_date_night, update_date_night } from '../ScreensAPI';
import ToastMessage from '../../../constants/ToastMessage';
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import { useRoute } from '@react-navigation/native';
import { convertToISO, toISOStringFromDateTime } from '../../../utils/utils';

const SimpleTimePicker = ({ onTimeSelect, onClose }) => {
  const [selectedHour, setSelectedHour] = useState(12);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState('AM');

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const handleDone = () => {
    let hour24 = selectedHour;
    if (selectedPeriod === 'PM' && selectedHour !== 12) {
      hour24 = selectedHour + 12;
    } else if (selectedPeriod === 'AM' && selectedHour === 12) {
      hour24 = 0;
    }
    
    const timeString = `${hour24.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`;
    const displayTime = `${selectedHour}:${selectedMinute.toString().padStart(2, '0')} ${selectedPeriod}`;
    
    onTimeSelect({ time24: timeString, display: displayTime });
    onClose();
  };

  return (
    <View className="bg-white w-full rounded-2xl p-6 mx-4">
      <Text className="text-gray-900 text-xl font-semibold mb-6 text-center">
        Select Time
      </Text>
      
      <View className="flex-row justify-center items-center mb-6">
        {/* Hour Picker */}
        <View className="flex-1 items-center">
          <Text className="text-gray-500 text-sm mb-3">Hour</Text>
          <ScrollView 
            className="h-32" 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 40 }}
          >
            {hours.map((hour) => (
              <TouchableOpacity
                key={hour}
                onPress={() => setSelectedHour(hour)}
                className="py-2"
              >
                <Text className={`text-2xl text-center ${
                  selectedHour === hour 
                    ? 'text-[#1976D2] font-bold' 
                    : 'text-gray-400'
                }`}>
                  {hour}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Minute Picker */}
        <View className="flex-1 items-center mx-2">
          <Text className="text-gray-500 text-sm mb-3">Minute</Text>
          <ScrollView 
            className="h-32" 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 40 }}
          >
            {minutes.map((minute) => (
              <TouchableOpacity
                key={minute}
                onPress={() => setSelectedMinute(minute)}
                className="py-2"
              >
                <Text className={`text-2xl text-center ${
                  selectedMinute === minute 
                    ? 'text-[#1976D2] font-bold' 
                    : 'text-gray-400'
                }`}>
                  {minute.toString().padStart(2, '0')}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Period Picker */}
        <View className="flex-1 items-center">
          <Text className="text-gray-500 text-sm mb-3">Period</Text>
          <View className="h-32 justify-center">
            <TouchableOpacity
              onPress={() => setSelectedPeriod('AM')}
              className="py-3 mb-4"
            >
              <Text className={`text-2xl text-center ${
                selectedPeriod === 'AM' 
                  ? 'text-[#1976D2] font-bold' 
                  : 'text-gray-400'
              }`}>
                AM
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => setSelectedPeriod('PM')}
              className="py-3"
            >
              <Text className={`text-2xl text-center ${
                selectedPeriod === 'PM' 
                  ? 'text-[#1976D2] font-bold' 
                  : 'text-gray-400'
              }`}>
                PM
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Selected Time Display */}
      <View className="bg-gray-100 rounded-lg py-3 mb-4">
        <Text className="text-center text-xl font-semibold text-gray-900">
          {selectedHour}:{selectedMinute.toString().padStart(2, '0')} {selectedPeriod}
        </Text>
      </View>

      {/* Done Button */}
      <TouchableOpacity 
        onPress={handleDone}
        className="bg-[#1976D2] rounded-lg py-3"
      >
        <Text className="text-white text-center text-base font-semibold">
          Done
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const FinadateScreen = () => {
  const [planName, setPlanName] = useState('');
  const [budget, setBudget] = useState('');
  const [repeatEvery, setRepeatEvery] = useState('Monthly');
  const [date, setDate] = useState(dayjs());
  const [time, setTime] = useState(dayjs());
  const [location, setLocation] = useState('');
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [visible, setVisible] = useState(false);

  const repeatOptions = ['Monthly', 'Quarterly', 'Half Yearly or Yearly'];
  const frequencyValue = {
    'Monthly':'Monthly', 
    'Quarterly':'Quarterly', 
    'Half Yearly or Yearly': 'Yearly'
  }
  const navigation = useNavigation();
  const route = useRoute();

  const formatDateForPayload = (date) => {
    return dayjs(date).format('YYYY-MM-DD');
  };

  const formatDateForDisplay = (date) => {
    return dayjs(date).format('MMMM D, YYYY');
  };

  const formatTimeForPayload = (time) => {
    return dayjs(time).format('hh:mm A');
  };

  const formatTimeForDisplay = (time) => {
    return dayjs(time).format('hh:mm A');
  };

  const handleDateSelect = (params) => {
    setDate(dayjs(params.date));
    setShowDatePicker(false);
  };

  const handleCreateDateNight = () => {
    const payload = {
      plan: planName,
      budget: Number(budget),
      repeatEvery: frequencyValue[repeatEvery],
      date: formatDateForPayload(date),
      time: formatTimeForPayload(time),
      location: location,
      sendEmilNotification:notificationEnabled
    }

    setVisible(true);

    if(route.params?.isEdit){
      update_date_night(payload,route.params?.id, res => {
        if(res){
          ToastMessage("success", "Date night updated successfully!", 2000);
          navigation.goBack();
        }else{
          ToastMessage("error", "Failed to add date night", 2000);
        }
        setVisible(false);
      })
    }else{
      post_date_night(payload, res => {
        if(res){
      
          ToastMessage("success", "Date night added successfully!", 2000);
          navigation.goBack();
        }else{
          ToastMessage("error", "Failed to add date night", 2000);
        }
        setVisible(false);
      })
    }
  }

  useEffect(() => {
    if(route.params?.isEdit){
      const ios = convertToISO(route.params?.date);
      setDate(dayjs(ios));
      setRepeatEvery(route.params?.frequency);
      setTime(toISOStringFromDateTime(route.params?.date, route.params?.time));
      setBudget(route.params?.amount + "");
      setPlanName(route.params?.title);
      setLocation(route.params?.location)
    }
  }, [])

  return (
    <ComponentWrapper title={route.params?.isEdit?'Edit Money Chats(date night)':'Money Chats(date night)'} bg_color='bg-[#1976D2]' >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: Platform.OS === 'android' ? 350 : 100 }}
          keyboardShouldPersistTaps="handled"
        >
        <View className="">
            
            <Text className="text-2xl font-archivo-extra-bold text-gray-900 mb-8">
            Set Your Reminder
            </Text>

            <View className="mb-6">
            <Text className="text-lg font-archivo-semi-bold text-gray-900 mb-3">
                Plan
            </Text>
            <TextInput
                className="bg-white rounded-[5px] px-4 py-4 text-lg text-gray-900 "
                placeholder="name"
                placeholderTextColor="#9CA3AF"
                value={planName}
                onChangeText={setPlanName}
            />
            </View>

            <View className="mb-6">
            <Text className="text-lg font-archivo-semi-bold text-gray-900 mb-3">
                Budget
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
                Repeat Every
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
                    className={`px-4 py-3 border-b border-gray-100 ${
                      repeatEvery === option ? 'bg-blue-50' : ''
                    }`}
                    onPress={() => {
                        setRepeatEvery(option);
                        setShowDropdown(false);
                    }}
                    >
                    <Text className={`text-lg ${
                      repeatEvery === option ? 'text-[#1976D2] font-semibold' : 'text-gray-900'
                    }`}>
                      {option}
                    </Text>
                    </TouchableOpacity>
                ))}
                </View>
            )}
            </View>

            <View className="mb-6">
            <Text className="text-lg font-archivo-semi-bold text-gray-900 mb-3">
                Select Date
            </Text>
            <View className="flex-row space-x-3">
                <TouchableOpacity 
                  onPress={() => setShowDatePicker(true)}
                  className="flex-1"
                >
                  <View className="bg-white rounded-[5px] px-4 py-4 flex-row items-center">
                    <Calendar size={20} color="#9CA3AF" className="mr-3" />
                    <Text className="flex-1 text-lg text-gray-900 ml-3">
                      {formatDateForDisplay(date)}
                    </Text>
                  </View>
                </TouchableOpacity>
            </View>
            </View>

            <View className="mb-6">
            <Text className="text-lg font-archivo-semi-bold text-gray-900 mb-3">
                Time
            </Text>
            <TouchableOpacity 
                  onPress={() => setShowTimePicker(true)}
                  className=""
                >
                  <View className="bg-white rounded-[5px] px-4 py-4 flex-row items-center">
                    <Clock size={20} color="#9CA3AF" className="mr-3" />
                    <Text className="flex-1 text-lg text-gray-900 ml-3">
                      {formatTimeForDisplay(time)}
                    </Text>
                  </View>
                </TouchableOpacity>
            </View>

            <View className="mb-6">
            <Text className="text-lg font-archivo-semi-bold text-gray-900 mb-3">
                Location
            </Text>
            <View className="bg-white rounded-[5px] px-4 py-1 flex-row items-center">
                <MapPin size={20} color="#9CA3AF" className="mr-3" />
                <TextInput
                className="flex-1 text-lg text-gray-900 py-2 ml-3"
                placeholder="Location name"
                placeholderTextColor="#9CA3AF"
                value={location}
                onChangeText={setLocation}
                />
            </View>
            </View>

            <View className="mb-8">
            <View className="flex-row items-center justify-between">
                <Text className="text-lg font-archivo-semi-bold text-gray-900">
                  Send email to partner
                </Text>
                <Switch
                value={notificationEnabled}
                onValueChange={setNotificationEnabled}
                trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
                thumbColor={notificationEnabled ? '#FFFFFF' : '#FFFFFF'}
                ios_backgroundColor="#E5E7EB"
                />
            </View>
            </View>

            <TouchableOpacity 
              onPress={handleCreateDateNight} 
              className="bg-blue-500 rounded-[5px] py-3 items-center"
            >
              <Text className="text-white text-lg font-semibold">
                  Save Date Night
              </Text>
            </TouchableOpacity>

        </View>
        </ScrollView>
      </KeyboardAvoidingView>

        {showDatePicker && (
          <Indicator visible={showDatePicker} onClose={() => setShowDatePicker(false)}>
            <View  className="bg-white rounded-2xl p-4">
              <DateTimePicker
                mode="single"
                date={date}
                onChange={handleDateSelect}
              />
              <TouchableOpacity 
                onPress={() => setShowDatePicker(false)}
                className="bg-[#1976D2] rounded-lg py-3 mt-4"
              >
                <Text className="text-white text-center text-base font-semibold">
                  Done
                </Text>
              </TouchableOpacity>
            </View>
          </Indicator>
        )}

        {showTimePicker && (
          <Indicator visible={showTimePicker} onClose={() => setShowTimePicker(false)}>
            <SimpleTimePicker
              onTimeSelect={(timeData) => {
                const [hours, minutes] = timeData.time24.split(':');
                const newTime = dayjs().hour(parseInt(hours)).minute(parseInt(minutes));
                setTime(newTime);
              }}
              onClose={() => setShowTimePicker(false)}
            />
          </Indicator>
        )}

        {visible && <Indicator visible={visible} onClose={() => setVisible(false)}>
          <ActivityIndicator size={"large"}/>
        </Indicator>}
    </ComponentWrapper>
  );
};

export default FinadateScreen;