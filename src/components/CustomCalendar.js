import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { ChevronLeft, ChevronRight, Calendar, MapPin, Repeat, Clock } from 'lucide-react-native';

const CustomCalendar = () => {
    const [selectedTab, setSelectedTab] = useState('Date Night'); // 'Date Night' or 'Expenses'
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date().getDate());

    // Get current month/year info
    const today = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    // Generate calendar days for current month
    const generateCalendarDays = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    
    // Get first day of week (0 = Sunday, 1 = Monday, etc.)
    // Convert to Monday = 0 format
    let firstWeekDay = firstDayOfMonth.getDay();
    firstWeekDay = firstWeekDay === 0 ? 6 : firstWeekDay - 1;
    
    const calendarDays = [];
    let currentWeek = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstWeekDay; i++) {
        currentWeek.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        currentWeek.push(day);
        
        if (currentWeek.length === 7) {
        calendarDays.push([...currentWeek]);
        currentWeek = [];
        }
    }
    
    // Fill remaining cells in last week
    while (currentWeek.length > 0 && currentWeek.length < 7) {
        currentWeek.push(null);
    }
    
    if (currentWeek.length > 0) {
        calendarDays.push(currentWeek);
    }
    
    return calendarDays;
    };

    const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
    };

    const calendarDays = generateCalendarDays();

    // Events data
    const dateNightEvents = [
    {
        title: 'Family Budget Plan',
        date: 'Mar 16, 2025',
        time: '6:00 PM',
        amount: '£85',
        type: 'monthly',
        hasLocation: true
    },
    {
        title: 'Family Budget Plan',
        date: 'May 11, 2025',
        time: '7:00 PM',
        amount: '£25',
        type: 'yearly',
        hasLocation: true
    }
    ];

    const expenseEvents = [
    {
        title: 'Weekly Shopping',
        date: 'Jul 3, 2024',
        amount: '-£350',
        icon: Calendar
    },
    {
        title: 'Electricity Bill',
        date: 'July 15, 2025',
        amount: '-£500',
        icon: Calendar
    }
    ];

    const renderCalendarDay = (day, weekIndex, dayIndex) => {
    if (!day) return <View key={`${weekIndex}-${dayIndex}`} className="flex-1" />;
    
    const isSelected = day === selectedDate;
    const isToday = day === today.getDate() && 
                    currentMonth === today.getMonth() && 
                    currentYear === today.getFullYear();
    const hasEvent = false //day === 1 || day === 11 || day === 16; // Sample event days
    
    return (
        <TouchableOpacity
        key={`${weekIndex}-${dayIndex}`}
        className="flex-1 items-center justify-center h-10"
        onPress={() => setSelectedDate(day)}
        >
        <View
            className={`w-8 h-8 rounded-full items-center justify-center ${
            isSelected
                ? 'bg-indigo-600'
                : hasEvent
                ? 'bg-indigo-600'
                : isToday
                ? 'bg-indigo-200'
                : 'bg-transparent'
            }`}
        >
            <Text
            className={`text-sm font-medium ${
                isSelected || hasEvent
                ? 'text-white'
                : isToday
                ? 'text-indigo-700'
                : 'text-gray-700'
            }`}
            >
            {day}
            </Text>
        </View>
        </TouchableOpacity>
    );
    };



    return (
    <View className="bg-white rounded-2xl p-4 mb-6 shadow shadow-neutral-200 border-gray-100">
        {/* Month Header */}
        <View className="flex-row items-center justify-between mb-4">
        <Text className="text-gray-900 font-semibold text-base">
            {monthNames[currentMonth]} {currentYear}
        </Text>
        <View className="flex-row">
            <TouchableOpacity className="p-2" onPress={() => navigateMonth(-1)}>
            <ChevronLeft size={20} color="#6B7280" />
            </TouchableOpacity>
            <TouchableOpacity className="p-2" onPress={() => navigateMonth(1)}>
            <ChevronRight size={20} color="#6B7280" />
            </TouchableOpacity>
        </View>
        </View>

        {/* Days of Week Header */}
        <View className="flex-row mb-2">
        {daysOfWeek.map((day, index) => (
            <View key={index} className="flex-1 items-center py-2">
            <Text className="text-gray-500 text-xs font-medium">
                {day}
            </Text>
            </View>
        ))}
        </View>

        {/* Calendar Grid */}
        {calendarDays.map((week, weekIndex) => (
        <View key={weekIndex} className="flex-row">
            {week.map((day, dayIndex) => 
            renderCalendarDay(day, weekIndex, dayIndex)
            )}
        </View>
        ))}
    </View>
    );
}


export default CustomCalendar;
