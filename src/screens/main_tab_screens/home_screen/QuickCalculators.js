import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { TrendingUp, Calculator } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const QuickCalculators = () => {

  const navigation = useNavigation()
  const calculators = [
    {
      title: 'Inflation Impact',
      description: 'For future costs.',
      icon: TrendingUp,
      iconColor: '#8B5CF6',
      bgColor: 'bg-[#EFF0FD80]',
      borderColor: 'border-purple-100',
      route: "FutureValueCalculator"
    },
    {
      title: 'Debt Management',
      description: 'Estimate payments.',
      icon: Calculator,
      iconColor: '#8B5CF6',
      bgColor: 'bg-[#EFF0FD80]',
      borderColor: 'border-purple-100',
      route: "DebtManagement"
    }
  ];

  const renderCalculator = (calculator, index) => {
    const IconComponent = calculator.icon;
    
    return (
      <TouchableOpacity 
        key={index}
        className={`${calculator.bgColor} ${calculator.borderColor} rounded-2xl p-4 flex-1 mx-1`}
        style={{ minHeight: 130 }}
        onPress={() => navigation.navigate(calculator.route)}
      >
        {/* Icon Container */}
        <View className="mb-5">
          <View 
            className="w-12 h-12 rounded-full items-center justify-center"
            style={{ backgroundColor: `${calculator.iconColor}20` }}
          >
            <IconComponent 
              size={24} 
              color={calculator.iconColor}
              strokeWidth={2}
            />
          </View>
        </View>

        {/* Title */}
        <Text className="text-gray-800 text-lg font-archivo-semi-bold mb-1 leading-tight">
          {calculator.title}
        </Text>

        {/* Description */}
        <Text className="text-gray-500 font-inter-regular text-sm leading-tight">
          {calculator.description}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className="bg-white px-6 py-4">
      {/* Header */}
      <Text className="text-gray-800 text-lg font-archivo-semi-bold mb-4">
        Quick Calculators
      </Text>

      {/* Calculator Cards Row */}
      <View className="flex-row">
        {calculators.map((calculator, index) => 
          renderCalculator(calculator, index)
        )}
      </View>
    </View>
  );
};

export default QuickCalculators;