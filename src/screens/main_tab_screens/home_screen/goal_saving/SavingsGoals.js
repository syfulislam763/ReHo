import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Pressable
} from 'react-native';
import ComponentWrapper from '../../../../components/ComponentWrapper';
import SavingsGoalCard from '../SavingsGoalCard';
import PrimaryButton from '../../../../components/PrimaryButton';
import { useNavigation } from '@react-navigation/native';
import { Circle } from 'lucide-react-native';
import { useRoute } from '@react-navigation/native';
import { get_formated_time, get_saving_goals, delete_saving_goal } from '../../ScreensAPI';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import Indicator from '../../../../components/Indicator';
import { ActivityIndicator } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Trash2 } from 'lucide-react-native';
import ToastMessage from '../../../../constants/ToastMessage';
import { useAuth } from '../../../../context/AuthProvider';
import { get_analytics } from '../../ScreensAPI';

const SavingsGoals = () => {
    const route = useRoute();
    const [savingGoalsList, setSavingGoalsList] = useState([]);
    const [visible, setVisible] = useState(false);
    const {setFinancialForecast, setUserProfile, userProfile, setIsSubscribed, setSubscriptionInfo, loginVideoUrl} = useAuth()  
    const handleGetSavingGoalsList = () => {
      setVisible(true);

      get_saving_goals(res => {
        if(res){
          const temp = res.data.goals.map(item => {
            const d = get_formated_time(item.completeDate)
            return {
                id: item._id,
                title: item.name,
                date: d.month+" "+d.day+ ", "+d.year,
                currentAmount: item.savedMoney,
                targetAmount: item.totalAmount,
                icon: '',
                progress:  item.completionRation,
                monthlyTarget: item.monthlyTarget
            }
          })

          setSavingGoalsList(temp)
        }

        setVisible(false);
      })
    }

    const handleGetHistory = () => {
      get_analytics((res) => {
          if(res){
              setUserProfile(res?.data);
          }else{

          }
      })       
    }

    useFocusEffect(
      useCallback(() => {
          handleGetHistory()
      }, [savingGoalsList])
    )

    const handleDeleteSavingGoal = (id) => {
      setVisible(true);
      
      delete_saving_goal(id, res => {
        if(res){
          const updatedList = savingGoalsList.filter(item => item.id !== id);
          setSavingGoalsList(updatedList);
          ToastMessage("success", "Deleted successfully!", 2000);
          
        }else{
          ToastMessage("error", "Failed to delete", 2000);
        }
        setVisible(false);
      })
    }

    const renderRightActions = (id) => {
      return (
        <TouchableOpacity
          onPress={() => handleDeleteSavingGoal(id)}
          className="bg-red-500 justify-center items-center px-6 rounded-r-[7px] mb-3"
          style={{ opacity: 0.9 }}
        >
          <Trash2 color="white" />
        </TouchableOpacity>
      );
    };

    useFocusEffect(
      useCallback(() => {
        handleGetSavingGoalsList()
      }, [])
    )

  const navigation = useNavigation()

  const renderSavingItem = ({ item }) => (
    <Swipeable
      renderRightActions={() => renderRightActions(item.id)}
      overshootRight={false}
      rightThreshold={40}
    >
      <Pressable onPress={() => navigation.navigate("SavingsGoalForm", {isEdit:true, ...item})} className="bg-white rounded-[7px] p-4 mb-3">
        {/* Header with icon and title */}
        <View className="flex-row items-center mb-2">
          {/* <View className="w-10 h-10 rounded-lg bg-orange-100 items-center justify-center mr-3">
            <Text className="text-lg">{item.icon}</Text>
          </View> */}
          <View className="flex-1">
            <Text className="text-gray-900 text-lg font-semibold">{item.title}</Text>
            <Text className="text-gray-500 text-sm">{item.date}</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View className="mb-3">
          <View className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <View 
              className="h-full bg-green-600 rounded-full"
              style={{ width: `${item.progress}%` }}
            />
          </View>
        </View>

        {/* Amount Display */}
        <View className="flex-row justify-between items-center">
          <Text className="text-gray-900 text-base font-medium">
            £{item.currentAmount.toFixed(0)}
          </Text>
          <Text className="text-gray-900 text-base font-medium">
            £{item.targetAmount.toLocaleString()}
          </Text>
        </View>
      </Pressable>
    </Swipeable>
  );

  return (
    <ComponentWrapper title='Saving Plans' bg_color='bg-[#2E7D32]'>
      <SavingsGoalCard amount={Number(userProfile?.totalSavedMoney)? '£'+ Number(userProfile?.totalSavedMoney).toFixed(0): '£'+0} progress={parseInt(userProfile?.savingGoalCompletionRate) || 0} container_style='bg-green-50 rounded-[7px] p-3 border-[1px] border-green-100'/>
      <FlatList
        data={savingGoalsList}
        renderItem={renderSavingItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />
      
      {/* Add Saving Goal Button */}
      <View className="flex-row justify-end">
          <TouchableOpacity onPress={()=> navigation.navigate("SavingsGoalForm")} className="bg-[#2E7D32] rounded-[5px] px-3 py-3 mt-4 mb-3 flex-row items-center justify-center ">
            <View className="w-6 h-6 bg-white rounded-full mr-3 flex-col items-center justify-center">
              <Text className="text-[#2E7D32] font-bold text-lg h-7">+</Text>
            </View>
            <Text className="text-white font-semibold text-lg">
              Add a savings plan
            </Text>
        </TouchableOpacity>
      </View>

      <PrimaryButton 
        text='Calculate Savings'
        bgColor='bg-[#2E7D32]'
        onPress={() => navigation.navigate("FinancialForm")}
      />
      <View className="h-12"/>

      {visible && <Indicator visible={visible} onClose={() => setVisible(false)}>
          <ActivityIndicator size={"large"}/>
      </Indicator>}
    </ComponentWrapper>
  );
};

export default SavingsGoals;