import config from "../../config";

// Base URLs from environment variables
export const ROOT_URL = config.API_URL;
export const SOCKET_URL = config.SOCKET_URL;
export const AI_ROOT_URL = config.AI_API_URL;
export const CHAT_URL = config.AI_CHAT_URL;

if(__DEV__){
    console.log(ROOT_URL);
    console.log(SOCKET_URL);
    console.log(CHAT_URL);
}

// AI Feedback URLs
export const EXP_FEEDBACK = `${AI_ROOT_URL}/feedback/optimize-expenses`;
export const DEBT_FEEDBACK = `${AI_ROOT_URL}/feedback/optimize-debt`;
export const BUD_FEEDBACK = `${AI_ROOT_URL}/feedback/optimize-budget`;
export const SAVINGS_TIPS = `${AI_ROOT_URL}/calculator/tips`

// RevenueCat Configuration
export const REVENUECAT_IOS_API_KEY = config.REVENUECAT_IOS_API_KEY;
export const REVENUECAT_ANDROID_API_KEY = config.REVENUECAT_ANDROID_API_KEY;
export const PREMIUM_ENTITLEMENT_ID = config.PREMIUM_ENTITLEMENT_ID;

// Auth API Endpoints
export const CREATE_USER = "/users";
export const VERIFY_EMAIL = "/auth/verify-email";
export const RESEND_OTP = "/auth/resend-otp";
export const LOGIN = "/auth/login";
export const FORGET_PASS = "/auth/forget-password";
export const RESET_PASS = "/auth/reset-password";
export const CHANGE_PASS = "/auth/change-password";
export const UPDATE_PROFILE = "/users/profile";
export const USER_PROFILE = "/users/profile";
export const LOGOUT = "/auth/logout"

// Budget Endpoints
export const BUDGET = "/budgets/";
export const MONTHLY_BUDGET = "/budgets/type";
export const BUDGET_ANALYSIS = "/budgets/analytics";

// Appointment Endpoints
export const APPOINTMENT = "/appointments/";

// Income Endpoints
export const INCOME = "/incomes/";

// Debt Endpoints
export const DEBTS = "/debts/";
export const DEBTS_SUMMARY = "/debts/insights";

// Expense Endpoints
export const EXPENSE = "/expenses/";
export const EXPENSE_ANALYSIS = "/expenses/analytics";

// Calculator Endpoints
export const SAVING_CALCULATOR = "/calculator/saving-calculator";
export const LOAN_CALCULATOR = "/calculator/loan-repayment-calculator";
export const INFLATION_CALCULATOR = "/calculator/inflation-calculator";
export const HISTORY_INFLATION_CALCULATOR = "/calculator/historical-inflation-calculator";

// Saving Goal Endpoints
export const SAVING_GOAL = "/saving-goals/";

// Date Night Endpoints
export const DATE_NIGHT = "/date-nights/";

// Package Endpoints
export const PACKAGE = "/packages/";

// Analytics Endpoints
export const GET_ANALYTICS = "/analytics/";
export const GET_LAST_ANALYTICS = "/analytics/user-last-update";

// Notification Settings Endpoints
export const NOTIFICATION_SETTINGS = "/notifications-settings/";

// Partner Request Endpoints
export const PARTNER_REQUEST = "/partner-requests/";
export const PARTNER_REQUEST_ACCEPT = "/partner-requests/accept-request/";
export const PARTNER_REQUEST_CANCELS = "/partner-requests/unlink/";

// Content Endpoints
export const CONTENT = "/contents/";

// Notification Endpoints
export const NOTIFICATION = "/notifications/";

// Subscription Endpoints
export const SUBSCRIPTION = '/subscriptions/';

// Ad Endpoints
export const AD_URL = "/ad/random-ads";

// User Management Endpoints
export const DELETE_ACCOUNT = "/users/delete";