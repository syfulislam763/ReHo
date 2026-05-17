import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Platform,
    ActivityIndicator,
    Alert,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Purchases, { LOG_LEVEL, PURCHASES_ERROR_CODE } from 'react-native-purchases';
import ComponentWrapper from '../../../components/ComponentWrapper';
import PrimaryButton from '../../../components/PrimaryButton';
import { useAuth } from '../../../context/AuthProvider';
import {
    REVENUECAT_IOS_API_KEY,
    PREMIUM_ENTITLEMENT_ID,
    REVENUECAT_ANDROID_API_KEY,
} from '../../../constants/Paths';
import { Linking } from 'react-native';
import PremiumFinancialAdvice from './PremiumFinancialAdvice';

const TERMS_OF_USE_URL = 'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/';
const PRIVACY_POLICY_URL = 'https://rehowealth.co.uk/privacy-policy-2/';

const comparisonFeatures = [
    { label: "Ask financial planners questions via AI chat",           free: false, pro: true },
    { label: "Financial Book Appointment With Planner(UK)",      free: false, pro: true },
    { label: "Access Exclusive tips, insights, and market analysis", free: false, pro: true },
    { label: "Priority support for all your financial queries",       free: false, pro: true },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const CheckMark = () => (
    <Text className="text-green-300 text-base font-bold">✓</Text>
);

const Dash = () => (
    <Text className="text-white text-base">—</Text>
);

const ComparisonTable = () => (
    <View className="rounded-2xl overflow-hidden border border-white/20 bg-white/10 mt-5">
        {/* Header */}
        <View className="flex-row border-b border-white/15">
            <View className="flex-[1.4] px-4 py-3">
                <Text className="text-white text-[13px] font-semibold tracking-widest uppercase">Feature</Text>
            </View>
            <View className="flex-1 items-center justify-center py-3 border-l border-white/15">
                <Text className="text-white text-[13px] font-semibold tracking-widest uppercase">Free</Text>
            </View>
            <View className="flex-1 items-center justify-center py-3 border-l border-white/15 bg-white/10">
                <Text className="text-yellow-400 text-[13px] font-bold tracking-widest uppercase">✦ Pro</Text>
            </View>
        </View>

        {/* Rows */}
        {comparisonFeatures.map((item, index) => (
            <View
                key={index}
                className={`flex-row ${index < comparisonFeatures.length - 1 ? 'border-b border-white/10' : ''}`}
            >
                <View className="flex-[1.4] px-4 py-3 justify-center">
                    <Text className="text-white text-[14px] leading-5">{item.label}</Text>
                </View>
                <View className="flex-1 items-center justify-center py-3 border-l border-white/10">
                    {item.free ? <CheckMark /> : <Dash />}
                </View>
                <View className="flex-1 items-center justify-center py-3 border-l border-white/10 bg-white/[0.06]">
                    {item.pro ? <CheckMark /> : <Dash />}
                </View>
            </View>
        ))}
    </View>
);

const LegalFooter = () => (
    <View className="mt-5 px-2">
        <Text className="text-white text-base text-center leading-5">
            By subscribing, you agree to our{' '}
            <Text className="text-white underline" onPress={() => Linking.openURL(TERMS_OF_USE_URL)}>
                Terms of Use
            </Text>
            {' '}and{' '}
            <Text className="text-white underline" onPress={() => Linking.openURL(PRIVACY_POLICY_URL)}>
                Privacy Policy
            </Text>
            . Subscription automatically renews unless cancelled at least 24 hours before the end
            of the current period. Manage or cancel your subscription in your App Store account
            settings.
        </Text>
    </View>
);

// ─── Main component ───────────────────────────────────────────────────────────

const PremiumFinancialAdvice2 = () => {
    const [currentPackage, setCurrentPackage]     = useState(null);
    const [introOffer, setIntroOffer]             = useState(null);
    const [isLoading, setIsLoading]               = useState(true);
    const [isPurchasing, setIsPurchasing]         = useState(false);
    const [isSubscribed, setIsSubscribed]         = useState(false);
    const [subscriptionInfo, setSubscriptionInfo] = useState(null);
    const [testingMode, setTestingMode]           = useState(false);
    const [currentUser, setCurrentUser]           = useState(null);
    const navigation = useNavigation();

    const { userProfile } = useAuth();

    useEffect(() => {
        initializeRevenueCat();
    }, []);

    // ── All business logic UNCHANGED ─────────────────────────────────────────

    const getCurrentUserInfo = async () => {
        try {
            const userJson = userProfile?.user;
            const user = userJson ? userJson : null;
            if (user && user.email) {
                setCurrentUser(user);
                return user;
            }
            return null;
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
            }
        } catch (error) {}
    };

    const setUserAttributes = async (user) => {
        try {
            if (user.email) await Purchases.setEmail(user.email);
            if (user.name)  await Purchases.setDisplayName(user.name);
            const attributes = {
                'user_id':     user._id || user.uid || '',
                'signup_date': user.createdAt || new Date().toISOString(),
                'user_type':   user.role || 'standard',
            };
            await Purchases.setAttributes(attributes);
        } catch (error) {}
    };

    const detectTestingEnvironment = async () => {
        try {
            const customerInfo = await Purchases.getCustomerInfo();
            const isTest = customerInfo.originalAppUserId.includes('RCAnonymous') || __DEV__;
            setTestingMode(isTest);
        } catch (error) {}
    };

    const checkStrictEligibility = async (pkg) => {
        try {
            const productId = pkg.product.identifier;
            const eligibilityMap = await Purchases.checkTrialOrIntroductoryPriceEligibility([productId]);
            const introStatus = eligibilityMap[productId]?.status;
            const customerInfo = await Purchases.getCustomerInfo();
            const hasPastEntitlements = Object.keys(customerInfo.entitlements.all).length > 0;
            const hasPurchasedBefore  = customerInfo.allPurchaseDates[productId] !== undefined;
            if (introStatus === 2 && !hasPastEntitlements && !hasPurchasedBefore) return true;
            return false;
        } catch (error) {
            console.error('Eligibility check failed', error);
            return false;
        }
    };

    const fetchOfferings = async () => {
        try {
            const offerings = await Purchases.getOfferings();
            if (__DEV__) console.log('Offerings:', JSON.stringify(offerings, null, 2));
            if (offerings.current && offerings.current.availablePackages.length > 0) {
                const monthlyPackage = offerings.current.monthly || offerings.current.availablePackages[0];
                setCurrentPackage(monthlyPackage);
                console.log(monthlyPackage, 'monthly');
                const intro = monthlyPackage.product.introPrice;
                if (intro) {
                    const eligible = await checkStrictEligibility(monthlyPackage);
                    if (eligible) setIntroOffer(intro);
                }
            }
        } catch (error) {}
    };

    const checkSubscriptionStatus = async () => {
        try {
            const customerInfo = await Purchases.getCustomerInfo();
            console.log('customerInfo', JSON.stringify(customerInfo, null, 2));
            const hasActiveSubscription =
                customerInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID]?.isActive === true;
            setIsSubscribed(hasActiveSubscription);
            setSubscriptionInfo(customerInfo);
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
                    { text: 'Go to Login', onPress: () => navigation.navigate('Login') },
                ]
            );
            return;
        }
        setIsPurchasing(true);
        try {
            const { customerInfo } = await Purchases.purchasePackage(currentPackage);
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
                    Alert.alert('Success', 'Your offer code has been applied! Premium access is now active.',
                        [{ text: 'Continue', onPress: () => {} }]
                    );
                }
            } catch (error) {
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
                            Alert.alert('Success', 'Your promo code has been applied! Premium access is now active.',
                                [{ text: 'Continue', onPress: () => {} }]
                            );
                        }
                    }, 3000);
                } else {
                    Alert.alert('Error', 'Unable to open Google Play.');
                }
            } catch (error) {
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

    const getTrialPeriodText = () => {
        if (!introOffer) return null;
        const count = introOffer.periodNumberOfUnits;
        switch (introOffer.periodUnit) {
            case 'DAY':   return count === 1 ? '1 Day'   : `${count} Days`;
            case 'WEEK':  return count === 1 ? '7 Day'  : `${count} Weeks`;
            case 'MONTH': return count === 1 ? '1 Month' : `${count} Months`;
            case 'YEAR':  return count === 1 ? '1 Year'  : `${count} Years`;
            default:      return introOffer.period;
        }
    };

    const isFreeIntro = introOffer && introOffer.price === 0;

    const getSubscribeButtonText = () => {
        if (isPurchasing) return null;
        if (isFreeIntro) return 'Continue';
        if (introOffer)  return `Try for ${introOffer.priceString}`;
        return 'Subscribe Now';
    };

    // ── Loading ───────────────────────────────────────────────────────────────
    if (isLoading) {
        return (
            <ComponentWrapper title="Subscription Plan">
                <View className="flex-1 justify-center items-center h-40">
                    <ActivityIndicator size="large" color="#c02fb5" />
                    <Text className="text-gray-600 mt-4">Loading subscription plans...</Text>
                </View>
            </ComponentWrapper>
        );
    }

    // ── Subscribed ────────────────────────────────────────────────────────────
    if (isSubscribed) {
        return (
            <PremiumFinancialAdvice isSubscribed={isSubscribed}/>
        );
    }

    // ── Main UI ───────────────────────────────────────────────────────────────
    return (
        <ComponentWrapper container_bg='bg-[#9a00e5]' bg_color="bg-[#9a00e5]" title="Subscription Plan">
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60, backgroundColor: '#9a00e5' }}>

                {/* Hero title */}
                <Text className="text-white text-3xl font-bold text-center leading-10 mb-5">
                    {isFreeIntro
                        ? `Start Your ${getTrialPeriodText()}\nFree trial`
                        : 'Start Your 7 Day\nFree trial'}
                </Text>

                {/* Offer badge row */}
                <View className="flex-row items-center justify-between bg-white/15 border border-white/25 rounded-xl px-4 py-3 mb-2">
                    <View className="flex-row items-center gap-2">
                        <Text className="text-white text-xl font-semibold">
                            {isFreeIntro ? `${getTrialPeriodText()} Free` : '7 Day Free'}
                        </Text>
                    </View>
                    <TouchableOpacity
                        className="bg-white rounded-lg px-3 py-1"
                        onPress={handleRedeemOfferCode}
                    >
                        <Text className="text-[#b02fbf] text-xl font-semibold">Redeem offer code</Text>
                    </TouchableOpacity>
                </View>

                {/* Comparison table */}
                <ComparisonTable />

                {/* Pricing footnote */}
                {currentPackage && (
                    <Text className="text-white text-base text-center mt-5 mb-4 leading-5">
                        {isFreeIntro
                            ? `${getTrialPeriodText()} free and then £0.75 a week.\n${currentPackage.product.priceString} billed monthly`
                            : `${currentPackage.product.priceString} billed monthly`}
                    </Text>
                )}

                {/* CTA */}
               
                <TouchableOpacity disabled={isPurchasing || !currentPackage} onPress={handleSubscribe}>
                    {isPurchasing?<ActivityIndicator color="#FFFFFF" /> :
                    
                    <View className={`bg-white items-center py-4 rounded-md`}>
                        <Text className="text-[#9a00e5] font-archivo-semi-bold text-[15px]">Continue</Text>
                    </View>
                    }
                </TouchableOpacity>

                {/* Restore */}
                <TouchableOpacity className="mt-4 items-center" onPress={handleRestorePurchases}>
                    <Text className="text-white text-base underline">Restore Purchases</Text>
                </TouchableOpacity>

                {/* Cancel note */}
                <Text className="text-white text-base text-center mt-2 mb-1">
                    Cancel anytime. No commitment.
                </Text>

                <LegalFooter />
            </ScrollView>
        </ComponentWrapper>
    );
};

export default PremiumFinancialAdvice2;