import React, { useEffect, useState } from 'react';
import { View, Text, Platform, ActivityIndicator, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { CheckCircle, Trash2 } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import Purchases, { LOG_LEVEL, PURCHASES_ERROR_CODE } from 'react-native-purchases';
import ComponentWrapper from '../../../components/ComponentWrapper'; 
import PrimaryButton from '../../../components/PrimaryButton'; 

import { useAuth } from '../../../context/AuthProvider';
import { REVENUECAT_IOS_API_KEY, PREMIUM_ENTITLEMENT_ID, REVENUECAT_ANDROID_API_KEY } from '../../../constants/Paths';

const features = [
    "Ask financial planners questions via AI chat",
    "Financial Book Appointment With Planner(UK)",
    "Access Exclusive tips, insights, and market analysis", 
    "Priority support for all your financial queries"
];

const FeatureItem = React.memo(({ text }) => (
    <View className="flex-row items-start mb-4">
        <View className="mr-3 mt-0.5">
            <CheckCircle size={20} color="#8B5CF6" />
        </View>
        <Text className="text-gray-800 text-base flex-1 leading-6">
            {text}
        </Text>
    </View>
));

const PremiumFinancialAdvice = () => {
    const [currentPackage, setCurrentPackage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPurchasing, setIsPurchasing] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscriptionInfo, setSubscriptionInfo] = useState(null);
    const [testingMode, setTestingMode] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const navigation = useNavigation();

    const {userProfile} = useAuth()

    useEffect(() => {
        initializeRevenueCat();
    }, []);

    const getCurrentUserInfo = async () => {
        try {
            const userJson = userProfile?.user;
            const user = userJson ? userJson : null;
            
            if (user && user.email) {
                console.log('Current user:', user.email);
                setCurrentUser(user);
                return user;
            } else {
                console.log('No user logged in');
                return null;
            }
        } catch (error) {
            console.error('Error getting user info:', error);
            return null;
        }
    };

    const initializeRevenueCat = async () => {
        try {


            if (__DEV__) {
                Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
                  console.log(`TESTING MODE: ${Platform.OS === 'ios' ? 'StoreKit' : 'Google Play Billing'} Testing Active`);
            } else {
                Purchases.setLogLevel(LOG_LEVEL.ERROR);
            }

            if (Platform.OS === "ios") {
                Purchases.configure({ apiKey: REVENUECAT_IOS_API_KEY });
                console.log('RevenueCat initialized for iOS');
            } else if (Platform.OS === "android") {
                Purchases.configure({ apiKey: REVENUECAT_ANDROID_API_KEY });
                console.log('RevenueCat initialized for Android');
            }

            if (Platform.OS === "ios") {
                
                await detectTestingEnvironment();
            }

            await identifyUserInRevenueCat();
            
       
            await checkSubscriptionStatus();
            await fetchOfferings();
            
            setIsLoading(false);
        } catch (error) {
            console.error('Error initializing RevenueCat:', error);
            setIsLoading(false);
            Alert.alert('Error', 'Failed to initialize payment system. Please restart the app.');
        }
    };

  
    const identifyUserInRevenueCat = async () => {
        try {
            const user = await getCurrentUserInfo();
            
            if (user && user.email) {
                console.log('Logging in user to RevenueCat:', user.email);
                
                const { customerInfo } = await Purchases.logIn(user.email);
                
                console.log('User logged in to RevenueCat');
                console.log('RevenueCat User ID:', customerInfo.originalAppUserId);
                
               
                await setUserAttributes(user);
                
                return customerInfo;
            } else {
                console.log('No user to identify - using anonymous');
            }
        } catch (error) {
            console.error('Error identifying user:', error);
        }
    };

   
    const setUserAttributes = async (user) => {
        try {
            console.log('Setting user attributes...');
            
            if (user.email) {
                await Purchases.setEmail(user.email);
                console.log('Email set:', user.email);
            }
            
            if (user.name) {
                await Purchases.setDisplayName(user.name);
                console.log('Name set:', user.name);
            }
            
            const attributes = {
                'user_id': user._id || user.uid || '',
                'signup_date': user.createdAt || new Date().toISOString(),
                'user_type': user.role || 'standard',
            };
            
            await Purchases.setAttributes(attributes);
            console.log('Custom attributes set');
            console.log('All user attributes set successfully');
        } catch (error) {
            console.error('Error setting attributes:', error);
        }
    };

    const detectTestingEnvironment = async () => {
        try {
            const customerInfo = await Purchases.getCustomerInfo();
            const isTest = customerInfo.originalAppUserId.includes('RCAnonymous') || __DEV__;
            setTestingMode(isTest);
            
            if (isTest) {
                console.log('StoreKit Testing Environment Detected');
                console.log('Test User ID:', customerInfo.originalAppUserId);
            }
        } catch (error) {
            console.log('Could not detect environment:', error);
        }
    };

    const fetchOfferings = async () => {
        try {
            console.log('Fetching offerings...');
            const offerings = await Purchases.getOfferings();
            
            if (__DEV__) {
                console.log('Offerings:', JSON.stringify(offerings, null, 2));
            }

            if (offerings.current && offerings.current.availablePackages.length > 0) {
                const monthlyPackage = offerings.current.monthly || offerings.current.availablePackages[0];
                setCurrentPackage(monthlyPackage);
                
                console.log('Package loaded:');
                console.log('Product ID:', monthlyPackage.product.identifier);
                console.log('Price:', monthlyPackage.product.priceString);
            } else {
                console.log('No offerings available');
            }
        } catch (error) {
            console.error('Error fetching offerings:', error);
        }
    };

    
    const checkSubscriptionStatus = async () => {
        try {
            console.log('Checking subscription status...');
            const customerInfo = await Purchases.getCustomerInfo();
            console.log("customer info => ", JSON.stringify(customerInfo, null,2))
            
            console.log('Customer ID:', customerInfo.originalAppUserId);
            console.log('Active Entitlements:', Object.keys(customerInfo.entitlements.active));
            console.log('Active Subscriptions:', customerInfo.activeSubscriptions);
            
            const hasActiveSubscription = 
                customerInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID]?.isActive === true;

            setIsSubscribed(hasActiveSubscription);
            setSubscriptionInfo(customerInfo);

            if (hasActiveSubscription) {
                console.log('USER IS SUBSCRIBED');
                const entitlement = customerInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID];
                console.log('Subscription Details:');
                console.log('Product:', entitlement.productIdentifier);
                console.log('Will Renew:', entitlement.willRenew);
                console.log('Expires:', new Date(entitlement.expirationDate).toLocaleString());
                
        
                if (__DEV__) {
                    Alert.alert(
                        'Subscription Active',
                        `You have an active subscription!\n\nProduct: ${entitlement.productIdentifier}\nExpires: ${new Date(entitlement.expirationDate).toLocaleDateString()}`,
                        [{ text: 'OK' }]
                    );
                }
            } else {
                console.log('USER IS NOT SUBSCRIBED');
                
                if (__DEV__) {
                    Alert.alert(
                        'No Active Subscription',
                        'You do not have an active subscription.',
                        [{ text: 'OK' }]
                    );
                }
            }

            return hasActiveSubscription;
        } catch (error) {
            console.error('Error checking subscription:', error);
            return false;
        }
    };

    const handleSubscribe = async () => {
        if (!currentPackage) {
            Alert.alert('Error', 'No subscription package available');
            return;
        }

        const user = await getCurrentUserInfo();
        if (!user || !user.email) {
            Alert.alert(
                'Login Required',
                'Please log in to your account to subscribe.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Go to Login', onPress: () => navigation.navigate('Login') }
                ]
            );
            return;
        }

        setIsPurchasing(true);

        try {
            console.log('Initiating purchase...');
            console.log('Purchasing for user:', user.email);
            console.log('Package:', currentPackage.identifier);
            
            if (__DEV__) {
                console.log('TEST PURCHASE: No real money will be charged');
            }
            
            const { customerInfo, productIdentifier } = await Purchases.purchasePackage(currentPackage);
            
            console.log('Purchase successful!');
            console.log('Product ID:', productIdentifier);
            console.log('Purchased by:', customerInfo.originalAppUserId);

            const hasAccess = 
                customerInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID]?.isActive === true;

            if (hasAccess) {
                setIsSubscribed(true);
                setSubscriptionInfo(customerInfo);
                userProfile?.setIsSubscribed(true);
                userProfile?.setSubscriptionInfo(customerInfo);
                
                console.log('Subscription activated for user:', user.email);
                
                Alert.alert(
                    'Success!',
                    `Subscription activated for ${user.email}!\n\nEnjoy premium features!`,
                    [
                        {
                            text: 'Great!',
                            onPress: () => {}
                        }
                    ]
                );
            } else {
                console.log('Purchase completed but no active entitlement found');
                Alert.alert('Notice', 'Purchase completed. Checking status...');
                
            
                setTimeout(() => checkSubscriptionStatus(), 2000);
            }

        } catch (error) {
            console.error('Purchase error:', error);
            handlePurchaseError(error);
        } finally {
            setIsPurchasing(false);
        }
    };

    const handlePurchaseError = (error) => {
        if (__DEV__) {
            console.log('Purchase Error Code:', error.code);
            console.log('Error Message:', error.message);
        }

        if (error.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) {
            console.log('User cancelled the purchase');
        } else if (error.code === PURCHASES_ERROR_CODE.PURCHASE_NOT_ALLOWED_ERROR) {
            Alert.alert('Purchase Not Allowed', 'In-app purchases are disabled on this device.');
        } else if (error.code === PURCHASES_ERROR_CODE.PAYMENT_PENDING_ERROR) {
            Alert.alert('Payment Pending', 'Your payment is being processed.');
        } else {
            Alert.alert('Purchase Failed', error.message || 'An error occurred during purchase.');
        }
    };

    const handleRestorePurchases = async () => {
        setIsPurchasing(true);
        try {
            console.log('Restoring purchases...');
            
            const user = await getCurrentUserInfo();
            if (user && user.email) {
                console.log('Restoring for user:', user.email);
            }
            
            const customerInfo = await Purchases.restorePurchases();
            
            const hasActiveSubscription = 
                customerInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID]?.isActive === true;

            if (hasActiveSubscription) {
                setIsSubscribed(true);
                setSubscriptionInfo(customerInfo);
                console.log('Subscription restored successfully');
                
                Alert.alert(
                    'Success', 
                    user && user.email 
                        ? `Subscription restored for ${user.email}!`
                        : 'Your subscription has been restored!'
                );
            } else {
                console.log('No active subscriptions found to restore');
                Alert.alert('No Purchases Found', 'No active subscriptions were found for this account.');
            }
        } catch (error) {
            console.error('Restore error:', error);
            Alert.alert('Error', 'Failed to restore purchases. Please try again.');
        } finally {
            setIsPurchasing(false);
        }
    };

    const handleForceUnsubscribe = () => {
        Alert.alert(
            'Force Unsubscribe (Testing Only)',
            'This will simulate unsubscribing for testing purposes. In production, users must cancel through Settings.\n\nChoose method:',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Clear Local Cache',
                    onPress: async () => {
                        try {
                            console.log('🗑️ Clearing local subscription cache...');
                          
                            await Purchases.logOut();
                            const user = await getCurrentUserInfo();
                            if (user && user.email) {
                                await Purchases.logIn(user.email);
                            }
                            

                            await checkSubscriptionStatus();
                            
                            Alert.alert('Done', 'Local cache cleared. Status refreshed from server.');
                        } catch (error) {
                            console.error('Error:', error);
                            Alert.alert('Error', error.message);
                        }
                    }
                },
                {
                    text: 'Cancel in Xcode',
                    onPress: () => {
                        Alert.alert(
                            'Cancel Subscription in Xcode',
                            'To cancel test subscription:\n\n1. In Xcode menu: Debug → StoreKit → Manage Transactions\n2. Find your subscription\n3. Click "Cancel Subscription"\n4. Come back to app\n5. Tap "Check Status" button',
                            [{ text: 'Got it' }]
                        );
                    }
                }
            ]
        );
    };

    const handleCheckStatus = async () => {
        setIsPurchasing(true);
        try {
            console.log('Manually checking subscription status...');
            const isActive = await checkSubscriptionStatus();
            
            if (isActive) {
                Alert.alert('Active', 'You have an active subscription!');
            } else {
                Alert.alert('Not Active', 'You do not have an active subscription.');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to check status');
        } finally {
            setIsPurchasing(false);
        }
    };

    const priceDisplay = currentPackage 
        ? `${currentPackage.product.priceString}/month` 
        : "Loading...";

    if (isLoading) {
        return (
            <ComponentWrapper title='Subscription Plan'>
                <View className="flex-1 justify-center items-center h-40">
                    <ActivityIndicator size="large" color="#8B5CF6" />
                    <Text className="text-gray-600 mt-4">Loading subscription plans...</Text>
                </View>
            </ComponentWrapper>
        );
    }

    return (
        <ComponentWrapper bg_color='bg-[#5055ba]' title='Subscription Plan'>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
              
                {__DEV__ && currentUser && (
                    <View className="mb-4 p-3 bg-blue-100 border border-blue-400 rounded-lg">
                        <Text className="text-blue-800 text-xs font-semibold">
                            Logged in as: {currentUser.email}
                        </Text>
                        {currentUser.name && (
                            <Text className="text-blue-700 text-xs mt-1">
                                Name: {currentUser.name}
                            </Text>
                        )}
                    </View>
                )}
                
              
                {__DEV__ && testingMode && (
                    <View className="mb-4 p-3 bg-yellow-100 border border-yellow-400 rounded-lg">
                        <Text className="text-yellow-800 text-xs font-semibold text-center">
                             TESTING MODE - {Platform.OS === 'ios' ? 'StoreKit Configuration' : 'Google Play Billing Test'}
                        </Text>
                        <Text className="text-yellow-700 text-xs text-center mt-1">
                            No real payments will be processed
                        </Text>
                    </View>
                )}

                <Text className="text-gray-900 text-2xl font-bold mb-2">
                    {isSubscribed ? "You're all set!" : "Premium Financial Advice"}
                </Text>
   
                <Text className={`text-indigo-600 font-bold mb-6 ${isSubscribed ? 'text-xl' : 'text-4xl'}`}>
                    {isSubscribed ? "Active Subscription" : priceDisplay}
                </Text>

                <View className="mb-5">
                    {features.map((feature, index) => (
                        <FeatureItem key={index} text={feature} />
                    ))}
                </View>

                {!isSubscribed ? (
                    <>
                        <PrimaryButton 
                            text={isPurchasing ? <ActivityIndicator color="#FFFFFF" /> : 'Subscribe Now'}
                            onPress={handleSubscribe}
                            disabled={isPurchasing || !currentPackage}
                        />
                        
                        <View className="mt-4">
                            <Text 
                                className="text-indigo-600 text-center text-sm underline"
                                onPress={handleRestorePurchases}
                            >
                                Restore Purchases
                            </Text>
                        </View>

                
                        {__DEV__ && (
                            <View className="mt-4">
                                <TouchableOpacity 
                                    onPress={handleCheckStatus}
                                    className="p-3 bg-gray-200 rounded-lg"
                                >
                                    <Text className="text-gray-800 text-center font-semibold">
                                        Check Subscription Status
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {__DEV__ && (
                            <View className="mt-4 p-3 bg-blue-50 rounded-lg">
                                <Text className="text-blue-800 text-xs text-center">
                                    Dev Tip: Subscribe, then use testing controls below to unsubscribe
                                </Text>
                            </View>
                        )}
                    </>
                ) : (
                    <View className="space-y-3">
                        <View className="p-4 bg-green-100 border border-green-300 rounded-lg">
                            <Text className="text-green-800 font-semibold text-center">
                                Your Premium access is active. Enjoy!
                            </Text>
                            {currentUser && currentUser.email && (
                                <Text className="text-green-700 text-sm text-center mt-2">
                                    Subscribed as: {currentUser.email}
                                </Text>
                            )}
                        </View>
                        
                        {subscriptionInfo?.latestExpirationDate && (
                            <View className="p-4 bg-gray-100 rounded-lg mt-3">
                                <Text className="text-gray-600 text-sm">
                                    Next billing: {new Date(subscriptionInfo.latestExpirationDate).toLocaleDateString()}
                                </Text>
                                {subscriptionInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID]?.willRenew !== undefined && (
                                    <Text className="text-gray-600 text-sm mt-1">
                                        Will renew: {subscriptionInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID].willRenew ? 'Yes' : 'No (Cancelled)'}
                                    </Text>
                                )}
                                {__DEV__ && (
                                    <Text className="text-gray-500 text-xs mt-2">
                                        Test subscription - No actual billing
                                    </Text>
                                )}
                            </View>
                        )}

                    
                        {__DEV__ && (
                            <View className="mt-4">
                                <TouchableOpacity 
                                    onPress={handleCheckStatus}
                                    className="p-3 bg-gray-200 rounded-lg"
                                >
                                    <Text className="text-gray-800 text-center font-semibold">
                                        Refresh Subscription Status
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}

                       
                        {__DEV__ && (
                            <View className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <Text className="text-red-800 text-xs font-semibold mb-3 text-center">
                                    TESTING CONTROLS (Development Only)
                                </Text>
                                
                                <TouchableOpacity 
                                    onPress={handleForceUnsubscribe}
                                    className="p-3 bg-red-500 rounded-lg flex-row items-center justify-center"
                                >
                                    <Trash2 size={16} color="#FFFFFF" />
                                    <Text className="text-white font-semibold ml-2">
                                        Force Unsubscribe (Test Only)
                                    </Text>
                                </TouchableOpacity>
                                
                                <Text className="text-red-600 text-xs mt-3 text-center">
                                    This button is for TESTING ONLY and will be removed in production
                                </Text>
                            </View>
                        )}

                        {__DEV__ && (
                            <View className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                <Text className="text-amber-800 text-xs font-semibold mb-2">
                                    How to Test Unsubscribe:
                                </Text>
                                <Text className="text-amber-700 text-xs">
                                    1. Tap "Force Unsubscribe" button above
                                </Text>
                                <Text className="text-amber-700 text-xs">
                                    2. Choose "Cancel in Xcode" for realistic test
                                </Text>
                                <Text className="text-amber-700 text-xs">
                                    3. Or choose "Clear Local Cache" for quick reset
                                </Text>
                                <Text className="text-amber-700 text-xs">
                                    4. Use "Refresh Status" button to check
                                </Text>
                            </View>
                        )}
                    </View>
                )}

                <View className="mt-6 p-3 bg-gray-50 rounded-lg">
                    <Text className="text-gray-500 text-xs text-center">
                        {__DEV__ 
                            ? 'Test Mode: Each user account has separate subscription status. Subscription status checked automatically on login.' 
                            : 'Subscription automatically renews unless canceled. Manage your subscription in App Store settings.'}
                    </Text>
                </View>
            </ScrollView>
        </ComponentWrapper>
    );
};

export default PremiumFinancialAdvice;