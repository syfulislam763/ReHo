import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Bell } from 'lucide-react-native';
import ComponentWrapper from '../../../components/ComponentWrapper';
import Indicator from '../../../components/Indicator';
import { ActivityIndicator } from 'react-native';
import { get_notification_settings, update_notification_settings } from '../ScreensAPI';
import { useFocusEffect } from '@react-navigation/native';



const FinancialRemindersSettings = () => {
  const [reminders, setReminders] = useState({
    budgetUpdate: true,
    loanPayment: false,
    financialNight: true,
    monthlySummary: false
  });
  const [visible, setVisible] = useState(false);

  const toggleReminder = (key) => {
    const temp = {...reminders}
    temp[key] = !temp[key]
    setReminders(temp);


    const payload = {
      budgetNotification: temp.budgetUpdate,
      debtNotification: temp.loanPayment ,
      dateNightNotification: temp.financialNight,
      appointmentNotification: temp.monthlySummary
    }

    setVisible(true);

    update_notification_settings(payload, res => {
      console.log(res)
      if(res){

      }else{

      }

      setVisible(false);
    })



  };

  const handleGetNotificationSettings = () => {
    setVisible(true);
    get_notification_settings(res => {

      if(res){
        const temp = {
          budgetUpdate: res.data.budgetNotification,
          loanPayment: res.data.debtNotification ,
          financialNight: res.data.dateNightNotification,
          monthlySummary: res.data.appointmentNotification
        }

        setReminders(temp);

      }


      setVisible(false);
    })
  }


  useFocusEffect(
    useCallback(() => {
      handleGetNotificationSettings()
    }, [])
  )



  const ToggleSwitch = ({ isEnabled, onToggle }) => (
    <TouchableOpacity
      className={`w-12 h-6 rounded-full p-1 ${
        isEnabled ? 'bg-indigo-600' : 'bg-gray-300'
      }`}
      onPress={onToggle}
      activeOpacity={0.8}
    >
      <View 
        className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
          isEnabled ? 'translate-x-6' : 'translate-x-0'
        }`}
      />
    </TouchableOpacity>
  );

  const ReminderItem = ({ title, subtitle, isEnabled, onToggle, iconColor = "#9CA3AF" }) => (
    <View className="flex-row items-center justify-between py-4 px-4">
      <View className="flex-row items-center flex-1">
        <Bell size={20} color={iconColor} className="mr-5" />
        <View className="flex-1 ml-5">
          <Text className="text-gray-900 text-base font-medium">
            {title}
          </Text>
          {subtitle && (
            <Text className="text-gray-900 text-base font-medium mt-1">
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      <ToggleSwitch isEnabled={isEnabled} onToggle={onToggle} />
    </View>
  );

  return (
    <ComponentWrapper bg_color='bg-[#5055ba]' title='Financial Reminders'  >
        <View className="">
        <View className="bg-white rounded-lg ">
            {/* Header */}
            <View className="flex-row items-center px-4 py-4 border-b border-gray-100">
            <Bell size={24} color="#6366F1" className="mr-3" />
            <Text className="text-gray-900 text-lg font-semibold ml-4">
                Set Financial Reminders
            </Text>
            </View>

            {/* Reminder Items */}
            <ReminderItem
            title="Budget Update Reminder"
            isEnabled={reminders.budgetUpdate}
            onToggle={() => toggleReminder('budgetUpdate')}
            />

            <ReminderItem
            title="Loan Payment Due Date"
            isEnabled={reminders.loanPayment}
            onToggle={() => toggleReminder('loanPayment')}
            />

            <ReminderItem
            title="Financial Date Night"
            isEnabled={reminders.financialNight}
            onToggle={() => toggleReminder('financialNight')}
            />

            <ReminderItem
              title="Monthly Financial"
              subtitle="Summary Email"
              isEnabled={reminders.monthlySummary}
              onToggle={() => toggleReminder('monthlySummary')}
            />
        </View>
        </View>

        {visible && <Indicator visible={visible} onClose={() => setVisible(false)}>
              <ActivityIndicator size={"large"}/>
            </Indicator>}
    </ComponentWrapper>
  );
};

export default FinancialRemindersSettings;