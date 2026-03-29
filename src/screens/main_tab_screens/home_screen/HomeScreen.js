import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, Modal, TouchableOpacity, Dimensions, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Video, Audio } from 'expo-av';
import AppHeader from '../../../components/AppHeader';
import { BellDot, X, Maximize, Minimize, Play, Pause, Volume2, VolumeX } from 'lucide-react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Cards from './Cards';
import SavingsGoalCard from './SavingsGoalCard';
import QuickCalculators from './QuickCalculators';
import FinancialCalendar from './FinancialCalendar';
import { useNavigation } from '@react-navigation/native';
import { get_analytics, get_formated_time, get_last_analytics, get_notifications } from '../ScreensAPI';
import { ActivityIndicator } from 'react-native';
import Indicator from '../../../components/Indicator';
import { useAuth } from '../../../context/AuthProvider';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { initializeRevenueCat } from '../../../hooks/SubscriptionStatus';
import { User } from 'lucide-react-native';

    const { width, height } = Dimensions.get('window');

const HomeScreen = () => {
    
    const navigation = useNavigation()
    const {setNotifications, initiateNotificationSocket, authToken, notifications} = useAuth()

    const [history, setHistory] = useState({});
    const [visible, setVisible] = useState(false);
    const {setFinancialForecast, setUserProfile, userProfile, setIsSubscribed, setSubscriptionInfo, loginVideoUrl} = useAuth()

    const [showVideoModal, setShowVideoModal] = useState(false);
    const [isVideoLoading, setIsVideoLoading] = useState(false);
    const [resizeMode, setResizeMode] = useState('contain');
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(false);
    const [status, setStatus] = useState(null);
    const [showControls, setShowControls] = useState(true);
    const [scaleVideo, setScaleVideo] = useState(1);
    const videoRef = useRef(null);
    const controlsTimeoutRef = useRef(null);
    const handleGetHistory = () => {
        setVisible(true);
        get_analytics((res) => {
            if(res){
                console.log("user profile -> ", JSON.stringify(res?.data, null, 2))
                setUserProfile(res?.data);
                initializeRevenueCat(res?.data?.user, (isSubscribed, subscriptionInfo) => {
                    const isTrue = (isSubscribed)
                    //|| subscriptionInfo?.originalAppUserId === 'bravohure@gmail.com'
                    setIsSubscribed(isTrue);
                    setSubscriptionInfo(subscriptionInfo);
                })
            }else{

            }
            setVisible(false);
        })
        get_last_analytics((res) => {
            if(res){
             
                setFinancialForecast(res?.data)
            }
        })
    }

    const handleGetNotifications = () => {
        get_notifications(res => {
            if(res){
                const temp = res?.data?.result?.map(item => {
                    const d = get_formated_time(item.createdAt)
                    return {
                        id: item._id,
                        type: item.type,
                        icon: 'bell',
                        title: item.title,
                        description: item.message,
                        time: d.time + " - " + d.month + " " + d.year, 
                        section: new Date(item.createdAt).getDate() == new Date().getDate()?"Recent":"Old"
                    }
                })
                setNotifications(temp)
                
            }
        })
    }

    const handleCloseVideo = async () => {
        if (videoRef.current) {
            try {
                await videoRef.current.stopAsync();
                await videoRef.current.unloadAsync();
            } catch (error) {
               
            }
        }
        setShowVideoModal(false);
        setIsVideoLoading(false);
        setResizeMode('cover');
        setIsPlaying(true);
        setIsMuted(false);
        setStatus(null);
        if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
        }
    }

    const toggleResizeMode = () => {
        // setResizeMode(prevMode => prevMode === 'fill' ? 'contain' : 'fill');
        const temp = scaleVideo == 1? height/width: 1;
  
        setScaleVideo(temp);
    }

    const togglePlayPause = async () => {
        if (!videoRef.current) return;
        if (isPlaying) {
            await videoRef.current.pauseAsync();
        } else {
            await videoRef.current.playAsync();
        }
        setIsPlaying(!isPlaying);
        resetControlsTimeout();
    }

    const toggleMute = async () => {
        if (videoRef.current) {
            await videoRef.current.setIsMutedAsync(!isMuted);
            setIsMuted(!isMuted);
            resetControlsTimeout();
        }
    }

    const handleVideoPress = () => {
        setShowControls(true);
        resetControlsTimeout();
    }

    const resetControlsTimeout = () => {
        if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
        }
        controlsTimeoutRef.current = setTimeout(() => {
            setShowControls(false);
        }, 3000);
    }

    const formatTime = (millis) => {
        if (!millis) return '0:00';
        const totalSeconds = Math.floor(millis / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    const onSeek = async (evt, width) => {
        if (!status || !videoRef.current) return;
        const x = evt.nativeEvent.locationX;
        const percent = x / width;
        const newPosition = percent * status.durationMillis;
        await videoRef.current.setPositionAsync(newPosition);
        resetControlsTimeout();
    }
    useEffect(() => {
        const enableAudio = async () => {
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                playsInSilentModeIOS: true,  
                staysActiveInBackground: false,
                shouldDuckAndroid: true,
            });
        };
        enableAudio();
    }, []);

    useFocusEffect(
        useCallback(() => {
            handleGetHistory()
        }, [])
    )

    useEffect(() => {
       handleGetNotifications()
    }, [])

    useEffect(() => {
        if(authToken?.accessToken && notifications.length>0){
            initiateNotificationSocket(authToken?.accessToken)
        }
        
    },[authToken?.accessToken, authToken, notifications])


    useEffect(() => {
        if (loginVideoUrl) {
            setShowVideoModal(true);
            setShowControls(true);
            resetControlsTimeout();
        }
    }, [loginVideoUrl])

    useEffect(() => {
        return () => {
            if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current);
            }
        };
    }, [])

    return (
        <SafeAreaView  className="flex-1 bg-[#4F55BA]">
            <StatusBar style="light" backgroundColor="#4F55BA" />
            <View className="px-5 pb-4">
                <AppHeader 
                    left={() => {
                        return <View className="flex-row justify-between items-center"> 

                            <Pressable onPress={() => navigation.navigate("ProfileStack")}>
                                {userProfile?.user?.image ?
                                    <Image
                                        className="h-[30] w-[30] rounded-full"
                                        source={{uri:userProfile?.user?.image}}
                                    />:
                                    <View className="items-center rounded-full justify-center h-[40] w-[40] bg-white">
                                        <User size={25}/>
                                    </View>
                                }
                            </Pressable>
                            

                            <View className="ml-3">
                                <Text className="text-white font-archivo-semi-bold text-lg">Welcome</Text>
                                <Text className="text-white text-sm font-archivo-semi-bold">{userProfile?.user?.name}</Text>
                            </View>

                        </View>
                    }}
                    right={() => <BellDot onPress={() => navigation.navigate("NotificationsFeedScreen")} size={24} color={"white"}/>}
                />
            </View>
            <View className="h-full bg-white ">
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text className="text-center font-archivo-regular text-2xl my-2">Dashboard</Text>
                    <Cards/>
                    <SavingsGoalCard 
                        onPress={() => navigation.navigate("SavingsGoals", {goals_rate:parseInt(userProfile?.savingGoalCompletionRate), saved_amount: '£'+ Number(userProfile?.totalSavedMoney).toFixed(0)})}
                        progress={parseInt(userProfile?.savingGoalCompletionRate) || 0}
                        amount={Number(userProfile?.totalSavedMoney)? '£'+ Number(userProfile?.totalSavedMoney).toFixed(0): '£'+0 }
                    />
                    <QuickCalculators/>
                    <FinancialCalendar/>

                </ScrollView>
            </View>


            <Modal
                visible={showVideoModal}
                animationType="fade"
                transparent={false}
                onRequestClose={handleCloseVideo}
            >
                <View style={styles.modalContainer}>
                    <StatusBar style="light" />
                    
    
                    <TouchableOpacity 
                        activeOpacity={1} 
                        onPress={handleVideoPress}
                        style={styles.videoTouchable}
                    >
                        {loginVideoUrl && showVideoModal && (
                            <Video
                                ref={videoRef}
                                source={{ uri: loginVideoUrl }}
                                style={{...styles.video, transform: [{scaleY: scaleVideo}]}}
                                useNativeControls={false}
                                resizeMode={resizeMode}
                                shouldPlay={true}
                                isLooping={false}
                                isMuted={isMuted}
                                volume={1.0}
                                onLoadStart={() => {
                                
                                    setIsVideoLoading(true);
                                }}
                                onLoad={(loadStatus) => {
                                  
                                    setIsVideoLoading(false);
                                }}
                                onReadyForDisplay={() => {
                                  
                                    setIsVideoLoading(false);
                                }}
                                onPlaybackStatusUpdate={(playbackStatus) => {
                                    setStatus(playbackStatus);
                                    if (playbackStatus.isLoaded) {
                                        setIsPlaying(playbackStatus.isPlaying);
                                        if (playbackStatus.didJustFinish) {
                                            handleCloseVideo();
                                        }
                                    }
                                }}
                                onError={(error) => {
                                 
                                    setIsVideoLoading(false);
                                }}
                            />
                        )}
                    </TouchableOpacity>
                    
                    {showControls && !isVideoLoading && (
                        <>
                        
                            <View style={styles.topControls}>
                             
                                <TouchableOpacity 
                                    style={styles.resizeButton}
                                    onPress={toggleResizeMode}
                                    activeOpacity={0.8}
                                >
                                    {scaleVideo != 1 ? (
                                        <Minimize size={20} color="white" />
                                    ) : (
                                        <Maximize size={20} color="white" />
                                    )}
                                    <Text style={styles.resizeText}>
                                        {scaleVideo != 1 ? 'Fit' : 'Fill'}
                                    </Text>
                                </TouchableOpacity>

                    
                                <TouchableOpacity 
                                    style={styles.skipButton}
                                    onPress={handleCloseVideo}
                                    activeOpacity={0.8}
                                >
                                    <X size={20} color="white" />
                                    <Text style={styles.skipText}>Skip</Text>
                                </TouchableOpacity>
                            </View>

                            {status && status.isLoaded && (
                                <View style={styles.bottomControls}>
                
                                    <View style={styles.progressContainer}>
                                        <Text style={styles.timeText}>{formatTime(status.positionMillis)}</Text>
                                        <View style={styles.progressBarContainer}>
                                            <TouchableOpacity
                                                activeOpacity={1}
                                                onPress={(evt) => onSeek(evt, width - 120)}
                                                style={styles.progressTouchable}
                                            >
                                                <View style={styles.progressBar}>
                                                    <View
                                                        style={[
                                                            styles.progressFill,
                                                            {
                                                                width: status.durationMillis 
                                                                    ? `${(status.positionMillis / status.durationMillis) * 100}%` 
                                                                    : '0%'
                                                            }
                                                        ]}
                                                    />
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                        <Text style={styles.timeText}>{formatTime(status.durationMillis)}</Text>
                                    </View>

                         
                                    <View style={styles.controlButtons}>
                                        <TouchableOpacity onPress={toggleMute} style={styles.controlButton}>
                                            {isMuted ? <VolumeX size={28} color="#FFF" /> : <Volume2 size={28} color="#FFF" />}
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={togglePlayPause} style={styles.playButton}>
                                            {isPlaying ? <Pause size={36} color="#FFF" /> : <Play size={36} color="#FFF" />}
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        </>
                    )}
                    
                    {isVideoLoading && (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#fff" />
                            <Text style={styles.loadingText}>Loading video...</Text>
                        </View>
                    )}
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    videoTouchable: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    video: {
        width: width,
        height: height,
        backgroundColor: '#000',
        transform: [{scaleY: 1}]
    },
    topControls: {
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        zIndex: 10,
    },
    resizeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6,
    },
    resizeText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    skipButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6,
    },
    skipText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    bottomControls: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        zIndex: 10,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    timeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
    progressBarContainer: {
        flex: 1,
        marginHorizontal: 10,
    },
    progressTouchable: {
        width: '100%',
        paddingVertical: 10,
    },
    progressBar: {
        height: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#3B82F6',
    },
    controlButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 30,
    },
    controlButton: {
        width: 50,
        height: 50,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playButton: {
        width: 60,
        height: 60,
        backgroundColor: 'rgba(59, 130, 246, 0.9)',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContainer: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: 'white',
        marginTop: 10,
        fontSize: 16,
    },
})

export default HomeScreen;