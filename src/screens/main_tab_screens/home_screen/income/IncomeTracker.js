import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Image, Pressable } from 'react-native';
import AppHeader from '../../../../components/AppHeader';
import BackButtion from '../../../../components/BackButtion';
import { useNavigation } from '@react-navigation/native';
import { get_incomes, get_formated_time, delete_income } from '../../ScreensAPI';
import Indicator from '../../../../components/Indicator';
import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Swipeable } from 'react-native-gesture-handler';
import { Trash2 } from 'lucide-react-native';
import ToastMessage from '../../../../constants/ToastMessage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';


const icons = {
  'Salary': require("../../../../../assets/income/salary-Income.png"),
  'Bonus': require("../../../../../assets/income/Bonus-Income.png"),
  'Overtime Pay': require("../../../../../assets/income/Overtime-Pay-Income.png"),
  'Rental income': require("../../../../../assets/income/Rental-Income.png"),
  'Investment Income': require("../../../../../assets/income/Investment-Income.png"),
  'Gift': require("../../../../../assets/income/Gift-Income.png"),
  'Other income': require("../../../../../assets/income/Other-Income.png")
}

const IncomeTracker = () => {
  const [activeTab, setActiveTab] = useState('All');
  const navigation = useNavigation()

  const [incomeList, setIncomeList] = useState([]);
  const [filteredIncomeList, setFilteredIncomeList] = useState([])
  const [visible, setVisible] = useState(false);
  const [totalIncome, setTotalIncome] = useState(0)
  
  const freqValidatorRev = {"On-off": 'one-off', "on-off": "One-off"}
  const freqValidator = {"One-off": 'on-off', "one-off": "on-off"}

  const handleGetIncomeList = () => {
    setVisible(true);
    const frequency = freqValidator[activeTab?.toLowerCase()]?freqValidator[activeTab?.toLowerCase()]:activeTab?.toLowerCase();

    get_incomes(frequency, res => {
      if(res){
        const temp = res.data.map(item => {
          const d = get_formated_time(item.receiveDate)
          return {
            id: item._id,
            userId: item.userId,
            title: item.name,
            date: d.month+" "+d.day+", "+d.year,
            amount: Number(item.amount).toFixed(0),
            icon: icons[item.name]?icons[item.name]:'',
            bgColor: 'bg-pink-100',
            frequency: freqValidatorRev[item?.frequency]?freqValidatorRev[item?.frequency]:item?.frequency
          }
        })

        let totalIncome = 0;
        res.data.forEach(item => {
          totalIncome += Number(item.amount);
        });
        setTotalIncome(totalIncome)

        setIncomeList(temp)
        setFilteredIncomeList(temp)
      }else{
        setVisible([])
      }

      setVisible(false);

    })
  }


  useFocusEffect(
    useCallback(() => {
      handleGetIncomeList()
    }, [activeTab])
  )


  const handleTabFilter = (tab) => {
    setFilteredIncomeList(incomeList)
    let totalIncome = 0;
      incomeList.forEach(item => {
        totalIncome += Number(item.amount);
      });
    setTotalIncome(totalIncome)
    setActiveTab(tab)
  }

  const handleDelete = (id) => {

    setVisible(true);

    delete_income(id, res => {
      if(res){
        const updatedList = incomeList.filter(item => item.id !== id);
        const updatedFilteredList = filteredIncomeList.filter(item => item.id !== id);
        
        setIncomeList(updatedList);
        setFilteredIncomeList(updatedFilteredList);
        

        let newTotal = 0;
        updatedList.forEach(item => {
          const amount = parseFloat(item.amount.replace('+£', ''));
          newTotal += amount;
        });
        setTotalIncome(newTotal);
        ToastMessage("success", "Deleted successfuly!", 2000)
      }else{

      }
      setVisible(false);
    })


  }

  const renderRightActions = (id) => {
    return (
      <TouchableOpacity
        onPress={() => handleDelete(id)}
        className="bg-red-500 justify-center items-center px-6 rounded-r-[7px] mb-3"
        style={{ opacity: 0.9 }}
      >
        <Trash2/>
      </TouchableOpacity>
    );
  };

  const tabs = ['All', 'Monthly', 'Yearly', 'One-off'];


   
  return (
    <SafeAreaView className="flex-1 bg-[#2E7D32]">
      <View className="px-5 pb-3">
        <AppHeader
          left={()=> <BackButtion/>}
          middle={() => <Text className="text-white font-archivo-semi-bold text-2xl">Income List</Text>}
        />
      </View>
      
      <View className="h-full px-5 pt-4 bg-[##e7eaef]">
        {/* Monthly Income Header */}
        <View className="bg-[#2E7D32] rounded-2xl p-6 mb-6">
          <Text className="text-white font-inter-regular text-center text-lg font-medium mb-2">
            {activeTab=="All"?"Total":activeTab} Income
          </Text>
          <Text className="text-white text-center text-3xl font-archivo-extra-bold">
            £{Number(totalIncome).toFixed(0)}
          </Text>
        </View>

        {/* Filter Tabs */}
        <View className="flex-row mb-6 rounded-xl p-1 shadow-sm">
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => handleTabFilter(tab)}
              className={`flex-1 py-3 px-3 border-[1px] border-[#2E7D32] m-1 rounded-lg ${
                activeTab === tab 
                  ? 'bg-[#2E7D32]' 
                  : 'bg-transparent'
              }`}
            >
              <Text className={`text-center font-archivo-regular text-sm  ${
                activeTab === tab 
                  ? 'text-white' 
                  : 'text-[#2E7D32]'
              }`}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Income Entries */}
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {filteredIncomeList.map((entry) => (
            <Swipeable
              key={entry.id}
              renderRightActions={() => renderRightActions(entry.id)}
              overshootRight={false}
              rightThreshold={40}
            >
              <Pressable onPress={() => navigation.navigate("AddIncomeForm", {type:"edit", ...entry})} className="bg-[#ffffff] rounded-[7px] p-3 mb-3">
                <View className="flex-row items-center">
                  {/* Icon Container */}
                  <View className={`w-12 h-12 ${entry.bgColor} rounded-xl items-center justify-center mr-4`}>
                    {entry.icon && <Image
                      source={entry.icon}
                      className="w-12 h-12"
                      style={{
                        objectFit:'contain'
                      }}
                    />}
                  </View>
                  
                  {/* Content */}
                  <View className="flex-1">
                    <Text className="text-gray-900 font-inter-semi-bold text-lg mb-1">
                      {entry.title}
                    </Text>
                    <Text className="text-gray-500 font-inter-regular text-sm">
                      {entry.date}
                    </Text>
                  </View>
                  
                  {/* Amount */}
                  <Text className="text-[#2E7D32] font-inter-semi-bold text-lg">
                    {'+£'+entry.amount}
                  </Text>
                </View>
              </Pressable>
            </Swipeable>
          ))}
        </ScrollView>

      
        {/* Add New Income Button */}
        <View className="flex-row justify-end">
            <TouchableOpacity onPress={()=> navigation.navigate("AddIncomeForm")} className="bg-[#2E7D32] w-1/2 rounded-[5px] p-3 mb-20 flex-row items-center justify-center ">
            <View className="w-6 h-6 bg-white rounded-full mr-3 flex-col items-center justify-center">
              <Text className="text-[#2E7D32] font-bold text-lg h-7">+</Text>
            </View>
            <Text className="text-white font-semibold text-lg">
              Add New Income
            </Text>
          </TouchableOpacity>
        </View>
      </View>


      {
        visible && <Indicator onClose={() => setVisible(false)} visible={visible}>
          <ActivityIndicator size={"large"}/>
        </Indicator>
      }
    </SafeAreaView>
  );
};

export default IncomeTracker;