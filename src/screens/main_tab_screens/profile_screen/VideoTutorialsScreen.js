import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Clock, Play, X, Pause, Volume2, VolumeX, SkipBack, SkipForward } from 'lucide-react-native';
import ComponentWrapper from '../../../components/ComponentWrapper';
import { Video } from 'expo-av';
//import { generateThumbnailsAsync } from 'expo-video'; 
import * as VideoThumbnails from 'expo-video-thumbnails';
import { get_contents } from '../ScreensAPI';
import Indicator from '../../../components/Indicator';
import { useFocusEffect } from '@react-navigation/native';

const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const VideoTutorialsScreen = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [progressWidth, setProgressWidth] = useState(0);
  const [visible, setVisible] = useState(false);
  const [videos, setVideos] = useState([]);
  const videoRef = useRef(null);

  const categories = ['All', 'Budget', 'Debt', 'Saving', 'Investment'];

 

  const handleGetContent = () => {
    setVisible(true);

    get_contents(async (res) => {
      if (res && res.data && res.data.result) {
        const videosWithThumbnails = await Promise.all(
          res.data.result.map(async (video) => {
            if (video.thumbnail && video.thumbnail.startsWith('http')) {
              return video;
            }

            if (video.videoUrl) {
              try {
                const { uri } = await VideoThumbnails.getThumbnailAsync(
                  video.videoUrl,
                  { time: 500, quality: 0.5 } // time in milliseconds
                );
                return { ...video, thumbnail: uri };
              } catch (e) {
                console.warn('Error generating thumbnail for:', video.title, e);
                return video;
              }
            }

            return video;
          })
        );
        //console.log("videos -> ", JSON.stringify(videosWithThumbnails, null, 2))
        setVideos(videosWithThumbnails);
      }

      setVisible(false);
    });
  };

  useFocusEffect(
    useCallback(() => {
      handleGetContent();
    }, [])
  );

  const handleVideoOpen = (video) => {
    setSelectedVideo(video);
    setIsPlaying(true);
  };

  const handleVideoClose = async () => {

    if (videoRef.current) {
      try {
        await videoRef.current.stopAsync();
      } catch (error) {

      }
      videoRef.current = null;
    }
    setSelectedVideo(null);
    setIsPlaying(false);
    setIsMuted(false);
    setStatus(null);
    setProgressWidth(0);
  };

  const togglePlayPause = async () => {
    if (!videoRef.current) return;
    if (isPlaying) await videoRef.current.pauseAsync();
    else await videoRef.current.playAsync();
    setIsPlaying(!isPlaying);
  };

  const toggleMute = async () => {
    if (!videoRef.current) return;
    await videoRef.current.setIsMutedAsync(!isMuted);
    setIsMuted(!isMuted);
  };

  const skipForward = async () => {
    if (!videoRef.current || !status) return;
    await videoRef.current.setPositionAsync(
      Math.min(status.positionMillis + 10000, status.durationMillis)
    );
  };

  const skipBackward = async () => {
    if (!videoRef.current || !status) return;
    await videoRef.current.setPositionAsync(
      Math.max(status.positionMillis - 10000, 0)
    );
  };

  const onSeek = async (evt) => {
    if (!status || !videoRef.current || !progressWidth) return;
    const x = evt.nativeEvent.locationX;
    const percent = x / progressWidth;
    const newPosition = percent * status.durationMillis;
    await videoRef.current.setPositionAsync(newPosition);
  };

  const formatTime = (millis) => {
    if (!millis) return '0:00';
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const CategoryButton = ({ category, isActive }) => (
    <TouchableOpacity
      className={`px-4 py-2 h-12 items-center justify-center rounded-lg mr-3 ${
        isActive ? 'bg-blue-500' : 'border border-gray-300'
      }`}
      onPress={() => setActiveCategory(category)}
    >
      <Text className={`text-sm font-medium ${isActive ? 'text-white' : 'text-gray-700'}`}>
        {category}
      </Text>
    </TouchableOpacity>
  );

  const VideoCard = ({ video }) => (
    <TouchableOpacity className="w-[48%] mb-4" onPress={() => handleVideoOpen(video)}>
      <View className="relative">
        <Image
          source={{ uri: video?.thumbnail }}
          className="w-full h-32 rounded-t-md"
          resizeMode="cover"
        />
        <View className="absolute inset-0 justify-center items-center">
          <View className="w-10 h-10 bg-white bg-opacity-90 rounded-full justify-center items-center">
            <Play size={16} color="#3B82F6" fill="#3B82F6" />
          </View>
        </View>
      </View>
      <View className="bg-white p-3 rounded-b-md">
        <Text className="text-gray-800 text-sm font-medium my-2 leading-5">{video.title}</Text>
        <View className="flex-row items-center mt-1">
          <Clock size={12} color="#9CA3AF" />
          <Text className="text-gray-500 text-xs ml-1">{video.duration}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const filteredVideos =
    activeCategory === 'All' ? videos : videos.filter((v) => v.category === activeCategory);

  return (
    <ComponentWrapper bg_color="bg-[#5055ba]" title="Financial Videos">
      <View className="flex-1">
        {/* Category Filters */}
        <View className="flex-row flex-wrap gap-y-2 items-center py-5">
          {categories.map((cat, i) => (
            <CategoryButton key={i} category={cat} isActive={activeCategory === cat} />
          ))}
        </View>

        {/* Video Grid */}
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="flex-row flex-wrap justify-between">
            {filteredVideos.map((v) => (
              <VideoCard key={v._id || v.title} video={v} />
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Full Video Modal */}
      <Modal
        visible={!!selectedVideo}
        transparent
        animationType="fade"
        onRequestClose={handleVideoClose}
      >
        <View className="flex-1 bg-black">
          {/* Close Button */}
          <TouchableOpacity
            className="absolute top-12 right-4 z-50 w-10 h-10 bg-white/20 rounded-full items-center justify-center"
            onPress={handleVideoClose}
          >
            <X size={24} color="#FFF" strokeWidth={2.5} />
          </TouchableOpacity>

          <View className="flex-1 justify-center items-center">
            {selectedVideo && (
              <Video
                ref={videoRef}
                source={{ uri: selectedVideo.videoUrl }}
                style={{ width: '100%', height: 300 }}
                useNativeControls={false}
                resizeMode="contain"
                isLooping={false}
                shouldPlay={isPlaying}
                isMuted={isMuted}
                onLoadStart={() => setIsLoading(true)}
                onLoad={() => setIsLoading(false)}
                onPlaybackStatusUpdate={(st) => {
                  setStatus(st);
                  if (st.didJustFinish) setIsPlaying(false);
                }}
              />
            )}

            {isLoading && (
              <View className="absolute">
                <ActivityIndicator size="large" color="#FFF" />
              </View>
            )}

            {/* Playback Controls */}
            {status && status.isLoaded && (
              <View className="absolute bottom-16 left-0 right-0 px-6">
                {/* Progress Bar */}
                <View className="flex-row items-center mb-4">
                  <Text className="text-white text-xs mr-2">
                    {formatTime(status.positionMillis)}
                  </Text>
                  <View
                    className="flex-1 h-3 bg-white/30 rounded-full overflow-hidden"
                    onLayout={(e) => setProgressWidth(e.nativeEvent.layout.width)}
                  >
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={onSeek}
                      className="absolute top-0 left-0 h-full w-full"
                    >
                      <View
                        style={{
                          width: status.durationMillis
                            ? `${(status.positionMillis / status.durationMillis) * 100}%`
                            : '0%',
                          height: '100%',
                          backgroundColor: '#3B82F6',
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                  <Text className="text-white text-xs ml-2">
                    {formatTime(status.durationMillis)}
                  </Text>
                </View>

                {/* Buttons */}
                <View className="flex-row justify-center items-center">
                  <TouchableOpacity
                    className="w-12 h-12 bg-white/20 rounded-full items-center justify-center mr-1"
                    onPress={toggleMute}
                  >
                    {isMuted ? <VolumeX size={22} color="#FFF" /> : <Volume2 size={22} color="#FFF" />}
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="w-12 h-12 bg-white/20 rounded-full items-center justify-center mr-1"
                    onPress={skipBackward}
                  >
                    <SkipBack size={22} color="#FFF" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="w-16 h-16 bg-blue-500 rounded-full items-center justify-center mr-1"
                    onPress={togglePlayPause}
                  >
                    {isPlaying ? <Pause size={32} color="#FFF" /> : <Play size={32} color="#FFF" />}
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="w-12 h-12 bg-white/20 rounded-full items-center justify-center"
                    onPress={skipForward}
                  >
                    <SkipForward size={22} color="#FFF" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {visible && (
        <Indicator visible={visible} onClose={() => setVisible(false)}>
          <ActivityIndicator size="large" />
        </Indicator>
      )}
    </ComponentWrapper>
  );
};

export default VideoTutorialsScreen;