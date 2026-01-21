import React from "react";
import { View, Text } from "react-native";

const CustomToast = ({ text1, text2 }) => {
  return (
    <View
      style={{
        width: "85%",
        backgroundColor: "#222",
        padding: 15,
        borderRadius: 12,
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",

        // Shadow
        elevation: 5,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 10,
      }}
    >
      <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}>
        {text1}
      </Text>
      <Text style={{ color: "#ddd", fontSize: 14, marginTop: 4 }}>
        {text2}
      </Text>
    </View>
  );
};

export default CustomToast;
