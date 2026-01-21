import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../context/AuthProvider';
import AppHeader from '../../../components/AppHeader';
import BackButtion from '../../../components/BackButtion';
import PrimaryButton from '../../../components/PrimaryButton';
import ComponentWrapper from '../../../components/ComponentWrapper';


const SendExpences = () => {
    const [partnerName, setPartnerName] = useState('');
    const [email, setEmail] = useState('');
    const [relationship, setRelationship] = useState('Wife');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const {setIsAuthenticated} = useAuth()
    const navigation = useNavigation();
    

    const relationshipOptions = ['Wife', 'Husband', 'Partner', 'Fiancé', 'Fiancée'];

    const handleRelationshipSelect = (option) => {
        setRelationship(option);
        setIsDropdownOpen(false);
    };

    return (
        <ComponentWrapper title='Send Expence Information' bg_color='bg-button-bg'>
            <View className="">
            
       
                <View className="mb-4 mt-3">
                    <Text className="text-gray-700 text-lg font-archivo-semi-bold mb-2">
                        Email Title
                    </Text>
                    <TextInput
                    className="border border-gray-300 rounded-lg px-4 py-3.5 text-base text-gray-900 bg-white"
                    value={partnerName}
                    onChangeText={setPartnerName}
                    placeholder="Enter you name"
                    placeholderTextColor="#9CA3AF"
                    />
                </View>

            {/* Email Field */}
                <View className="mb-6">
                    <Text className="text-gray-700 text-lg font-archivo-semi-bold mb-2">
                    Email
                    </Text>
                    <TextInput
                    className="border border-gray-300 rounded-lg px-4 py-3.5 text-base text-gray-400 bg-white"
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    />
                </View>

              

                <PrimaryButton 
                    onPress={()=>{navigation.goBack()}}
                    text='Send Expence'
                />

            </View>
        </ComponentWrapper>
    );
};

export default SendExpences;