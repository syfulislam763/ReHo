import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import AppHeader from '../../../components/AppHeader';
import BackButtion from '../../../components/BackButtion';
import PrimaryButton from '../../../components/PrimaryButton';
import { useAuth } from '../../../context/AuthProvider';
import { useNavigation } from '@react-navigation/native';
import ComponentWrapper from '../../../components/ComponentWrapper';
import { ActivityIndicator } from 'react-native';
import Indicator from '../../../components/Indicator';
import ToastMessage from '../../../constants/ToastMessage';
import { send_invitations } from '../../main_tab_screens/ScreensAPI';

const PartnerForm = () => {
    const [partnerName, setPartnerName] = useState('');
    const [email, setEmail] = useState('');
    const [relationship, setRelationship] = useState('Wife');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const {setIsAuthenticated} = useAuth()
    const navigation = useNavigation();

    const [visible, setVisible] = useState(false);


    

    const relationshipOptions = ['Wife', 'Husband', 'Fiancé', 'Fiancée'];

    const handleRelationshipSelect = (option) => {
        setRelationship(option);
        setIsDropdownOpen(false);
    };


    const handleSendInvitation = () => {
        const payload = {
            name: partnerName,
            email: email,
            relation: relationship
        }

        console.log(payload, "test")

        setVisible(true);

        send_invitations(payload, res => {
            if(res){
                setPartnerName("")
                setRelationship("");
                setEmail("")
                ToastMessage("success", "Invitation has been sent!", 3000)
            }else{

            }

            setVisible(false);
        })

        //navigation.navigate("SignInScreen")
    }

    return (
        <ComponentWrapper bg_color='bg-[##5055ba]' title='Send Invitation'>

        
            <View className="">
            
              
       
                <View className="mb-4 mt-10">
                    <Text className="text-gray-700 text-lg font-archivo-semi-bold mb-2">
                        Partner's Name
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
                    <Text className="text-black text-lg font-archivo-semi-bold mb-2">
                    Email
                    </Text>
                    <TextInput
                    className="border border-gray-300 rounded-lg px-4 py-3.5 text-base text-black bg-white"
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    />
                </View>

                <View className="mb-14">
                    <Text className="text-gray-700 text-lg font-archivo-semi-bold mb-2">
                    Relationship
                    </Text>
                    <View className="relative">
                    <TouchableOpacity
                        className="border border-gray-300 rounded-lg px-4 py-3.5 bg-white flex-row justify-between items-center"
                        onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        <Text className="text-base text-gray-900">
                        {relationship}
                        </Text>
                        <ChevronDown 
                        size={20} 
                        color="#6B7280"
                        style={{
                            transform: [{ rotate: isDropdownOpen ? '180deg' : '0deg' }]
                        }}
                        />
                    </TouchableOpacity>

                    {/* Dropdown Options */}
                    {isDropdownOpen && (
                        <View className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                        {relationshipOptions.map((option, index) => (
                            <TouchableOpacity
                            key={index}
                            className={`px-4 py-3 ${
                                index < relationshipOptions.length - 1 ? 'border-b border-gray-200' : ''
                            } ${relationship === option ? 'bg-gray-50' : ''}`}
                            onPress={() => handleRelationshipSelect(option)}
                            >
                            <Text className={`text-base ${
                                relationship === option ? 'text-gray-900 font-medium' : 'text-gray-700'
                            }`}>
                                {option}
                            </Text>
                            </TouchableOpacity>
                        ))}
                        </View>
                    )}


                    </View>
                </View>

                <PrimaryButton 
                    onPress={()=>{handleSendInvitation()}}
                    text='Send Invite'
                />

            </View>

            {visible && <Indicator visible={visible} onClose={() => setVisible(false)}>
                    <ActivityIndicator size={"large"}/>
                </Indicator>}
        </ComponentWrapper>
    );
};

export default PartnerForm;