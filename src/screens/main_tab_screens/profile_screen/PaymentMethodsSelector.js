import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import ComponentWrapper from '../../../components/ComponentWrapper';
import PrimaryButton from '../../../components/PrimaryButton';
import { useNavigation } from '@react-navigation/native';





const paypal = require("../../../../assets/img/paypal.png");
const master_card = require("../../../../assets/img/master_card.png");
const google = require("../../../../assets/img/google.png");
const apple = require("../../../../assets/img/apple.png")

const PaymentMethodsSelector = () => {
  const [selectedMethod, setSelectedMethod] = useState('');

  const navigation = useNavigation()

  const paymentMethods = [
    {
      id: 'PayPal',
      name: 'PayPal',
      logo: 'https://logos-world.net/wp-content/uploads/2020/07/PayPal-Logo.png',
      backgroundColor: 'bg-white'
    },
    {
      id: 'GooglePay',
      name: 'Google Pay',
      logo: 'https://developers.google.com/pay/api/images/brand-guidelines/google-pay-mark.png',
      backgroundColor: 'bg-white'
    },
    {
      id: 'ApplePay',
      name: 'Apple Pay',
      logo: 'https://developer.apple.com/apple-pay/marketing/images/badge-example-1@2x.png',
      backgroundColor: 'bg-white'
    },
    {
      id: 'Mastercard',
      name: 'Mastercard',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg',
      backgroundColor: 'bg-white'
    }
  ];

  const PaymentMethodItem = ({ method, isSelected, onSelect, hasCustomStyle = false }) => (
    <TouchableOpacity
      className={`flex-row items-center justify-between p-4 mb-3 rounded-[5px] ${
        hasCustomStyle 
          ? 'border border-indigo-500 bg-white' 
          : 'bg-white'
      }`}
      onPress={() => onSelect(method.id)}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center flex-1">
        {/* Logo placeholder - using colored circles to represent logos */}
        <View className={`w-8 h-8 mr-4 rounded-full items-center justify-center bg-white`}>
          {method.id === 'PayPal' && (
            <Image
              source={paypal}
              style={{objectFit:'contain'}}
              className="h-8 w-8 rounded-full"
            />
          )}
          {method.id === 'GooglePay' && (
            <Image
              source={google}
              style={{objectFit:'contain'}}
              className="h-8 w-8 rounded-full"
            />
          )}
          {method.id === 'ApplePay' && (
            <Image
              source={apple}
              style={{objectFit:'contain'}}
              className="h-8 w-8 rounded-full"
            />
          )}
          {method.id === 'Mastercard' && (
            <Image
              source={master_card}
              style={{objectFit:'contain'}}
              className="h-8 w-8 rounded-full"
            />
          )}
        </View>
        
        <Text className="text-gray-900 text-base font-medium">
          {method.name}
        </Text>
      </View>

      {/* Radio Button */}
      <View className="w-5 h-5 rounded-full border-2 border-gray-300 items-center justify-center">
        {isSelected && (
          <View className="w-3 h-3 rounded-full bg-indigo-600" />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <ComponentWrapper bg_color='bg-[#5055ba]' title='Payment Method'>
        <View className=" flex-1">
        {paymentMethods.map((method, index) => (
            <PaymentMethodItem
                key={method.id}
                method={method}
                isSelected={selectedMethod === method.id}
                onSelect={setSelectedMethod}
                hasCustomStyle={selectedMethod === method.id }
            />
        ))}

        <View className="mt-10">
            <PrimaryButton 
                text='Continue'
                onPress={() => navigation.navigate("CongratulationsScreen")}
            />
        </View>
        </View>
    </ComponentWrapper>
  );
};

export default PaymentMethodsSelector;