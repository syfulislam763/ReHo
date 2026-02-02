import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { Send, Smile, ArrowDown } from 'lucide-react-native';
import ComponentWrapper from '../../../components/ComponentWrapper';
import { useAuth } from '../../../context/AuthProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CHAT_URL } from '../../../constants/Paths';

const welcome = require("../../../../assets/img/welcome.png");

const ChatUIScreen = () => {
  const [messages, setMessages] = useState([]);
  const { authToken, userProfile } = useAuth();
  const [userMessage, setUserMessage] = useState("");

  const conversationRef = useRef(null);
  const [isConversationSocketConnected, setIsConversationSocketConnected] = useState(false);
  const flatListRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const insets = useSafeAreaInsets();


  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  const startTypingAnimation = () => {
    const createAnimation = (dot, delay) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(dot, {
            toValue: -5,
            duration: 300,
            delay,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 300,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      );
    Animated.parallel([
      createAnimation(dot1, 0),
      createAnimation(dot2, 150),
      createAnimation(dot3, 300),
    ]).start();
  };

  const stopTypingAnimation = () => {
    dot1.stopAnimation();
    dot2.stopAnimation();
    dot3.stopAnimation();
  };

  useEffect(() => {
    if (isTyping) startTypingAnimation();
    else stopTypingAnimation();
  }, [isTyping]);

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        if (flatListRef.current && messages.length > 0) {
          setTimeout(() => {
            flatListRef.current.scrollToEnd({ animated: true });
          }, 100);
        }
      }
    );

    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, [messages]);

  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages, flatListRef]);

  const initiateConversationSocket = (token) => {
    if (!token) return;
    const wsURL = `${CHAT_URL}/chat/ws?token=${token}`;

    conversationRef.current = new WebSocket(wsURL);

    conversationRef.current.onopen = () => {
   
      setIsConversationSocketConnected(true);
    };

    conversationRef.current.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);

        if (data.type == "initial_history") {
          const temp = data.data.map((item, idx) => ({
            id: idx,
            text: item.content,
            time: '10:00 AM',
            isUser: item.role == "user" ? true : false,
          }));
          setMessages(temp);
    
          setIsLoadingHistory(false); 
        }

        if (data.type == "full_response") {
          setIsTyping(false);
          setMessages(prev => [
            ...prev,
            {
              id: new Date().getTime(),
              text: data.data,
              time: '10:00 AM',
              isUser: false,
            },
          ]);
          setUserMessage("");
        }

      } catch (e) {
        console.error("WebSocket parse error", e);
        setIsLoadingHistory(false);
      }
    };

    conversationRef.current.onclose = () => {
     
      setIsConversationSocketConnected(false);
      setIsLoadingHistory(false);
    };
  };

  useEffect(() => {
    if (authToken.accessToken) {
      initiateConversationSocket(authToken.accessToken);
    }
  }, [authToken, authToken.accessToken]);

  const sendMessage = () => {
    if (conversationRef.current?.readyState === WebSocket.OPEN && userMessage.trim()) {
      const payload = JSON.stringify({message: userMessage});
      setUserMessage("");
      conversationRef.current.send(payload);
      setMessages(prev => [
        ...prev,
        {
          id: new Date().getTime(),
          text: userMessage,
          time: '10:00 AM',
          isUser: true,
        },
      ]);
      setIsTyping(true);
    }
  };

  const formatMessageText = (text) => {
    if (!text) return null;

    const lines = text.split('\n');
    const formattedLines = [];

    lines.forEach((line, lineIndex) => {
      if (!line.trim()) {
        formattedLines.push(<View key={`empty-${lineIndex}`} style={{ height: 8 }} />);
        return;
      }

      const isBulletPoint = line.trim().startsWith('- ');
      let lineContent = line;
      
      if (isBulletPoint) {
        lineContent = line.trim().substring(2);
      }

      const boldPattern = /\*\*(.+?)\*\*/g;
      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = boldPattern.exec(lineContent)) !== null) {
        if (match.index > lastIndex) {
          const beforeText = lineContent.substring(lastIndex, match.index);
          parts.push(...highlightKeywords(beforeText, parts.length));
        }
        
        parts.push(
          <Text key={`bold-${lineIndex}-${parts.length}`} style={{ fontWeight: 'bold' }}>
            {match[1]}
          </Text>
        );
        
        lastIndex = match.index + match[0].length;
      }

      if (lastIndex < lineContent.length) {
        const remainingText = lineContent.substring(lastIndex);
        parts.push(...highlightKeywords(remainingText, parts.length));
      }

      if (isBulletPoint) {

        formattedLines.push(
          <View key={`line-${lineIndex}`} style={{ flexDirection: 'row', marginBottom: 4 }}>
            <Text style={{ fontWeight: 'bold', marginRight: 8, fontSize: 16 }}>•</Text>
            <Text style={{ flex: 1 }}>{parts}</Text>
          </View>
        );
      } else {
        formattedLines.push(
          <Text key={`line-${lineIndex}`} style={{ marginBottom: 4 }}>
            {parts}
          </Text>
        );
      }
    });

    return <View>{formattedLines}</View>;
  };

  const highlightKeywords = (text, startKey) => {
    const redKeywords = ['income', 'debts', 'debt', 'expense', 'expenses'];
    const greenKeywords = ['savings goal', 'savings goals', 'saving goal'];
    

    const keywordPattern = `\\b(${[...redKeywords, ...greenKeywords].join('|')})\\b`;
    const amountPattern = '£[\\d,]+(?:\\.\\d{2})?';
    const combinedPattern = new RegExp(`(${keywordPattern}|${amountPattern})`, 'gi');
    
    const parts = [];
    let lastIndex = 0;
    let match;


    const detectAmountContext = (textBeforeAmount) => {
      const lowerText = textBeforeAmount.toLowerCase();
      

      if (lowerText.includes('savings goal') || 
          lowerText.includes('saving goal') || 
          lowerText.includes('save')) {
        return 'green';
      }
      
 
      if (lowerText.includes('debt') || 
          lowerText.includes('expense') || 
          lowerText.includes('income') ||
          lowerText.includes('cost') ||
          lowerText.includes('pay')) {
        return 'red';
      }
      
      return null;
    };

    while ((match = combinedPattern.exec(text)) !== null) {

      if (match.index > lastIndex) {
        parts.push(
          <Text key={`text-${startKey}-${parts.length}`}>
            {text.substring(lastIndex, match.index)}
          </Text>
        );
      }

      const matchedText = match[0];
      const isAmount = matchedText.startsWith('£');
      
      let color = null;
      
      if (isAmount) {

        const textBefore = text.substring(0, match.index);
        color = detectAmountContext(textBefore);
      } else {
  
        const keyword = matchedText.toLowerCase();
        const isGreen = greenKeywords.some(gk => keyword.includes(gk));
        color = isGreen ? 'green' : 'red';
      }

      if (color) {
        const colorCode = color === 'green' ? '#10B981' : '#EF4444';
        parts.push(
          <Text key={`highlight-${startKey}-${parts.length}`} style={{ color: colorCode, fontWeight: 'bold' }}>
            {matchedText}
          </Text>
        );
      } else {

        parts.push(
          <Text key={`normal-${startKey}-${parts.length}`}>
            {matchedText}
          </Text>
        );
      }

      lastIndex = match.index + matchedText.length;
    }
    

    if (lastIndex < text.length) {
      parts.push(
        <Text key={`text-${startKey}-${parts.length}`}>
          {text.substring(lastIndex)}
        </Text>
      );
    }

    return parts.length > 0 ? parts : [<Text key={`text-${startKey}`}>{text}</Text>];
  };

  const renderMessage = ({ item: msg }) => (
    <View>
      {msg.isUser ? (
        <View className="flex-row justify-end mb-4">
          <View className="max-w-[80%] bg-[#FFA950] rounded-3xl rounded-br-md px-5 py-4 mr-3">
            <Text className="text-white text-small">{msg.text}</Text>
          </View>
          <Image
            source={{ uri: userProfile?.user?.image }}
            className="w-8 h-8 rounded-full"
            resizeMode="cover"
          />
        </View>
      ) : (
        <View className="flex-row justify-start mb">
          <View className="w-10 h-10 rounded-full bg-white border-2 border-gray-300 items-center justify-center mr-3">
            <Image
              source={welcome}
              className="w-8 h-8 rounded-full"
              resizeMode="cover"
            />
          </View>
          <View className="max-w-[80%] mb-3">
            <View className="bg-white rounded-3xl rounded-bl-md px-5 py-4">
              <Text className="text-gray-800 text-base leading-6">
                {formatMessageText(msg.text)}
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );

  const handleScroll = (event) => {
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
    const isNearBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 50;
    setShowScrollButton(!isNearBottom);
  };

  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  return (
    <ComponentWrapper title="Reho AI Lab" bg_color="bg-[#FFA950]">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
     
        {isLoadingHistory ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#FFA950" />
            <Text className="text-gray-600 mt-3 text-base">Loading conversation...</Text>
          </View>
        ) : messages.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Image source={welcome} className="w-20 h-20 mb-4" resizeMode="contain" />
            <Text className="text-gray-700 text-lg font-medium">Start a conversation</Text>
          </View>
        ) : (
          <FlatList
            data={
              isTyping
                ? [...messages, { id: 'typing', isUser: false, text: null }]
                : messages
            }
            ref={flatListRef}
            renderItem={({ item }) =>
              item.id === 'typing' ? (
                <View className="flex-row justify-start mb">
                  <View className="w-10 h-10 rounded-full bg-white border-2 border-gray-300 items-center justify-center mr-3">
                    <Image
                      source={welcome}
                      className="w-8 h-8 rounded-full"
                      resizeMode="cover"
                    />
                  </View>
                  <View className="bg-white rounded-3xl rounded-bl-md px-5 py-4 flex-row space-x-1">
                    <Animated.View
                      style={{ transform: [{ translateY: dot1 }] }}
                      className="w-2 h-2 bg-gray-500 rounded-full mx-1"
                    />
                    <Animated.View
                      style={{ transform: [{ translateY: dot2 }] }}
                      className="w-2 h-2 bg-gray-500 rounded-full mx-1"
                    />
                    <Animated.View
                      style={{ transform: [{ translateY: dot3 }] }}
                      className="w-2 h-2 bg-gray-500 rounded-full mx-1"
                    />
                  </View>
                </View>
              ) : (
                renderMessage({ item })
              )
            }
            keyExtractor={(item) => item.id.toString()}
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />
        )}

        {showScrollButton && (
          <TouchableOpacity
            onPress={scrollToBottom}
            activeOpacity={0.8}
            style={{
              position: 'absolute',
              right: -10,
              bottom: '50%',
              transform: [{ translateY: 30 }],
              backgroundColor: '#FFA950',
              borderRadius: 25,
              padding: 10,
              shadowColor: '#000',
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 4,
            }}
          >
            <ArrowDown color="#FFF" size={22} strokeWidth={2.5} />
          </TouchableOpacity>
        )}

        <View className="mb-12" style={{ paddingBottom: Platform.OS === 'android' ? keyboardHeight : 15 }}>
          <View className="flex-row items-center bg-white rounded-full px-4 py-2">
            <TouchableOpacity className="mr-3" activeOpacity={0.7}>
              <Smile size={24} color="#9CA3AF" strokeWidth={2} />
            </TouchableOpacity>
            <TextInput
              value={userMessage}
              onChangeText={setUserMessage}
              placeholder="Type message here..."
              placeholderTextColor="#9CA3AF"
              className="flex-1 text-gray-800 text-base py-2"
              multiline={false}
            />
            <TouchableOpacity
              className="w-12 h-12 bg-[#FFA950] rounded-full items-center justify-center ml-3"
              activeOpacity={0.8}
              onPress={sendMessage}
            >
              <Send size={20} color="#FFF" strokeWidth={2.5} fill="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ComponentWrapper>
  );
};

export default ChatUIScreen;