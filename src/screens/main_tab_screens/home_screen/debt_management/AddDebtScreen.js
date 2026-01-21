import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CommponentWrapper from '../../../../components/ComponentWrapper';
import Indicator from '../../../../components/Indicator';
import { post_debts } from '../../ScreensAPI';
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';

const AddDebtScreen = () => {
    const [newDebt, setNewDebt] = useState({
        name: '',
        amount: '',
        interestRate: '',
        monthlyPayment: '',
        adHocPayment: '',
        capitalRepayment: '',
        interestRepayment: '',
        dueDate: dayjs()
    });

    const [visible, setVisible] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const navigation = useNavigation();

    const handleNameChange = useCallback((text) => {
        setNewDebt(prev => ({...prev, name: text}));
    }, []);

    const handleAmountChange = useCallback((text) => {
        setNewDebt(prev => ({...prev, amount: text}));
    }, []);

    const handleInterestRateChange = useCallback((text) => {
        setNewDebt(prev => ({...prev, interestRate: text}));
    }, []);

    const handleMonthlyPaymentChange = useCallback((text) => {
        setNewDebt(prev => ({...prev, monthlyPayment: text}));
    }, []);

    const handleAdHocPaymentChange = useCallback((text) => {
        setNewDebt(prev => ({...prev, adHocPayment: text}));
    }, []);

    const handleCapitalRepaymentChange = useCallback((text) => {
        setNewDebt(prev => ({...prev, capitalRepayment: text}));
    }, []);

    const handleInterestRepaymentChange = useCallback((text) => {
        setNewDebt(prev => ({...prev, interestRepayment: text}));
    }, []);

    const formatDateForPayload = (date) => {
        return dayjs(date).format('YYYY-MM-DD');
    };

    const formatDateForDisplay = (date) => {
        return dayjs(date).format('MMMM D, YYYY');
    };

    const handleDateSelect = (params) => {
        setNewDebt(prev => ({...prev, dueDate: dayjs(params.date)}));
        setShowDatePicker(false);
    };

    const handleCreateDebt = () => {
        setVisible(true);
        const payload = {
            name: newDebt.name,
            amount: parseInt(newDebt.amount),
            monthlyPayment: parseInt(newDebt.monthlyPayment),
            AdHocPayment: parseInt(newDebt.adHocPayment),
            capitalRepayment: parseInt(newDebt.capitalRepayment),
            interestRepayment: parseInt(newDebt.interestRepayment),
            payDueDate: formatDateForPayload(newDebt.dueDate)
        }

        console.log('Debt Payload:', payload);

        post_debts(payload, (res) => {
            if(res){
                console.log("Debt created", JSON.stringify(res, null, 2));
                navigation.goBack();
            }else{
                
            }
            setVisible(false);
        })
    }

    return (
        <CommponentWrapper title='Add Debt' bg_color='bg-[#FFA950]'>
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <ScrollView contentContainerStyle={{ 
                            flexGrow: 1, 
                            paddingBottom: Platform.OS === 'android' ? 200 : 20 
                          }}
                          keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} className="flex-1">
                    <View className="space-y-4">
                        <View className="mb-4">
                            <Text className="text-gray-800 font-medium mb-2">Debt Name</Text>
                            <TextInput
                                value={newDebt.name}
                                onChangeText={handleNameChange}
                                placeholder="Loan name"
                                className="bg-white rounded-[5px] p-4 text-gray-800"
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>

                        <View className="mb-4">
                            <Text className="text-gray-800 font-medium mb-2">Amount</Text>
                            <TextInput
                                value={newDebt.amount}
                                onChangeText={handleAmountChange}
                                placeholder="£5000"
                                className="bg-white rounded-[5px] p-4 text-gray-800"
                                placeholderTextColor="#9CA3AF"
                                keyboardType="numeric"
                            />
                        </View>

                        <View className="mb-4">
                            <Text className="text-gray-800 font-medium mb-2">Interest Rate%</Text>
                            <TextInput
                                value={newDebt.interestRate}
                                onChangeText={handleInterestRateChange}
                                placeholder="8"
                                className="bg-white rounded-[5px] p-4 text-gray-800"
                                placeholderTextColor="#9CA3AF"
                                keyboardType="numeric"
                            />
                        </View>

                        <View className="mb-4">
                            <Text className="text-gray-800 font-medium mb-2">Monthly Payment</Text>
                            <TextInput
                                value={newDebt.monthlyPayment}
                                onChangeText={handleMonthlyPaymentChange}
                                placeholder="monthly Payment"
                                className="bg-white rounded-[5px] p-4 text-gray-800"
                                placeholderTextColor="#9CA3AF"
                                keyboardType="numeric"
                            />
                        </View>

                        <View className="mb-4">
                            <Text className="text-gray-800 font-medium mb-2">Ad-Hoc Payment</Text>
                            <TextInput
                                value={newDebt.adHocPayment}
                                onChangeText={handleAdHocPaymentChange}
                                placeholder="Ad-hoc Payment"
                                className="bg-white rounded-[5px] p-4 text-gray-800"
                                placeholderTextColor="#9CA3AF"
                                keyboardType="numeric"
                            />
                        </View>

                        <View className="mb-1">
                            <Text className="text-gray-800 font-medium mb-2">Breakdown</Text>
                        </View>

                        <View className="mb-4">
                            <Text className="text-gray-800 font-medium mb-2">Capital Repayment</Text>
                            <TextInput
                                value={newDebt.capitalRepayment}
                                onChangeText={handleCapitalRepaymentChange}
                                placeholder="£15"
                                className="bg-white rounded-[5px] p-4 text-gray-800"
                                placeholderTextColor="#9CA3AF"
                                keyboardType="numeric"
                            />
                        </View>

                        <View className="mb-4">
                            <Text className="text-gray-800 font-medium mb-2">Interest Repayment</Text>
                            <TextInput
                                value={newDebt.interestRepayment}
                                onChangeText={handleInterestRepaymentChange}
                                placeholder="£50"
                                className="bg-white rounded-[5px] p-4 text-gray-800"
                                placeholderTextColor="#9CA3AF"
                                keyboardType="numeric"
                            />
                        </View>

                        <View className="mb-4">
                            <Text className="text-gray-800 font-medium mb-2">Pay Due Date</Text>
                            <TouchableOpacity 
                                onPress={() => setShowDatePicker(true)}
                                className="bg-white rounded-[5px] p-4 flex-row items-center"
                            >
                                <View className="mr-3">
                                    <Text className="text-gray-600 text-lg">📅</Text>
                                </View>
                                <Text className="text-gray-900 text-base flex-1">
                                    {formatDateForDisplay(newDebt.dueDate)}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity 
                            onPress={handleCreateDebt} 
                            className="bg-orange-400 rounded-[5px] py-3 mt-6"
                        >
                            <Text className="text-white font-semibold text-center text-lg">Save</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {showDatePicker && (
                <Indicator visible={showDatePicker} onClose={() => setShowDatePicker(false)}>
                    <View className="bg-white rounded-2xl p-4 mx-4">
                        <DateTimePicker
                            mode="single"
                            date={newDebt.dueDate}
                            onChange={handleDateSelect}
                        />
                        <TouchableOpacity 
                            onPress={() => setShowDatePicker(false)}
                            className="bg-orange-400 rounded-lg py-3 mt-4"
                        >
                            <Text className="text-white text-center text-base font-semibold">
                                Done
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Indicator>
            )}

            {visible && (
                <Indicator visible={visible} onClose={() => setVisible(false)}>
                    <ActivityIndicator size={"large"}/>
                </Indicator>
            )}
        </CommponentWrapper>
    );
};

export default AddDebtScreen;