import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ComponentWrapper from '../../../../components/ComponentWrapper';
import Card from './Card';
import { useRoute } from '@react-navigation/native';
import { useAuth } from '../../../../context/AuthProvider';


const LoanDetailComponent = () => {
    const navigation = useNavigation();
    const {userProfile, isSubscribed} = useAuth();

    const route = useRoute()
  return (
    <ComponentWrapper title='Debt Management' bg_color='bg-[#FFA950]' >
        <View className="flex-1">
        {/* Student Loan Card */}
        
        <Card loanData={route.params}/>
        {/* Optimize Button */}
        {true?//isSubscribed
          <TouchableOpacity onPress={() => navigation.navigate("AISuggestionsComponent")} className="bg-orange-400 rounded-[5px] py-3 px-6 shadow-sm">
            <Text className="text-white text-lg font-semibold text-center">
            Optimize debt with ReHo
            </Text>
        </TouchableOpacity>:
        <TouchableOpacity onPress={() => navigation.navigate("PremiumFinancialAdvice")} className="bg-orange-400 rounded-[5px] py-3 px-6 shadow-sm">
            <Text className="text-white text-lg font-semibold text-center">
            Optimize debt with ReHo
            </Text>
        </TouchableOpacity>
        }
        </View>
    </ComponentWrapper>
  );
};

export default LoanDetailComponent;