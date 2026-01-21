import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Indicator = ({animationType="fade", visible, onClose, overlayStyle={}, modalContainerStyle={},headerStyle={}, children }) => {
  return (
    <Modal
      transparent={true}
      presentationStyle='overFullScreen'
      statusBarTranslucent={true}
      visible={visible}
      animationType={animationType}
      onRequestClose={onClose}
    >
      <SafeAreaView style={{...styles.overlay, ...overlayStyle}}>
        <View style={{...styles.modalContainer, ...modalContainerStyle}}>
            {children}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default Indicator;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#000000CC',
    justifyContent: 'center',
    alignItems: 'center',
    padding:20,
    height:'100%'

  },
  modalContainer: {
    width: '100%',
    height:"100%",
    display:'flex',
    justifyContent:'center',
    alignItems:'center'
  },
});