import React, { use, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { ChevronLeft, ChevronRight, Calendar, MapPin, Repeat, Clock } from 'lucide-react-native';
import { useAuth } from '../../../context/AuthProvider';
import { get_formated_time } from '../ScreensAPI';

const FinancialCalendar = () => {
  const [selectedTab, setSelectedTab] = useState('Date Night'); // 'Date Night' or 'Expenses'
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const {financialForecast} = useAuth()

  // Get current month/year info
  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  //console.log(JSON.stringify(financialForecast, null, 2), "fore")

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


  const [dateNightEvents, setDateNightEvents] = useState([]);
  const [expenseEvents, setExpenseEvents] = useState([]);
  const [dayEvents, setDayEvents] = useState([]);


  useEffect(() => {
    if(financialForecast?.dateNights){
      console.log(JSON.stringify(financialForecast?.dateNights, null, 2))
      const temp = financialForecast?.dateNights?.map(item => {
        const d = get_formated_time(item.date)
        const date = d.month+" "+d.day+", " + d.year;
        return {
          title: item.plan,
          date: date,
          time: item?.time,
          amount: '£'+item.budget,
          type: item.repeatEvery,
          hasLocation: true
        }

      })
      setDateNightEvents(temp)
    }



    if(financialForecast?.expenses){
      const temp = financialForecast?.expenses?.map(item => {
        const d = get_formated_time(item.endDate)
         const date = d.month+" "+d.day+", " + d.year;
        return {
          title: item.name,
          date: date,
          time: d.time,
          amount: '£'+item.amount,
          type: item.amount,
          hasLocation: true,
          icon: Calendar
        }

      })
      setExpenseEvents(temp)
    }

    if(financialForecast?.appointments){
      const temp = financialForecast?.appointments?.map(item => {
        return item.date
      })
      setDayEvents(temp)
    }



  }, [financialForecast])




  




  const renderCalendarDay = (day, weekIndex, dayIndex, events=[]) => {
    if (!day) return <View key={`${weekIndex}-${dayIndex}`} className="flex-1" />;
    
    // const isSelected = day === selectedDate;
    const isSelected = false
    const isToday = day === today.getDate() && 
                   currentMonth === today.getMonth() && 
                   currentYear === today.getFullYear();

    const event_d = currentYear+"-"+(currentMonth+1)+"-"+day;

    const hasEvent = events.includes(event_d) // Sample event days
    
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

  const renderDateNightEvent = (event, index) => (
    <View key={index} className="bg-gray-50 rounded-xl border-[1px] border-[#E8E9FC] p-4 mb-3">
      <View className="flex-row items-center">
        {/* Calendar Icon */}
        <View className="w-10 h-10 bg-indigo-100 rounded-lg items-center justify-center mr-3">
          <Calendar size={20} color="#6366F1" />
        </View>
        
        {/* Event Details */}
        <View className="flex-1">
          <Text className="text-gray-900 font-inter-semi-bold text-base mb-1">
            {event.title}
          </Text>
          <Text className="text-gray-600 text-sm mb-2">
            <Text className="font-inter-semi-bold">{event.date} </Text> {event.time}
          </Text>
          
          {/* Type and Location Row */}
          <View className="flex-row items-center">
            <View className="flex-row items-center mr-4">
              <Repeat size={14} color="#9CA3AF" />
              <Text className="text-gray-500 font-archivo-regular text-sm ml-1">{event.type}</Text>
            </View>
            
          </View>
        </View>
        
        {/* Amount */}
        <View className="items-end flex-col justify-between h-16">
            <Text className="text-gray-900 font-inter-regular text-lg">
             {event.amount}
            </Text>
            {event.hasLocation && (
              <View className="flex-row items-center">
                <MapPin size={14} color="#6366F1" />
                <Text className="text-indigo-600 font-inter-regular text-sm ml-1">Location</Text>
              </View>
            )}
        </View>
      </View>
    </View>
  );

  const renderExpenseEvent = (event, index) => {
    const IconComponent = event.icon;
    
    return (
      <View key={index} className="bg-gray-50 rounded-xl p-4 mb-3">
        <View className="flex-row items-center">
          {/* Calendar Icon */}
          <View className="w-10 h-10 bg-indigo-100 rounded-lg items-center justify-center mr-3">
            <IconComponent size={20} color="#6366F1" />
          </View>
          
          {/* Event Details */}
          <View className="flex-1">
            <Text className="text-gray-900 font-inter-semi-bold text-base mb-1">
              {event.title}
            </Text>
            <Text className="text-gray-600 font-inter-regular text-sm">
              {event.date}
            </Text>
          </View>
          
          {/* Amount */}
          <Text className="text-red-500 font-inter-regular text-lg">
            {event.amount}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white">
      <View className="mx-8 py-6 pb-20">
        {/* Header */}
        <Text className="text-gray-900 text-2xl font-archivo-regular mb-6">
          Upcoming Financial
        </Text>

        {/* Tab Buttons */}
        <View className="flex-row mb-6">
          <TouchableOpacity
            className={`px-5 py-3 rounded-[10px] mr-3 ${
              selectedTab === 'Date Night'
                ? 'bg-indigo-600'
                : 'bg-transparent border border-indigo-600'
            }`}
            onPress={() => setSelectedTab('Date Night')}
          >
            <Text
              className={`text-sm font-inter-regular ${
                selectedTab === 'Date Night'
                  ? 'text-white'
                  : 'text-indigo-600'
              }`}
            >
              Date Night
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className={`px-5 py-3 rounded-[10px] ${
              selectedTab === 'Expenses'
                ? 'bg-indigo-600'
                : 'bg-transparent border border-indigo-600'
            }`}
            onPress={() => setSelectedTab('Expenses')}
          >
            <Text
              className={`text-sm font-inter-regular ${
                selectedTab === 'Expenses'
                  ? 'text-white'
                  : 'text-indigo-600'
              }`}
            >
              Expenses
            </Text>
          </TouchableOpacity>
        </View>

        {/* Calendar Section */}
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
                renderCalendarDay(day, weekIndex, dayIndex, dayEvents)
              )}
            </View>
          ))}
        </View>

        {/* Events List */}
        <View>
          {selectedTab === 'Date Night'
            ? dateNightEvents.map((event, index) => renderDateNightEvent(event, index))
            : expenseEvents.map((event, index) => renderExpenseEvent(event, index))
          }
        </View>
      </View>
    </View>
  );
};

export default FinancialCalendar;