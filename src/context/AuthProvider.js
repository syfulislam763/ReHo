import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { logoutUser, loadAuthToken, setAuthToken as setTokens } from "../constants/api";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SOCKET_URL } from "../constants/Paths";
import { get_formated_time } from "../screens/main_tab_screens/ScreensAPI";
import { Token } from "@stripe/stripe-react-native";
import { io } from "socket.io-client";
import { endEvent } from "react-native/Libraries/Performance/Systrace";
import { logout_user } from "../screens/main_tab_screens/ScreensAPI";


const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isPersonalized, setIsPersonalized] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscriptionInfo, setSubscriptionInfo] = useState(null)
    const [authToken, setAuthToken] = useState({
        accessToken: "",
        refreshToken: "",
    });
    const [loginVideoUrl, setLoginVideoUrl] = useState(null)
    const [userProfile, setUserProfile] = useState({})
    const [financialForecast, setFinancialForecast] = useState({})
    const [notifications, setNotifications] = useState([])
    const notificationRef = useRef(null);
    const [isNotificationSocketConnected, setIsNotificationSocketConnected] = useState(false);

    

    const initiateNotificationSocket = (token) => {
        if(!token || notificationRef.current)return;
        const wsURL = "ws://10.10.10.32:5000?token="+token;
        notificationRef.current = io(wsURL);
        notificationRef.current.on('connect', (msg) => {
    

        })
        notificationRef.current.on('notification', (msg) => {

            const d = get_formated_time(msg?.createdAt);
            let temp = {
                id: msg?._id,
                type: msg?.type,
                icon: 'bell',
                title: msg?.title,
                description: msg?.message,
                time: d.time + " - " + d.month + " " + d.year, 
                section: new Date(msg?.createdAt).getDate() == new Date().getDate()?"Recent":"Old"
            }

            
            const arr = [temp, ...JSON.parse(JSON.stringify(notifications))]
            setNotifications(arr);
        })

        notificationRef.current.onAny((eventName) => {
         
        })

        

       
    }




    const handleLogout = () => {


        logoutUser(() => {
            setAuthToken({
                accessToken: "",
                refreshToken: "",
            })
            logout_user();
            setIsAuthenticated(false);
        })

    }

    const tempVideo1 = "https://rehoapp.lon1.cdn.digitaloceanspaces.com/others/How_to_create_a_budget_v3_1_1_.mp4";
    
    const handleLogin = (data) => {

        setTokens(data.accessToken, data.refreshToken, ()=>{
            setIsAuthenticated(true);
            setAuthToken({
                accessToken: data?.accessToken,
                refreshToken: data?.refreshToken
            })
            setLoginVideoUrl(data?.videoToShow);
            //console.log("video ->", JSON.stringify(data, null, 2))
        })
    }



    useEffect(() => {
        loadAuthToken((data) => {

            if(data?.accessToken){
                setAuthToken({
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken
                })
                setIsAuthenticated(true);
                //initiateNotificationSocket(data.accessToken)
            }else{
                setIsAuthenticated(false);
            }
            
        })
    }, [])

    
    //console.log(authToken)



    return (
        <AuthContext.Provider
            value={{
                isAuthenticated, 
                setIsAuthenticated,
                authToken,
                setAuthToken,
                SignOutUser:handleLogout,
                SignInUser:handleLogin, 
                userProfile,
                setUserProfile,
                financialForecast,
                setFinancialForecast,

                initiateNotificationSocket,
                isNotificationSocketConnected,
                notifications,
                setNotifications,

                isSubscribed,
                setIsSubscribed,

                subscriptionInfo,
                setSubscriptionInfo,

                loginVideoUrl
            }}
        >
            {children}
        </AuthContext.Provider>
    )

}

export const useAuth = () => {
    const context= useContext(AuthContext);
    if(!context) throw new Error("useAuth must be used within an AuthProvider");

    return context;
}