import React from 'react';
import { View, Text } from 'react-native';
import { GraduationCap } from 'lucide-react-native';

const Card = ({loanData}) => {
  
  
 
  const DetailRow = ({ label, value, isAmount = false }) => (
    <View className="flex-row justify-between items-center py-3">
      <Text className="text-gray-500 text-base">
        {label}
      </Text>
      <Text className={`text-base font-semibold ${isAmount ? 'text-gray-900' : 'text-gray-900'}`}>
        £{value}
      </Text>
    </View>
  );

  return (
    <View className="mb-3">
      <View className="bg-white rounded-[5px]">
        {/* Header */}
        <View className="flex-row items-center justify-center px-6 py-4 border-b border-gray-100">
          {/* <GraduationCap size={24} color="#F59E0B" className="" /> */}
          <Text className="text-gray-900 text-lg font-semibold ml-3">
            {loanData?.name}
          </Text>
        </View>

        {/* Loan Details */}
        <View className="px-6 py-2">
          <DetailRow 
            label="Amount" 
            value={loanData?.amount}
            isAmount={true}
          />
          
          <DetailRow 
            label="Monthly Payment" 
            value={loanData?.monthlyPayment}
            isAmount={true}
          />
          
          {/* <DetailRow 
            label="Interest Rate" 
            value={loanData?.interestRate}
          /> */}
          
          <DetailRow 
            label="Ad-Hoc Payment" 
            value={loanData?.adHocPayment}
            isAmount={true}
          />
          
          <DetailRow 
            label="Due Date" 
            value={loanData?.dueDate}
          />
        </View>

        {/* Breakdown Section */}
        <View className="px-6 py-4 border-t border-gray-100">
          <Text className="text-gray-900 text-lg font-bold mb-3">
            Breakdown
          </Text>
          
          <DetailRow 
            label="Capital Repayment" 
            value={loanData?.capitalRepayment}
            isAmount={true}
          />
          
          <DetailRow 
            label="Interest Repayment" 
            value={loanData?.interestRepayment}
            isAmount={true}
          />
        </View>
      </View>
    </View>
  );
};

export default Card;