import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  FlatList,
  Modal
} from 'react-native';
import DebtSummaryComponent from './DebtSummaryComponent';
import PrimaryButton from '../../../../components/PrimaryButton';
import DebtListComponent from './DebtListComponent';
import ComponentWrapper from '../../../../components/ComponentWrapper';
import DebtRecentList from './DebtRecentList';
import Indicator from '../../../../components/Indicator';
import { ActivityIndicator } from 'react-native';
import { get_debts_summary, get_formated_time } from '../../ScreensAPI';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';


const DebtManagement = () => {


  const [suggestedRate, setSuggestedRate]  = useState([]);
  const [debtSummary, setDebtSummary] = useState({
            "totalDebt": 0,
            "totalCapitalRepayment":0,
            "totalInterestRepayment": 0,
            "interestPayment": 0,
            "avgInterestRate": 0,
            "monthlyPayment": 0
        });
  const [recentDebt, setRecentDebt] = useState([]);
  const [visible,setVisible] = useState(false);



  const handleGetSummary = () => {

      setVisible(true);


      get_debts_summary(res => {
        if(res){

          

          const temp1 = res.data.suggestedOrder.map((item, idx) => {
            return {
              id: idx+1,
              name: item.name,
              interestRate: Number(item.interestRate).toFixed(2),
              isPriority: false
            }
          }).sort((a,b) => b.interestRate-a.interestRate)

          

            const temp = res.data.debts.map(item => {
              const d = get_formated_time(item.payDueDate)
              return {
                  ...item,
                  name:  item.name,
                  id: item._id,
                  amount: item.amount,
                  monthlyPayment: item.monthlyPayment,
                  interestRate: '',
                  adHocPayment: item.AdHocPayment,
                  dueDate: d.day+" "+d.month+", "+d.year,
                  capitalRepayment: item.capitalRepayment,
                  interestRepayment: item.interestRepayment
              }
            });
            
            setRecentDebt(temp)
            setDebtSummary(res?.data?.summary);
            setSuggestedRate(temp1);

        }else{

        }

        setVisible(false);
      })



  }



  useFocusEffect(
    useCallback(() => {
      handleGetSummary();
    }, [])
  )


  return (
    <ComponentWrapper title='Debt Management' bg_color='bg-[#FFA950]'>
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
            <DebtSummaryComponent paymentOrder={suggestedRate} debtSummary={debtSummary}/>
            <View className="h-4"/>
            <DebtRecentList data={recentDebt}/>
        </ScrollView>



        {visible && <Indicator visible={visible} onClose={() => setVisible(false)}>
            <ActivityIndicator size={"large"}/>
          </Indicator>}
    </ComponentWrapper>
  );
};

export default DebtManagement;