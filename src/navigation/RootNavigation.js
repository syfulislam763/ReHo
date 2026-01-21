import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useAuth } from '../context/AuthProvider';
import AuthStack from './AuthStack';
import MainTabs from './MainTabs';

const RootNavigation = () => {
    const {isAuthenticated} = useAuth()
   
    return isAuthenticated?<MainTabs/>:<AuthStack/>
    
}

const styles = StyleSheet.create({})

export default RootNavigation;
