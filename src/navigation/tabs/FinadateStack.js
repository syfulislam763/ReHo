import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FinadateScreen from "../../screens/main_tab_screens/finadate_screen/FinadateScreen";
import BudgetListComponent from "../../screens/main_tab_screens/finadate_screen/BudgetListComponent";

const Stack = createNativeStackNavigator();

export default function FinadateStack (){
    return (
        <Stack.Navigator screenOptions={{headerShown:false}}>
            <Stack.Screen 
                name="BudgetListComponent"
                component={BudgetListComponent}
            />
            <Stack.Screen 
                name="FinadateScreen"
                component={FinadateScreen}
            />
            
        </Stack.Navigator>
    )
}