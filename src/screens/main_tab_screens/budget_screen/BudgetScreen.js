import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Globe, Building2, Plus } from 'lucide-react-native';
import {ShoppingBasket, Truck , Theater, Ambulance, GraduationCap, BrickWall} from 'lucide-react-native'
import AppHeader from '../../../components/AppHeader';    
import ComponentWrapper from '../../../components/ComponentWrapper';
import { useNavigation } from '@react-navigation/native';
import PrimaryButton from '../../../components/PrimaryButton';
import { get_monthly_budget } from '../ScreensAPI';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import BudgetPieChartComparison from '../../../components/BudgetPieChartComparison';


const category = {
  "Essential(Needs)": ShoppingBasket,
  "Discretionary(Wants)": Theater,
  "Savings": BrickWall,
}




const BudgetScreen = () => {

  const [budgetList, setBudgetList] = useState([]);
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalWants, setTotalWants] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);
  const [totalEssential, setTotalEssential] = useState(0);


  const handleGetBudgets = () => {


    get_monthly_budget("all", res => {
      if(res){
        let totalSavings = 0;
        let totalEssential = 0;
        let totalWants = 0;
        res?.data?.budgetData?.forEach(item => {
          if(item.category == "Essential(Needs)"){
            totalEssential += Number(item.amount)
          }else if(item.category == "Savings"){
            totalSavings += Number(item.amount);
          }else{
            totalWants += Number(item.amount);
          }
        });

        const tempList = [
          {
            id: 1,
            icon: ShoppingBasket,
            iconBg: 'bg-blue-100',
            iconColor: '#3B82F6',
            title: "Essential(Needs)",
            amount: totalEssential,
            category: "",
            type: ""
          },
          {
            id: 2,
            icon: Theater,
            iconBg: 'bg-blue-100',
            iconColor: '#3B82F6',
            title: "Discretionary(Wants)",
            amount: totalWants,
            category: "",
            type: ""
          },
          {
            id: 3,
            icon: BrickWall,
            iconBg: 'bg-blue-100',
            iconColor: '#3B82F6',
            title: "Savings",
            amount: totalSavings,
            category: "",
            type: ""
          }
          
        ];

        setTotalBudget(totalEssential+totalSavings+totalWants);
        setTotalEssential(totalEssential);
        setTotalSavings(totalSavings);
        setTotalWants(totalWants);
        setBudgetList(tempList)
      }
    })
  }



  useFocusEffect(
    useCallback(() => {
      handleGetBudgets()
    }, [])
  )
  

  const navigation = useNavigation()
  const BudgetItem = ({ item }) => (
    <TouchableOpacity className="bg-white rounded-[7px] mb-3 p-3 ">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View className={`w-10 h-10 ${item.iconBg} rounded-full items-center justify-center mr-4`}>
            {item.icon && <item.icon size={20} color={item.iconColor} />}
          </View>
          <Text className="text-base font-medium text-gray-900 flex-1">
            {item.title}
          </Text>
        </View>
        <Text className="text-base font-semibold text-gray-900">
           £{item.amount?.toFixed(0)}
        </Text>
      </View>
    </TouchableOpacity>
  );
 
  return (
    <ComponentWrapper headerComponent={() => <AppHeader middle={()=><Text className="text-white font-archivo-semi-bold text-2xl">{"Budget Planner"}</Text>}/>} bg_color='bg-[#1976D2]'>
        <View className="flex-1">

        <View className="flex-row items-center justify-between pt-6 pb-4">
            <Text className="text-2xl font-archivo-semi-bold text-gray-900">
                Budget Plan
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("MonthlyBudgetComponent")}>
                <Text className="text-blue-500 text-base font-archivo-semi-bold">
                All
                </Text>
            </TouchableOpacity>
        </View>
        <Text className="font-archivo-semi-bold text-black text-sm mb-3">Begin with 50-30-20 budgeting rules (50% for your essentials, 30% for your wants and 20% for savings) </Text>
        <ScrollView showsVerticalScrollIndicator={false}>
    
            {/* Budget Items List */}
            <View className="mt-2 mb-3">
            {budgetList.map((item) => (
                <BudgetItem key={item.id} item={item} />
            ))}
            </View>

            <BudgetPieChartComparison 
              optimum={{ essential: 50, discretionary: 30, savings: 20 }}
              //current={{ essential: Math.round((totalEssential*100)/totalBudget), discretionary: Math.round((totalWants*100)/totalBudget), savings: Math.round((totalSavings*100)/totalBudget) }}
              current={{essential: totalEssential, discretionary: totalWants, savings: totalSavings}}
            />
        
            
            <View className="mx-4 mt-8 mb-6">
                <Text className="text-xl font-archivo-semi-bold text-gray-900 mb-4 text-center">
                    Optimize Your Budget with AI
                </Text>
                
                <Text className="text-gray-600 font-inter-regular text-center text-sm leading-6 mb-6 px-2">
                    Let our AI analyze your budget and suggest personalized improvements to help you achieve your financial goals.
                </Text>
            </View>
            <PrimaryButton
                bgColor='bg-[#1976D2]'
                text='Start Budget Review'
                onPress={()=> navigation.navigate("BudgetAnalytics")}
            />
            <View className="flex-row justify-end">
                <TouchableOpacity onPress={()=> navigation.navigate("BudgetFormComponent")} className="bg-[#1976D2] w-1/2 rounded-[5px] p-3 mt-4 mb-6 flex-row items-center justify-center ">
                    <View className="w-5 h-5 bg-white rounded-full mr-3 flex-col items-center justify-center">
                        <Text className="text-[#2E7D32] font-bold text-lg h-7">+</Text>
                    </View>
                    <Text className="text-white font-archivo-semi-bold text-lg">
                        Add New a Budget
                    </Text>
                </TouchableOpacity>
            </View>
            </ScrollView>
        </View>
    </ComponentWrapper>
  );
};

export default BudgetScreen;