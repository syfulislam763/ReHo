import React, { useEffect, useRef } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Bell, Star } from 'lucide-react-native';
import ComponentWrapper from '../../../components/ComponentWrapper';
import { useAuth } from '../../../context/AuthProvider';

const NotificationsFeedScreen = () => {
  const {notifications, authToken} = useAuth()

  const notificationRef = useRef(null);

  //console.log(JSON.stringify(notifications, null, 2))


 
  const NotificationItem = ({ notification }) => (
    <View className="flex-row px-4 py-3 mb-3 bg-white">
      <View className="mr-3 mt-1">
        {notification.icon === 'bell' ? (
          <Bell size={20} color="#8B5CF6" />
        ) : (
          <Star size={20} color="#8B5CF6" />
        )}
      </View>
      
      <View className="flex-1">
        <View className="flex-row justify-between items-center">
          <Text className="text-gray-900 text-base font-semibold mb-1">
            {notification.title}
          </Text>
          {notification?.section == "Recent" && <Text className="bg-green-600 h-2 w-2 rounded-full">

          </Text>}
        </View>
        <Text className="text-gray-600 text-sm leading-5 mb-2">
          {notification.description}
        </Text>
        <Text className="text-indigo-500 text-sm">
          {notification.time}
        </Text>
      </View>
    </View>
  );

  const SectionHeader = ({ title }) => (
    <Text className="text-gray-900 text-lg font-semibold px-4 py-3 bg-gray-100">
      {title}
    </Text>
  );

  const todayNotifications = notifications.filter(n => n.section === 'Recent');
  const yesterdayNotifications = notifications.filter(n => n.section === 'Old');

  return (
    <ComponentWrapper bg_color='bg-[#5055ba]' title='Notification'>
        <ScrollView className="flex-1 bg-gray-100" showsVerticalScrollIndicator={false}>
        {/* Today Section */}



        {/* {todayNotifications?.length != 0 && <SectionHeader title="Recent" />} */}
        

        <View className="bg-white">
          {todayNotifications.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </View>

        {/* Yesterday Section */}
        {/* {yesterdayNotifications?.length != 0 && <SectionHeader title="Old" />} */}
        <View className="bg-white">
          {yesterdayNotifications.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </View>
      </ScrollView>
    </ComponentWrapper>
  );
};

export default NotificationsFeedScreen;