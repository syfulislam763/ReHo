import Constants from 'expo-constants';


const getEnvVars = () => {
  const ENV = Constants.expoConfig?.extra?.eas?.env || 'development';

  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL;
  const AI_API_URL = process.env.EXPO_PUBLIC_AI_API_URL;
  const AI_CHAT_URL = process.env.EXPO_PUBLIC_AI_CHAT_URL;
  const REVENUECAT_IOS_API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY;
  const REVENUECAT_ANDROID_API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY;
  const PREMIUM_ENTITLEMENT_ID = process.env.EXPO_PUBLIC_PREMIUM_ENTITLEMENT_ID;

  return {
    ENV,
    API_URL,
    SOCKET_URL,
    AI_API_URL,
    AI_CHAT_URL,
    REVENUECAT_IOS_API_KEY,
    REVENUECAT_ANDROID_API_KEY,
    PREMIUM_ENTITLEMENT_ID,
  };
};

export default getEnvVars();