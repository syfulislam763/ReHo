import React, { useCallback, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { 
  ChevronRight, 
  Users, 
  Lightbulb, 
  Bell, 
  FileText, 
  Lock, 
  Clock, 
  Play, 
  LogOut, 
  DollarSign,
  Edit3 ,
  User,
  Trash
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import ComponentWrapper from '../../../components/ComponentWrapper';
import AppHeader from '../../../components/AppHeader';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../context/AuthProvider';
import { USER_PROFILE } from '../../../constants/Paths';
import Indicator from '../../../components/Indicator';
import ToastMessage from '../../../constants/ToastMessage';
import { delete_account, update_profile } from '../ScreensAPI';


const ProfileScreen = () => {
  const [showRelationshipDropdown, setShowRelationshipDropdown] = useState(false);
  const [showSuggestionDropdown, setShowSuggestionDropdown] = useState(false);
  const [showDollarDropdown, setShowDollarDropdown] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [isImagePressed, setIsImagePressed] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const {SignOutUser, userProfile, isSubscribed} = useAuth();
  const navigation = useNavigation();

  const [visible, setVisible] = useState(false);

  const hanldeDeleteAccount = () => {
    setLoading(true);
    delete_account(res => {
      if(res){
        SignOutUser();
      }else{
        Alert("Failed to delete account")
      }

      setLoading(false);
    })
  }


  const uploadImageToBackend = async (imageUri) => {
    try {
      setIsUploading(true);

      console.log(imageUri)
      // Create FormData
      const formData = new FormData();
      
      // Get file extension
      const uriParts = imageUri.split('.');
      const fileType = uriParts[uriParts.length - 1];
      
      // Append image to FormData
      formData.append('image', {
        uri: imageUri,
        name: `profile_${Date.now()}.${fileType}`,
        type: `image/${fileType}`,
      });

      


      console.log('FormData ready to send:', formData);

      update_profile(formData, res => {
        if(res){
          console.log(res);
          console.log("updated image")
        }else{
          console.log("nope")
        }
      })
      setProfileImage(imageUri);

      ToastMessage("success", "Image selected! Ready to upload.", 2000);
      
      setIsUploading(false);
      return formData; // Return formData in case you want to use it elsewhere
      
    } catch (error) {
      console.error('Error uploading image:', error);
      ToastMessage("error", "Failed to process image", 2000);
      setIsUploading(false);
    }
  };

  const pickImage = async () => {
    // Request permission to access media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to change your profile picture!');
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      // Upload image to backend
      await uploadImageToBackend(imageUri);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setProfileImage(userProfile?.user?.image)
    }, [userProfile?.user?.image])
  )

  const MenuItem = ({ icon: Icon, title, hasArrow = true, isRed = false, onPress, children }) => (
    <View>
      <TouchableOpacity 
        className="flex-row items-center justify-between py-4"
        onPress={onPress}
      >
        <View className="flex-row items-center">
          <Icon 
            size={20} 
            color={isRed ? "#EF4444" : "#5055ba"} 
            className="mr-3"
          />
          <Text className={`text-lg ml-2 ${isRed ? 'text-red-500' : 'text-gray-700'}`}>
            {title}
          </Text>
        </View>
        {hasArrow && (
          <ChevronRight size={25} color="#9CA3AF" />
        )}
      </TouchableOpacity>
      {children}
    </View>
  );

  const SubMenuItem = ({ title, route="ContactFormScreen" }) => (
    <TouchableOpacity onPress={() => navigation.navigate(route)} className="py-3 px-6 ml-4">
      <Text className="text-gray-600 text-sm">{title}</Text>
    </TouchableOpacity>
  );

  return (
    <ComponentWrapper 
      headerComponent={() => 
        <AppHeader 
          middle={() => 
            <Text className="text-white font-archivo-semi-bold text-2xl">
              Profile
            </Text>
          }
        />
      } 
      bg_color='bg-button-bg'
    >
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Profile Section */}
        <View className="pt-8 pb-6 items-center">
          <TouchableOpacity 
            className="relative w-24 h-24 rounded-full mb-4 overflow-hidden"
            onPress={pickImage}
            onPressIn={() => setIsImagePressed(true)}
            onPressOut={() => setIsImagePressed(false)}
            activeOpacity={0.8}
            disabled={isUploading}
          >
            {profileImage ?
              <Image
              source={{ uri:  profileImage }}
              className="w-full h-full"
              resizeMode="cover"
            />:
            <View className="items-center justify-center h-full w-full bg-white">
              <User size={40}/>
            </View>
            }
            
            {/* Edit Overlay */}
            {isImagePressed && !isUploading && (
              <View className="absolute inset-0 bg-black bg-opacity-50 justify-center items-center">
                <Edit3 size={24} color="white" />
              </View>
            )}

            {/* Loading Overlay */}
            {isUploading && (
              <View className="absolute inset-0 bg-black bg-opacity-50 justify-center items-center">
                <ActivityIndicator size="small" color="white" />
              </View>
            )}
          </TouchableOpacity>
          
          <Text className="text-xl font-semibold text-gray-900 mb-1">
            {userProfile?.user?.name}
          </Text>
          
          <Text className="text-gray-500 mb-6">
            {userProfile?.user?.email}
          </Text>
          
          <TouchableOpacity onPress={() => navigation.navigate("PremiumFinancialAdvice")} className="bg-[#5055ba] py-3 rounded-[5px] w-full">
            <Text className="text-white text-center font-medium text-base">
              Subscribe To get ReHo Advice
            </Text>
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View className="mt-4">
          <MenuItem 
            icon={Users} 
            title="Relationship data"
            onPress={() => setShowRelationshipDropdown(!showRelationshipDropdown)}
          >
            {showRelationshipDropdown && (
              <View className="">
                <SubMenuItem route='PartnerForm' title="Partner Request" />
                <SubMenuItem route='PartnerRequestScreen' title="Partner History" />
              </View>
            )}
          </MenuItem>
          
          <MenuItem 
            icon={Lightbulb} 
            title="Suggestion Adviser"
            onPress={() => setShowSuggestionDropdown(!showSuggestionDropdown)}
          >
            {showSuggestionDropdown && ( <View className="">
                {/* <SubMenuItem route={isSubscribed?'ChatUIScreen':'PremiumFinancialAdvice'} title="Ask Financial Planner ( ReHo )" />
                <SubMenuItem title="Book Appointment" route= {isSubscribed?'ContactFormScreen':'PremiumFinancialAdvice'} /> */}
                <SubMenuItem route={'ChatUIScreen'} title="Ask Financial Planner ( ReHo )" />
                <SubMenuItem title="Book Appointment" route= {'ContactFormScreen'} />
              </View>
            )}
          </MenuItem>
          
          <MenuItem 
            icon={Bell} 
            title="Notification"
            hasArrow={false}
            onPress={() => navigation.navigate("NotificationsFeedScreen")}
          />
          
          <MenuItem 
            icon={FileText} 
            title="Terms and Privacy Policy"
            hasArrow={false}
            onPress={() => navigation.navigate("TermsAndPolicy")}
          />
          
          <MenuItem 
            icon={Lock} 
            title="Change Password"
            hasArrow={false}
            onPress={() => navigation.navigate("ChangePassword")}
          />
          
          <MenuItem 
            icon={Clock} 
            title="Reminder Notification set"
            hasArrow={false}
            onPress={() => navigation.navigate("FinancialRemindersSettings")}
          />
          
          <MenuItem 
            icon={Play} 
            title="Financial Videos"
            hasArrow={false}
            onPress={() => navigation.navigate("VideoTutorialsScreen")}
          />
          
          <MenuItem 
            icon={LogOut} 
            title="Log out"
            hasArrow={false}
            isRed={true}
            onPress={() => SignOutUser()}
          />

          <MenuItem 
            icon={Trash} 
            title="Delete Account"
            hasArrow={false}
            isRed={true}
            onPress={() => setVisible(true)}
          />
        </View>


        {visible && Alert.alert(
          "Confirm Delete",
          "Are you sure you want to delete this account?",
          [
            {
              text: "Cancel",
              onPress: () => setVisible(false),
              style: "cancel"
            },
            {
              text: "Delete",
              onPress: () => {
                hanldeDeleteAccount();
              },
              style: "destructive"
            }
          ]
        )}



        {loading && <Indicator visible={loading} onClose={() => setLoading(false)}>
            <ActivityIndicator size={"large"}/>
          </Indicator>}
      </ScrollView>
    </ComponentWrapper>
  );
};

export default ProfileScreen;