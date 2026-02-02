import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList, Pressable } from 'react-native';
import { Calendar, RotateCcw, MapPin } from 'lucide-react-native';
import AppHeader from '../../../components/AppHeader';
import ComponentWrapper from '../../../components/ComponentWrapper';
import { useNavigation } from '@react-navigation/native';
import Indicator from '../../../components/Indicator';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { ActivityIndicator } from 'react-native';
import { get_date_night, delete_date_night, get_formated_time } from '../ScreensAPI';
import { Swipeable } from 'react-native-gesture-handler';
import { Trash2 } from 'lucide-react-native';
import ToastMessage from '../../../constants/ToastMessage';

const BudgetListComponent = () => {
  const [visible, setVisible] = useState(false);
  const [dateNightList, setDateNightList] = useState([]);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');

  const navigation = useNavigation();

  const handleGetDateNight = () => {
    setVisible(true);

    get_date_night(res => {
      if(res){
    
        const temp = res.data.map(item => {
          const d = get_formated_time(item.date);
           
          return {
            id: item._id,
            title: item.plan,
            amount: item.budget,
            date: d.month + " ," + d.day + " " + d.year,
            time: item.time,
            frequency: item.repeatEvery,
            location: item.location,
            userId: item.userId,
            frequencyIcon: RotateCcw
          }
        });

        setDateNightList(temp);
      }

      setVisible(false);
    });
  };

  const handleDelete = (id) => {
    setVisible(true);

    delete_date_night(id, res => {
      if(res){
        const updatedList = dateNightList.filter(item => item.id !== id);
        setDateNightList(updatedList);
        ToastMessage("success", "Deleted successfully!", 2000);
      }else{
        ToastMessage("error", "Failed to delete", 2000);
      }
      setVisible(false);
    });
  };

  const handleLocationClick = (location) => {
    setSelectedLocation(location);
    setShowLocationModal(true);
  };

  const renderRightActions = (id) => {
    return (
      <TouchableOpacity
        onPress={() => handleDelete(id)}
        className="bg-red-500 justify-center items-center px-6 rounded-r-[7px] mb-3"
        style={{ opacity: 0.9 }}
      >
        <Trash2 color="white" />
      </TouchableOpacity>
    );
  };

  useFocusEffect(
    useCallback(() => {
      handleGetDateNight();
    }, [])
  );

  const BudgetCard = ({ item }) => (
    <Swipeable
      renderRightActions={() => renderRightActions(item.id)}
      overshootRight={false}
      rightThreshold={40}
    >
      <Pressable onPress={() => navigation.navigate("FinadateScreen", {isEdit:true, ...item})} className="bg-white rounded-[7px] mb-3 p-4">
        <View className="flex-row justify-between items-start mb-1">
          <Text className="text-lg font-archivo-semi-bold text-gray-900 flex-1">
            {item.title}
          </Text>
          <Text className="text-lg font-archivo-semi-bold text-gray-900">
            {item.amount}
          </Text>
        </View>
        
        <View className="flex-row items-center mb-3">
          <View className="w-6 h-6 bg-blue-100 rounded-md items-center justify-center mr-3">
            <Calendar size={16} color="#3B82F6" />
          </View>
          <Text className="text-gray-600 text-sm">
            {item.date}
          </Text>
          <Text className="text-gray-400 text-sm ml-2">
            {item.time}
          </Text>
        </View>

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <item.frequencyIcon size={14} color="#9CA3AF" className="mr-2" />
            <Text className="text-gray-400 text-sm ml-2">
              {item.frequency}
            </Text>
          </View>
          
          <TouchableOpacity 
            onPress={() => handleLocationClick(item.location)}
            className="flex-row items-center"
          >
            <MapPin size={16} color="#3B82F6" className="mr-1" />
            <Text className="text-blue-500 text-sm ml-1">
              Location
            </Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Swipeable>
  );

  return (
    <ComponentWrapper 
      headerComponent={() => (
        <AppHeader 
          middle={() => (
            <Text className="text-white font-archivo-semi-bold text-2xl">
              Money Chats
            </Text>
          )}
        />
      )} 
      bg_color='bg-[#1976D2]'
    >
      <View className="flex-1">
        <FlatList
          data={dateNightList}
          renderItem={({ item }) => <BudgetCard item={item} />}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 100 }}
        />
        
        {/* Add New Budget Button */}
        <View className="flex-row justify-end">
          <TouchableOpacity 
            onPress={() => navigation.navigate("FinadateScreen")} 
            className="bg-[#1976D2] w-1/2 rounded-[5px] p-3 mt-4 mb-6 flex-row items-center justify-center"
          >
            <View className="w-6 h-6 bg-white rounded-full mr-3 flex-col items-center justify-center">
              <Text className="text-[#1976D2] font-bold text-lg h-7">+</Text>
            </View>
            <Text className="text-white font-archivo-semi-bold text-lg">
              Add New Date
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Location Modal */}
      {showLocationModal && (
        <Indicator visible={showLocationModal} onClose={() => setShowLocationModal(false)}>
          <View className="bg-white rounded-2xl p-6 mx-4">
            <View className="flex-row items-center mb-4">
              <MapPin size={24} color="#3B82F6" />
              <Text className="text-gray-900 text-xl font-archivo-semi-bold ml-3">
                Location Details
              </Text>
            </View>
            <Text className="text-gray-700 text-base font-inter-regular mb-6">
              {selectedLocation}
            </Text>
            <TouchableOpacity 
              onPress={() => setShowLocationModal(false)}
              className="bg-[#1976D2] rounded-lg py-3"
            >
              <Text className="text-white text-center text-base font-semibold">
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </Indicator>
      )}

      {visible && (
        <Indicator onClose={() => setVisible(false)} visible={visible}>
          <ActivityIndicator size={"large"} />
        </Indicator>
      )}
    </ComponentWrapper>
  );
};

export default BudgetListComponent;