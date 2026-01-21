import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Lightbulb } from 'lucide-react-native';

const DebtSummaryComponent = ({paymentOrder, debtSummary}) => {
  const paymentSerial = {
    1: 'First',
    2: 'Second',
    3: 'Third'
  }

  const PaymentOrderItem = ({order, item, showPayFirst = false }) => (
    <View className="flex-row items-center justify-between py-4 px-4 border-b border-gray-100">
      <View className="flex-1">
        <Text className="text-gray-900 text-base font-semibold">
          {item.name}
        </Text>
        <Text className="text-gray-500 text-sm mt-1">
          <Text className="text-red-500">{item.interestRate}% Total capital loss</Text>
        </Text>
      </View>
      
      {showPayFirst && (
        <TouchableOpacity className="bg-orange-400 px-4 py-2 rounded-full">
          <Text className="text-white text-sm font-medium">
            Pay {paymentSerial[order]}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const SummaryRow = ({ label, value, isHighlighted = false }) => (
    <View className="flex-row justify-between items-center py-3 px-4">
      <Text className="text-gray-500 text-base">
        {label}
      </Text>
      <Text className={`text-base font-semibold ${
        isHighlighted ? 'text-orange-500' : 'text-gray-900'
      }`}>
        £{value || '0'}
      </Text>
    </View>
  );
  
  return (
    <View className="">
      {/* Suggested Payment Order Card */}
      <View className="bg-white rounded-[5px]  mb-4">
        {/* Header */}
        <View className="flex-row items-center px-4 py-4 border-b border-gray-100">
          <Lightbulb size={24} color="#F59E0B" className="mr-3" />
          <Text className="text-gray-900 text-lg font-semibold">
            Suggested Payment Order
          </Text>
        </View>

        {/* Payment Order List */}
        <View>
          {paymentOrder?.map((item, index) => (
            <PaymentOrderItem 
              key={item.id} 
              item={item} 
              showPayFirst={true}
              order={item.id}
            />
          ))}
        </View>
      </View>
        
      <View className="bg-white rounded-[5px] mb-5">
        {/* Header */}
        <View className="flex-row items-center px-4 py-4 border-b border-gray-100">
          <Lightbulb size={24} color="#F59E0B" className="mr-3" />
          <Text className="text-gray-900 text-lg font-semibold">
            Payment Order Calculation Procedure
          </Text>
        </View>
        
        <Text className="text-green-500 font-archivo-semi-bold text-center py-3">
           Interest Rate = ( (Interest Repayment)/(Capital Repayment + Interest Repayment) ) * 100
        </Text>

        <Text className="text-red-300 font-archivo-semi-bold text-center py-3">
          Debts with highest interest rates presented as ascending order to pay fast
        </Text>
        
      </View>
      {/* Debt Summary Card */}
      <View className="bg-white rounded-[5px]">
        {/* Header */}
        <View className="flex-row items-center px-4 py-4 border-b border-gray-100">
          <Lightbulb size={24} color="#F59E0B" className="mr-3" />
          <Text className="text-gray-900 text-lg font-semibold">
            Debt Summary
          </Text>
        </View>

        {/* Summary Details */}


        <View>
          <SummaryRow 
            label="Total Debt" 
            value={Number(debtSummary?.totalDebt).toFixed(2)}
          />
          <SummaryRow 
            label="Total Capital Repayment" 
            value={Number(debtSummary?.totalCapitalRepayment).toFixed(2)}
          />

          <SummaryRow 
            label="Total Interest Repayment" 
            value={Number(debtSummary?.totalInterestRepayment).toFixed(2)}
          />
          <SummaryRow 
            label="Interest Payment" 
            value={Number(debtSummary?.interestPayment).toFixed(2)}
          />
          
          
          {/* <SummaryRow 
            label="Average Interest Rate" 
            value={debtSummary?.avgInterestRate}
          /> */}
          
          <SummaryRow 
            label="Monthly Payment" 
            value={Number(debtSummary?.monthlyPayment).toFixed(2)}
            isHighlighted={true}
          />
        </View>
      </View>
    </View>
  );
};

export default DebtSummaryComponent;