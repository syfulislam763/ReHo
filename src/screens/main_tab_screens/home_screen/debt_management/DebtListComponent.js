import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Pressable, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ComponentWrapper from '../../../../components/ComponentWrapper';
import Card from './Card';
import { get_debts, delete_debts, get_formated_time } from '../../ScreensAPI';
import Indicator from '../../../../components/Indicator';
import ToastMessage from '../../../../constants/ToastMessage';
import { useFocusEffect } from '@react-navigation/native';
import { Swipeable } from 'react-native-gesture-handler';
import { Trash2 } from 'lucide-react-native';

const DebtListComponent = () => {
    const navigation = useNavigation();

    const [debtList, setDebtList] = useState([]);
    const [visible, setVisible] = useState(false);

    const handleGetDebtList = () => {
        setVisible(true);

        get_debts(res => {
            if(res){
                const temp = res.data.map(item => {
                    const d = get_formated_time(item.payDueDate)
                    return {
                        name: item.name,
                        id: item._id,
                        amount: item.amount,
                        monthlyPayment: item.monthlyPayment,
                        interestRate: '',
                        adHocPayment: item.AdHocPayment,
                        dueDate: d.day + " " + d.month + ", " + d.year,
                        capitalRepayment: item.capitalRepayment,
                        interestRepayment: item.interestRepayment
                    }
                });

                setDebtList(temp)
                 
            }else{
                setDebtList([])
            }
            setVisible(false);
        })
    }

    const handleDeleteDebts = (id) => {
        setVisible(true);
        
        delete_debts(id, res => {
            if(res){
                // Remove deleted debt from the list
                const updatedList = debtList.filter(item => item.id !== id);
                setDebtList(updatedList);
                
                ToastMessage("success", "Debt deleted successfully!", 2000);
            }else{
                ToastMessage("error", "Failed to delete debt", 2000);
            }
            setVisible(false);
        })
    }

    useFocusEffect(
        useCallback(() => {
            handleGetDebtList()
        }, [])
    )

    const renderRightActions = (id) => {
        return (
            <TouchableOpacity
                onPress={() => handleDeleteDebts(id)}
                className="bg-red-500 justify-center items-center px-6 rounded-r-lg mb-3"
                style={{ opacity: 0.9 }}
            >
                <Trash2 color="#FFFFFF" size={24} />
            </TouchableOpacity>
        );
    };

    const renderItem = ({ item }) => {
        return (
            <Swipeable
                renderRightActions={() => renderRightActions(item.id)}
                overshootRight={false}
                rightThreshold={40}
            >
                <Pressable 
                    onPress={() => navigation.navigate("LoanDetailComponent", {...item})}
                    className=""
                >
                    <Card loanData={{...item}}/>
                </Pressable>
            </Swipeable>
        );
    }

    return (
        <ComponentWrapper title='Debt Management' bg_color='bg-[#FFA950]'>
            {/* Debt List Header */}
            <View className="flex-row items-center justify-between mb-6">
                <Text className="text-gray-900 text-xl font-semibold">Debt List</Text>
                <TouchableOpacity>
                    <Text className="text-orange-400 font-medium underline">All</Text>
                </TouchableOpacity>
            </View>

            <FlatList 
                data={debtList}
                keyExtractor={(item, idx) => item.id || idx.toString()}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
            />

            {visible && (
                <Indicator visible={visible} onClose={() => setVisible(false)}>
                    <ActivityIndicator size={"large"}/>
                </Indicator>
            )}
        </ComponentWrapper>
    );
};

export default DebtListComponent;