
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, Platform, StyleSheet, Animated, Pressable } from 'react-native';
import { PanResponder } from 'react-native';
import ComponentWrapper from '../../../components/ComponentWrapper';
import AppHeader from '../../../components/AppHeader';
import PrimaryButton from '../../../components/PrimaryButton';
import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { ThumbsUpIcon } from 'lucide-react-native';
import Indicator from '../../../components/Indicator';
import { ActivityIndicator } from 'react-native';
import {calculate_loan} from '../ScreensAPI'
import PrimaryInputField from '../../../components/PrimaryInputField';



const CustomSlider = ({ value, setValue, min, max, label, step = 1 }) => {
  const pan = useRef(new Animated.Value((value - min) / (max - min) * 300)).current;
  const sliderWidth = 300;
  const thumbSize = 0;
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const newPosition = ((value - min) / (max - min)) * sliderWidth;
    pan.setValue(newPosition);
  }, [value, min, max, sliderWidth]);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (e, gestureState) => {
      let newValue = Math.max(
        min,
        Math.min(Math.round((gestureState.moveX / sliderWidth) * max), max)
      );
      setValue(newValue);
      pan.setValue(gestureState.moveX);
    },
    onPanResponderRelease: () => {},
  });

  const thumbPosition = pan.interpolate({
    inputRange: [0, sliderWidth],
    outputRange: [0, sliderWidth - thumbSize],
    extrapolate: 'clamp',
  });

  thumbPosition.addListener(value =>setWidth(value.value));
  return (
    <View style={styles.sliderContainer}>
      <Text style={styles.sliderLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value.toString()}
        keyboardType="numeric"
        onChangeText={(text) => setValue(Number(text))}
      />
      
      <View className="flex-row" style={styles.sliderTrack}>
        <View style={{backgroundColor:"#1976D2", height: 5, width: width, borderRadius:5}}></View>
        <Animated.View
            style={[styles.thumb, { transform: [{ translateX: thumbPosition }] }]}
            {...panResponder.panHandlers}
          />
        
      </View>
      {/* <Text style={styles.sliderValue}>{value}</Text> */}
    </View>
  );
};

const CalculatorScreen = () => {
  const [amount, setAmount] = useState(1000);
  const [interestRate, setInterestRate] = useState(5);
  const [loanTerm, setLoanTerm] = useState(10);

  const calculateRepayment = () => {
    const principal = amount;
    const rate = interestRate / 100;
    const time = loanTerm;
    const monthlyRepayment = (principal * (1 + rate * time)) / (time * 12);
    alert(`Monthly Repayment: ${monthlyRepayment.toFixed(2)}`);
  };

  const [visible, setVisible] = useState(false);


  const handleCalculator  = () => {
    const payload = {
      "principal":Number(amount),
      "annualInterestRate":Number(interestRate),
      "loanTermYears": Number(loanTerm)
    }

    setVisible(true)

    calculate_loan(payload, res => {
      if(res){
        setVisible(false);
        navigation.navigate("LoanResultComponent", res.data)
      }else{
        setVisible(false);
      }
    })


  }

  useFocusEffect(
    useCallback(()=>{
      setAmount(100);
      setInterestRate(1);
      setLoanTerm(1)
    }, [])
  )
  const navigation = useNavigation()
  return (
   <ComponentWrapper container_bg='bg-white' headerComponent={() => <AppHeader middle={()=><Text className="text-white font-archivo-semi-bold text-2xl">{"Finance Calculator"}</Text>}/>} bg_color='bg-[#1976D2]'>
     <View style={styles.container}>
        <Text style={styles.title}>Loan Repayment Details</Text>

       
        <PrimaryInputField
          value={amount+""}
          onChange={(value) => setAmount(value)}
          type='numeric'
          label='Initial Amount'
        />
        <PrimaryInputField
          value={interestRate+""}
          onChange={(value) => setInterestRate(value)}
          type='numeric'
          label='Annual Interest Rate (%)'
        />
        <PrimaryInputField
          value={loanTerm+""}
          onChange={(value) => setLoanTerm(value)}
          type='numeric'
          label='Loan Term (years)'
        />
        {/* <CustomSlider value={amount} setValue={setAmount} min={100} max={10000} label="Initial Amount" />

        <CustomSlider value={interestRate} setValue={setInterestRate} min={1} max={20} label="Annual Interest Rate (%)" step={0.5} />

        <CustomSlider value={loanTerm} setValue={setLoanTerm} min={1} max={30} label="Loan Term (years)" /> */}

        <Pressable className="mt-10" onPress={() => handleCalculator()} style={styles.buttonContainer}>
            <Text  style={styles.calculateButton}>
            Calculate Repayment
            </Text>
        </Pressable>
        </View>


        {visible && <Indicator visible={visible} onClose={() => setVisible(false)}>
            <ActivityIndicator size={"large"}/>
          </Indicator>}
   </ComponentWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F7F7F9',
    justifyContent: 'center',
    borderRadius: 5
  },
  title: {
    fontSize: 17,
    fontFamily:"font-archivo-semi-bold",
    marginBottom: 20,
    textAlign: 'left',
  },
  sliderContainer: {
    marginBottom: 30,
  },
  sliderLabel: {
    fontSize: 14,
    color: '#333',
    fontFamily:'font-inter-semi-bold',
    marginBottom: 10,
  },
  sliderTrack: {
    height: 5,
    backgroundColor: '#CED0F8',
    borderRadius: 5,
    position: 'relative',
  },
  thumb: {
    width: 15,
    height: 15,
    backgroundColor: '#fff',
    borderRadius: 15/2,
    borderWidth:1,
    borderColor: "#007bff",
    position: 'absolute',
    top: -6,
  },
  sliderValue: {
    fontSize: 16,
    color: '#007bff',
    textAlign: 'center',
    marginTop: 10,
  },
  input: {
    height: 40,
    borderColor: '#d3d3d3',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingLeft: 10,
    fontSize: 16,
    color:'black'
  },
  buttonContainer: {
    alignItems: 'center',
  },
  calculateButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default CalculatorScreen;