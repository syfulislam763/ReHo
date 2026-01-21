import "./global.css";
import { StyleSheet, Text, View } from 'react-native';
import 'react-native-gesture-handler';
import FontLoader from "./src/hooks/FontLoader";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from "./src/context/AuthProvider";
import Toast from "react-native-toast-message";
//import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaView } from "react-native";
import RootNavigation from "./src/navigation/RootNavigation";
import CustomToast from "./src/components/CustomToast";
import { SafeAreaProvider } from "react-native-safe-area-context";
const toastConfig = {
  customToast: (props) => <CustomToast {...props} />,
};


export default function App() {
  return (
    <FontLoader>
      
        <NavigationContainer>
          <SafeAreaProvider>
            <AuthProvider>
              <View style={{flex:1, backgroundColor:"white"}}>
                {/* <StatusBar/> */}
                <GestureHandlerRootView style={{ flex: 1 }}>
                  <RootNavigation/>
                </GestureHandlerRootView>
                

              </View>
            </AuthProvider>
          </SafeAreaProvider>
        </NavigationContainer>
      <Toast 
        topOffset={300}
        bottomOffset={0}
        
        //config={toastConfig}
      />
    </FontLoader>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
