import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { PiggyBank } from 'lucide-react-native';
import Svg, { Circle } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';


const pig = require("../../../../assets/img/pig.jpeg")


const SavingsGoalCard = ({ 
  title = "Savings Goals", 
  amount = "£300", 
  progress = 60,
  onPress = ()=>{},
  container_style = 'bg-green-50 rounded-2xl p-3 mx-6 border-[1px] border-green-100'
}) => {
  // Circle properties
  const radius = 28;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const navigation = useNavigation();
  return (
    <Pressable onPress={onPress} className={`${container_style} relative overflow-hidden`}>
      {/* Background Image */}
      <View className="absolute inset-0 opacity-20">
        <Image
          source={pig}
          style={{
            objectFit: 'cover'
          }}
          className="h-full w-full"
        />
      </View>

      {/* Header with Icon and Progress Circle */}
      <View className="flex-row justify-between items-center relative z-10">
        {/* Left Side - Icon and Title */}
        <View className="flex-1">
          {/* Icon Container */}
          <View className="mb-1">
            <View 
              className="w-10 h-10 rounded-full items-center justify-center"
              style={{ backgroundColor: '#10B98115' }}
            >
              <PiggyBank 
                size={20} 
                color="#10B981"
                strokeWidth={2}
              />
            </View>
          </View>
          
          {/* Title */}
          <Text className="text-gray-700 text-xl font-archivo-extra-bold">
            {title}
          </Text>

            <Text className="text-2xl font-archivo-regular text-gray-800">
                {amount}
            </Text>
        </View>

        {/* Right Side - Progress Circle */}
        <View className="items-center justify-center">
          <View style={{ width: 70, height: 70 }}>
            <Svg width="70" height="70" style={{ position: 'absolute' }}>
              {/* Background Circle */}
              <Circle
                cx="35"
                cy="35"
                r={radius}
                stroke="white"
                strokeWidth={strokeWidth}
                fill="none"
              />
              {/* Progress Circle */}
              <Circle
                cx="35"
                cy="35"
                r={radius}
                stroke="#10B981"
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90 35 35)"
              />
            </Svg>
            {/* Percentage Text */}
            <View 
              className="absolute inset-0 items-center justify-center"
              style={{ width: 70, height: 70 }}
            >
              <Text className="text-gray-800 text-sm font-semibold">
                {progress}%
              </Text>
            </View>
          </View>
        </View>
      </View>

    </Pressable>
  );
};

export default SavingsGoalCard;