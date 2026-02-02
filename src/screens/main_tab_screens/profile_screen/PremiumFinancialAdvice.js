import React, { useEffect, useState } from 'react';
import { View, Text, Platform, ActivityIndicator, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { CheckCircle, Trash2, Tag } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import Purchases, { LOG_LEVEL, PURCHASES_ERROR_CODE } from 'react-native-purchases';
import ComponentWrapper from '../../../components/ComponentWrapper';
import PrimaryButton from '../../../components/PrimaryButton';

import { useAuth } from '../../../context/AuthProvider';
import { REVENUECAT_IOS_API_KEY, PREMIUM_ENTITLEMENT_ID, REVENUECAT_ANDROID_API_KEY } from '../../../constants/Paths';
import { Linking } from 'react-native';

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
    const [introOffer, setIntroOffer] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPurchasing, setIsPurchasing] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscriptionInfo, setSubscriptionInfo] = useState(null);
    const [testingMode, setTestingMode] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const navigation = useNavigation();

    const { userProfile } = useAuth();

    useEffect(() => {
        initializeRevenueCat();
    }, []);

    const getCurrentUserInfo = async () => {
        try {
            const userJson = userProfile?.user;
            const user = userJson ? userJson : null;

            if (user && user.email) {
                setCurrentUser(user);
                return user;
            } else {
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
            } else {
                Purchases.setLogLevel(LOG_LEVEL.ERROR);
            }

            if (Platform.OS === 'ios') {
                Purchases.configure({ apiKey: REVENUECAT_IOS_API_KEY });
            } else if (Platform.OS === 'android') {
                Purchases.configure({ apiKey: REVENUECAT_ANDROID_API_KEY });
            }

            if (Platform.OS === 'ios') {
                await detectTestingEnvironment();
            }

            await identifyUserInRevenueCat();
            await checkSubscriptionStatus();
            await fetchOfferings();

            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            Alert.alert('Error', 'Failed to initialize payment system. Please restart the app.');
        }
    };

    const identifyUserInRevenueCat = async () => {
        try {
            const user = await getCurrentUserInfo();

            if (user && user.email) {
    
                const { customerInfo } = await Purchases.logIn(user.email);
                await setUserAttributes(user);
                return customerInfo;
            } else {

            }
        } catch (error) {
       
        }
    };

    const setUserAttributes = async (user) => {
        try {
            if (user.email) {
                await Purchases.setEmail(user.email);
            }

            if (user.name) {
                await Purchases.setDisplayName(user.name);
            }

            const attributes = {
                'user_id': user._id || user.uid || '',
                'signup_date': user.createdAt || new Date().toISOString(),
                'user_type': user.role || 'standard',
            };

            await Purchases.setAttributes(attributes);

        } catch (error) {

        }
    };

    const detectTestingEnvironment = async () => {
        try {
            const customerInfo = await Purchases.getCustomerInfo();
            const isTest = customerInfo.originalAppUserId.includes('RCAnonymous') || __DEV__;
            setTestingMode(isTest);

            if (isTest) {

            }
        } catch (error) {
  
        }
    };

    const fetchOfferings = async () => {
        try {
     
            const offerings = await Purchases.getOfferings();

            if (__DEV__) {
                console.log('Offerings:', JSON.stringify(offerings, null, 2));
            }

            if (offerings.current && offerings.current.availablePackages.length > 0) {
                const monthlyPackage = offerings.current.monthly || offerings.current.availablePackages[0];
                setCurrentPackage(monthlyPackage);

        

                const intro = monthlyPackage.product.introPrice;
                if (intro) {
                    setIntroOffer(intro);
                } else {
                  
                }
            } else {
              
            }
        } catch (error) {
      
        }
    };

    const checkSubscriptionStatus = async () => {
        try {
            
            const customerInfo = await Purchases.getCustomerInfo();

            const hasActiveSubscription =
                customerInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID]?.isActive === true;

            setIsSubscribed(hasActiveSubscription);
            setSubscriptionInfo(customerInfo);

            if (hasActiveSubscription) {
                const entitlement = customerInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID];
               
            } else {
                
            }

            return hasActiveSubscription;
        } catch (error) {
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
          

            const { customerInfo, productIdentifier } = await Purchases.purchasePackage(currentPackage);

            console.log('Purchase successful - Product:', productIdentifier);
            console.log('Purchased by:', customerInfo.originalAppUserId);

            const hasAccess =
                customerInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID]?.isActive === true;

            if (hasAccess) {
                setIsSubscribed(true);
                setSubscriptionInfo(customerInfo);
                userProfile?.setIsSubscribed(true);
                userProfile?.setSubscriptionInfo(customerInfo);


                Alert.alert(
                    'Success',
                    introOffer && introOffer.price === 0
                        ? `Your free trial has started! Enjoy premium features for ${getTrialPeriodText()}.`
                        : `Subscription activated for ${user.email}!`,
                    [{ text: 'Continue', onPress: () => {} }]
                );
            } else {
                Alert.alert('Notice', 'Purchase completed. Checking status...');
                setTimeout(() => checkSubscriptionStatus(), 2000);
            }

        } catch (error) {
            handlePurchaseError(error);
        } finally {
            setIsPurchasing(false);
        }
    };

    const handlePurchaseError = (error) => {
        
        if (error.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) {
          
        } else if (error.code === PURCHASES_ERROR_CODE.PURCHASE_NOT_ALLOWED_ERROR) {
            Alert.alert('Purchase Not Allowed', 'In-app purchases are disabled on this device.');
        } else if (error.code === PURCHASES_ERROR_CODE.PAYMENT_PENDING_ERROR) {
            Alert.alert('Payment Pending', 'Your payment is being processed.');
        } else {
            Alert.alert('Purchase Failed', error.message || 'An error occurred during purchase.');
        }
    };

    

const handleRedeemOfferCode = async () => {
    if (Platform.OS === 'ios') {
        try {
         
            await Purchases.presentCodeRedemptionSheet();

            const customerInfo = await Purchases.getCustomerInfo();
            const hasAccess =
                customerInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID]?.isActive === true;

            if (hasAccess) {
                setIsSubscribed(true);
                setSubscriptionInfo(customerInfo);
                userProfile?.setIsSubscribed(true);
                userProfile?.setSubscriptionInfo(customerInfo);

                Alert.alert(
                    'Success',
                    'Your offer code has been applied! Premium access is now active.',
                    [{ text: 'Continue', onPress: () => {} }]
                );
            } else {

            }
        } catch (error) {
            console.error('iOS offer code error:', error);
            Alert.alert('Error', 'Failed to redeem offer code. Please try again.');
        }
    } else if (Platform.OS === 'android') {
        try {
     
            const supported = await Linking.canOpenURL('https://play.google.com/redeem');

            if (supported) {
                await Linking.openURL('https://play.google.com/redeem');


                setTimeout(async () => {
                    const customerInfo = await Purchases.getCustomerInfo();
                    const hasAccess =
                        customerInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID]?.isActive === true;

                    if (hasAccess && !isSubscribed) {
                        setIsSubscribed(true);
                        setSubscriptionInfo(customerInfo);
                        userProfile?.setIsSubscribed(true);
                        userProfile?.setSubscriptionInfo(customerInfo);

                        Alert.alert(
                            'Success',
                            'Your promo code has been applied! Premium access is now active.',
                            [{ text: 'Continue', onPress: () => {} }]
                        );
                    }
                }, 3000);
            } else {
                Alert.alert('Error', 'Unable to open Google Play.');
            }
        } catch (error) {
            console.error('Android promo code error:', error);
            Alert.alert('Error', 'Failed to open redemption page. Please try again.');
        }
    }
};
    const handleRestorePurchases = async () => {
        setIsPurchasing(true);
        try {
    
            const customerInfo = await Purchases.restorePurchases();

            const hasActiveSubscription =
                customerInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID]?.isActive === true;

            if (hasActiveSubscription) {
                setIsSubscribed(true);
                setSubscriptionInfo(customerInfo);
                Alert.alert('Success', 'Your subscription has been restored!');
            } else {
                Alert.alert('No Purchases Found', 'No active subscriptions were found for this account.');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to restore purchases. Please try again.');
        } finally {
            setIsPurchasing(false);
        }
    };

    const handleForceUnsubscribe = () => {
        Alert.alert(
            'Force Unsubscribe (Testing Only)',
            'This will simulate unsubscribing for testing purposes.\n\nChoose method:',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear Local Cache',
                    onPress: async () => {
                        try {
                            await Purchases.logOut();
                            const user = await getCurrentUserInfo();
                            if (user && user.email) {
                                await Purchases.logIn(user.email);
                            }
                            await checkSubscriptionStatus();
                            Alert.alert('Done', 'Local cache cleared. Status refreshed.');
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
                            'Cancel in Xcode',
                            'To cancel test subscription:\n\n1. Debug > StoreKit > Manage Transactions\n2. Find your subscription\n3. Click Cancel Subscription\n4. Come back and tap Refresh Status',
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
            const isActive = await checkSubscriptionStatus();
            if (isActive) {
                Alert.alert('Active', 'You have an active subscription.');
            } else {
                Alert.alert('Not Active', 'No active subscription found.');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to check status');
        } finally {
            setIsPurchasing(false);
        }
    };

    const getTrialPeriodText = () => {
        if (!introOffer) return null;
        const count = introOffer.periodNumberOfUnits;
        switch (introOffer.periodUnit) {
            case 'DAY':
                return count === 1 ? '1 day' : `${count} days`;
            case 'WEEK':
                return count === 1 ? '1 week' : `${count} weeks`;
            case 'MONTH':
                return count === 1 ? '1 month' : `${count} months`;
            case 'YEAR':
                return count === 1 ? '1 year' : `${count} years`;
            default:
                return introOffer.period;
        }
    };

    const isFreeIntro = introOffer && introOffer.price === 0;

    const getSubscribeButtonText = () => {
        if (isPurchasing) return null;
        if (isFreeIntro) return 'Start Free Trial';
        if (introOffer) return `Try for ${introOffer.priceString}`;
        return 'Subscribe Now';
    };

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

                <Text className="text-gray-900 text-2xl font-bold mb-2">
                    {isSubscribed ? "You're all set!" : "Premium Financial Advice"}
                </Text>

                {!isSubscribed && (
                    <>
                        {isFreeIntro ? (
                            <>
                                <Text className="text-green-600 text-2xl font-bold mb-1">
                                    Free for {getTrialPeriodText()}
                                </Text>
                                <Text className="text-gray-500 text-sm mb-5">
                                    Then {currentPackage?.product.priceString}/month after your trial ends
                                </Text>
                            </>
                        ) : introOffer ? (
                            <>
                                <Text className="text-indigo-600 text-3xl font-bold mb-1">
                                    {introOffer.priceString} for {getTrialPeriodText()}
                                </Text>
                                <Text className="text-gray-500 text-sm mb-5">
                                    Then {currentPackage?.product.priceString}/month
                                </Text>
                            </>
                        ) : (
                            <Text className="text-indigo-600 text-4xl font-bold mb-5">
                                {currentPackage ? currentPackage.product.priceString : 'Loading...'}/month
                            </Text>
                        )}
                    </>
                )}

                {isSubscribed && (
                    <Text className="text-indigo-600 text-xl font-bold mb-5">
                        Active Subscription
                    </Text>
                )}

                <View className="mb-5">
                    {features.map((feature, index) => (
                        <FeatureItem key={index} text={feature} />
                    ))}
                </View>

                {!isSubscribed ? (
                    <>
                        <PrimaryButton
                            text={isPurchasing ? <ActivityIndicator color="#FFFFFF" /> : getSubscribeButtonText()}
                            onPress={handleSubscribe}
                            disabled={isPurchasing || !currentPackage}
                        />

                        <TouchableOpacity
                            onPress={handleRedeemOfferCode}
                            className="mt-4 p-3 border border-indigo-500 rounded-xl flex-row items-center justify-center"
                        >
                            <Tag size={18} color="#4F46E5" />
                            <Text className="text-indigo-600 font-semibold ml-2">
                                Redeem Offer Code
                            </Text>
                        </TouchableOpacity>

                        <View className="mt-4">
                            <Text
                                className="text-indigo-600 text-center text-sm underline"
                                onPress={handleRestorePurchases}
                            >
                                Restore Purchases
                            </Text>
                        </View>

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
                                    {subscriptionInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID]?.willRenew
                                        ? 'Next billing:'
                                        : 'Access until:'} {new Date(subscriptionInfo.latestExpirationDate).toLocaleDateString()}
                                </Text>
                                {subscriptionInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID]?.willRenew !== undefined && (
                                    <Text className="text-gray-600 text-sm mt-1">
                                        Will renew: {subscriptionInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID].willRenew ? 'Yes' : 'No (Cancelled)'}
                                    </Text>
                                )}

                            </View>
                        )}

                    </View>
                )}

            </ScrollView>
        </ComponentWrapper>
    );
};

export default PremiumFinancialAdvice;