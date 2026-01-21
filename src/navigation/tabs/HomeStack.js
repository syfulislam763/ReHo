import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../../screens/main_tab_screens/home_screen/HomeScreen";
import IncomeTracker from "../../screens/main_tab_screens/home_screen/income/IncomeTracker";
import AddIncomeForm from "../../screens/main_tab_screens/home_screen/income/AddIncomeFrom";
import ExpenseItem from "../../screens/main_tab_screens/home_screen/expences/ExpenseItem";
import AddExpenseForm from "../../screens/main_tab_screens/home_screen/expences/AddExpenseFrom";
import ExpenseAnalytics from "../../screens/main_tab_screens/home_screen/expences/ExpenseAnalytics";
import FutureValueCalculator from "../../screens/main_tab_screens/home_screen/inflation/FutureValueCalculator";
import FutureValueProjection from "../../screens/main_tab_screens/home_screen/inflation/FutureValueProjection";
import DebtManagement from "../../screens/main_tab_screens/home_screen/debt_management/DebtManagement";
import AddDebtScreen from "../../screens/main_tab_screens/home_screen/debt_management/AddDebtScreen";
import DebtListComponent from "../../screens/main_tab_screens/home_screen/debt_management/DebtListComponent";
import LoanDetailComponent from "../../screens/main_tab_screens/home_screen/debt_management/LoanDetailsComponent";
import AISuggestionsComponent from "../../screens/main_tab_screens/home_screen/debt_management/AISuggestionsComponent";
import FinancialForm from "../../screens/main_tab_screens/home_screen/goal_saving/FinancialForm";
import FinancialSummary from "../../screens/main_tab_screens/home_screen/goal_saving/FinancialSummary";
import SavingsGoals from "../../screens/main_tab_screens/home_screen/goal_saving/SavingsGoals";
import SavingsGoalForm from "../../screens/main_tab_screens/home_screen/goal_saving/SavingsGoalForm";
import PremiumFinancialAdvice from "../../screens/main_tab_screens/profile_screen/PremiumFinancialAdvice";
import NotificationsFeedScreen from "../../screens/main_tab_screens/profile_screen/NotificationsFeedScreen";

const Stack = createNativeStackNavigator();



export default function HomeStack(){
    return (
        <Stack.Navigator screenOptions={{headerShown:false}}>
            <Stack.Screen 
                name="HomeScreen"
                component={HomeScreen}
            />

            <Stack.Screen 
                name="IncomeTracker"
                component={IncomeTracker}
            />

            <Stack.Screen 
                name="AddIncomeForm"
                component={AddIncomeForm}
            />

            <Stack.Screen 
                name="ExpenseItem"
                component={ExpenseItem}
            
            />

            <Stack.Screen
                name="AddExpenseForm"
                component={AddExpenseForm}
            />

            <Stack.Screen
                name="ExpenseAnalytics"
                component={ExpenseAnalytics}
            />

            <Stack.Screen 
            
                name="FutureValueCalculator"
                component={FutureValueCalculator}
            
            />

            <Stack.Screen 
                name="FutureValueProjection"
                component={FutureValueProjection}
            />

            <Stack.Screen 
                name="DebtManagement"
                component={DebtManagement}
            />

            <Stack.Screen
                name="AddDebtScreen"
                component={AddDebtScreen}
            />

            <Stack.Screen 
                name="DebtListComponent"
                component={DebtListComponent}
            />


            <Stack.Screen 
                name="LoanDetailComponent"
                component={LoanDetailComponent}
            />

            <Stack.Screen 
                name="AISuggestionsComponent"
                component={AISuggestionsComponent}
            />

            <Stack.Screen 
                name="SavingsGoals"
                component={SavingsGoals}
            />

            <Stack.Screen 
                name="FinancialForm"
                component={FinancialForm}
            />

            <Stack.Screen 
                name="FinancialSummary"
                component={FinancialSummary}
            />

            <Stack.Screen 
                name="SavingsGoalForm"
                component={SavingsGoalForm}
            />

            <Stack.Screen 
                name="PremiumFinancialAdvice"
                component={PremiumFinancialAdvice}
            />

            <Stack.Screen name="NotificationsFeedScreen" component={NotificationsFeedScreen}  />


        </Stack.Navigator>
    )
}