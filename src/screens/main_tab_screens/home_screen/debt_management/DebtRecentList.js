import React from 'react';
import { View, Text, TouchableOpacity, FlatList} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Card from './Card';
import { useAuth } from '../../../../context/AuthProvider';

const DebtRecentList = ({data}) => {
    const navigation = useNavigation()
    const {isSubscribed} = useAuth();

  return (
    <View className="">
      {/* Header with Add New Debt Button */}
      <View className="flex-col justify-end items-end mb-4">

        {isSubscribed? //
          <TouchableOpacity onPress={() => navigation.navigate("AISuggestionsComponent")} className="bg-orange-400 w-full rounded-[5px] py-3 px-6 shadow-sm">
            <Text className="text-white text-lg font-semibold text-center">
              Optimize debt with ReHo
            </Text>
        </TouchableOpacity>:
        <TouchableOpacity onPress={() => navigation.navigate("PremiumFinancialAdvice")} className="bg-orange-400 rounded-[5px] py-3 px-6 shadow-sm">
            <Text className="text-white text-lg font-semibold text-center">
              Optimize debt with ReHo
            </Text>
        </TouchableOpacity>}


        <TouchableOpacity onPress={()=>navigation.navigate("AddDebtScreen")} className="bg-orange-400 rounded-[5px] mt-5 px-4 py-3 flex-row items-center">
          <View className="w-5 h-5 bg-white rounded-full mr-2 items-center justify-center">
            <Text className="text-orange-400 text-lg font-bold h-7">+</Text>
          </View>
          <Text className="text-white font-medium">Add New Debt</Text>
        </TouchableOpacity>
      </View>

      {/* Debt List Header */}
      <View className="flex-row items-center justify-between mb-6">
        <Text className="text-gray-900 text-xl font-semibold">Debt List</Text>
        <TouchableOpacity onPress={()=> navigation.navigate("DebtListComponent")}>
          <Text className="text-orange-400 font-medium underline">All</Text>
        </TouchableOpacity>
      </View>

      {/* Student Loan Card */}

      {data?.map((item, i) => {
        return <Card key={i} loanData={item}/>
      })}
    </View>
  );
};

export default DebtRecentList;