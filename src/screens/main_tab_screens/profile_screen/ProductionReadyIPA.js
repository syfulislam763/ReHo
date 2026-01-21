import React, { useEffect, useState } from 'react';
import { View, Text, Platform, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { CheckCircle } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import Purchases, { LOG_LEVEL, PURCHASES_ERROR_CODE } from 'react-native-purchases';
import ComponentWrapper from '../../../components/ComponentWrapper'; 
import PrimaryButton from '../../../components/PrimaryButton'; 
import { ROOT_URL } from '../../../constants/Paths';

const REVENUECAT_IOS_API_KEY = "appl_uiclOCoavDbvXvmuhpQAGkmqbCu";
const SERVER_SUBSCRIPTION_ENDPOINT = ROOT_URL + '/subscriptions/';
const PREMIUM_ENTITLEMENT_ID = 'premium'; // 🆕 Define your entitlement ID

const features = [
    "Ask financial planners questions via AI chat",
    "Financial Book Appointment With Planner",
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
    const navigation = useNavigation();

    useEffect(() => {
        initializeRevenueCat();
    }, []);

    const initializeRevenueCat = async () => {
        try {
            if (Platform.OS === "ios") {
                // 🆕 Conditional log level
                if (__DEV__) {
                    Purchases.setLogLevel(LOG_LEVEL.DEBUG);
                } else {
                    Purchases.setLogLevel(LOG_LEVEL.ERROR);
                }
                
                Purchases.configure({ apiKey: REVENUECAT_IOS_API_KEY });
                console.log('RevenueCat initialized');
            }
            
            await checkSubscriptionStatus();
            await fetchOfferings();
            setIsLoading(false);
        } catch (error) {
            console.error('Error initializing RevenueCat:', error);
            setIsLoading(false);
            Alert.alert('Error', 'Failed to initialize payment system. Please restart the app.');
        }
    };

    const fetchOfferings = async () => {
        try {
            console.log('Fetching offerings...');
            const offerings = await Purchases.getOfferings();
            
            if (__DEV__) {
                console.log('Offerings fetched:', JSON.stringify(offerings, null, 2));
            }

            if (offerings.current && offerings.current.availablePackages.length > 0) {
                const monthlyPackage = offerings.current.monthly || offerings.current.availablePackages[0];
                setCurrentPackage(monthlyPackage);
                console.log('Current package set:', monthlyPackage.identifier);
            } else {
                console.log('No offerings available');
                Alert.alert('No Plans Available', 'Unable to load subscription plans. Please try again later.');
            }
        } catch (error) {
            console.error('Error fetching offerings:', error);
            Alert.alert('Error', 'Failed to load subscription plans.');
        }
    };

    const checkSubscriptionStatus = async () => {
        try {
            console.log('Checking subscription status...');
            const customerInfo = await Purchases.getCustomerInfo();
            
            if (__DEV__) {
                console.log('Customer Info:', JSON.stringify(customerInfo, null, 2));
            }

            // 🆕 Check specific entitlement
            const hasActiveSubscription = 
                customerInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID]?.isActive === true;

            setIsSubscribed(hasActiveSubscription);
            setSubscriptionInfo(customerInfo);

            console.log(hasActiveSubscription ? 'User has active subscription' : 'User does not have active subscription');
        } catch (error) {
            console.error('Error checking subscription:', error);
        }
    };

    const handleSubscribe = async () => {
        if (!currentPackage) {
            Alert.alert('Error', 'No subscription package available');
            return;
        }

        setIsPurchasing(true);

        try {
            console.log('Starting purchase for:', currentPackage.identifier);
            
            const { customerInfo, productIdentifier } = await Purchases.purchasePackage(currentPackage);
            
            console.log('Purchase successful!');
            console.log('Product ID:', productIdentifier);

            // 🆕 Check specific entitlement
            const hasAccess = 
                customerInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID]?.isActive === true;

            if (hasAccess) {
                setIsSubscribed(true);
                setSubscriptionInfo(customerInfo);
                
                await syncSubscriptionWithBackend(customerInfo);

                Alert.alert(
                    'Success!',
                    'Your subscription is now active. Enjoy premium features!',
                    [
                        {
                            text: 'Get Started',
                            onPress: () => navigation.goBack()
                        }
                    ]
                );
            } else {
                console.log('Purchase completed but no active entitlement found');
                Alert.alert('Notice', 'Purchase completed. It may take a moment for access to activate.');
            }

        } catch (error) {
            console.error('Purchase error:', error);
            handlePurchaseError(error);
        } finally {
            setIsPurchasing(false);
        }
    };

    const handlePurchaseError = (error) => {
        if (error.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) {
            console.log('User cancelled the purchase');
        } else if (error.code === PURCHASES_ERROR_CODE.PURCHASE_NOT_ALLOWED_ERROR) {
            Alert.alert(
                'Purchase Not Allowed',
                'In-app purchases are disabled on this device.'
            );
        } else if (error.code === PURCHASES_ERROR_CODE.PAYMENT_PENDING_ERROR) {
            Alert.alert(
                'Payment Pending',
                'Your payment is being processed. Please check back later.'
            );
        } else if (error.code === PURCHASES_ERROR_CODE.STORE_PROBLEM_ERROR) {
            Alert.alert(
                'Store Connection Issue',
                'Unable to connect to the App Store. Please try again.'
            );
        } else {
            Alert.alert(
                'Purchase Failed',
                'An error occurred during purchase. Please try again.'
            );
        }
    };

    const syncSubscriptionWithBackend = async (customerInfo) => {
        try {
            console.log('Syncing with backend...');
            
            const response = await fetch(SERVER_SUBSCRIPTION_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: customerInfo.originalAppUserId,
                    subscription_status: 'active',
                    entitlements: customerInfo.entitlements.active,
                    original_purchase_date: customerInfo.originalPurchaseDate,
                    expiration_date: customerInfo.latestExpirationDate,
                }),
            });

            if (response.ok) {
                console.log('Backend sync successful');
            } else {
                console.log('Backend sync failed:', response.status);
            }
        } catch (error) {
            console.error('Backend sync error:', error);
        }
    };

    const handleRestorePurchases = async () => {
        setIsPurchasing(true);
        try {
            console.log('Restoring purchases...');
            const customerInfo = await Purchases.restorePurchases();
            
            // 🆕 Check specific entitlement
            const hasActiveSubscription = 
                customerInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID]?.isActive === true;

            if (hasActiveSubscription) {
                setIsSubscribed(true);
                setSubscriptionInfo(customerInfo);
                Alert.alert('Success', 'Your subscription has been restored!');
            } else {
                Alert.alert('No Purchases Found', 'No active subscriptions were found to restore.');
            }
        } catch (error) {
            console.error('Restore error:', error);
            Alert.alert('Error', 'Failed to restore purchases. Please try again.');
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
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
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
                    </>
                ) : (
                    <View className="space-y-3">
                        <View className="p-4 bg-green-100 border border-green-300 rounded-lg">
                            <Text className="text-green-800 font-semibold text-center">
                                ✓ Your Premium access is active. Enjoy!
                            </Text>
                        </View>
                        
                        {subscriptionInfo?.latestExpirationDate && (
                            <View className="p-4 bg-gray-100 rounded-lg mt-3">
                                <Text className="text-gray-600 text-sm">
                                    Next billing: {new Date(subscriptionInfo.latestExpirationDate).toLocaleDateString()}
                                </Text>
                            </View>
                        )}
                    </View>
                )}

                <View className="mt-6 p-3 bg-gray-50 rounded-lg">
                    <Text className="text-gray-500 text-xs text-center">
                        Subscription automatically renews unless canceled. Manage your subscription in App Store settings.
                    </Text>
                </View>
            </ScrollView>
        </ComponentWrapper>
    );
};

export default PremiumFinancialAdvice;