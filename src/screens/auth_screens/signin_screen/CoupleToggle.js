import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';

const CoupleToggle = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [animatedValue] = useState(new Animated.Value(0));

  const toggleSwitch = () => {
    const toValue = isEnabled ? 0 : 1;
    
    Animated.timing(animatedValue, {
      toValue,
      duration: 200,
      useNativeDriver: false,
    }).start();
    
    setIsEnabled(!isEnabled);
  };

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 26], // Adjust based on your toggle size
  });

  return (
    <View className="flex-row items-center justify-between py-4 bg-white">
      <Text className="text-lg font-medium text-gray-900">
        Couple
      </Text>
      
      <TouchableOpacity
        onPress={toggleSwitch}
        activeOpacity={0.8}
        className={`w-14 h-7 rounded-full justify-center px-[1.5px] ${
          isEnabled ? 'bg-violet-950' : 'bg-gray-300'
        }`}
      >
        <Animated.View
          className="w-5 h-5 rounded-full bg-white shadow-sm"
          style={{
            transform: [{ translateX }],
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default CoupleToggle;