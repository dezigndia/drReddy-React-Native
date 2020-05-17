import React from "react";
import {
  View,
  Text,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  TextInput,
  Alert,
  TouchableOpacity,
} from "react-native";

const SCREEN_HEIGHT = Dimensions.get("screen").height;

class VerifyOTP extends React.Component {
  state = {
    otp: "",
  };

  verifyOtp = () => {
    const { otp } = this.state;
    if (otp.length !== 10) {
      // Alert.alert(
      //   "Prime Partner",
      //   "Please enter the valid number",
      //   [
      //     {
      //       text: "OK",
      //       onPress: () => console.log("OK Pressed"),
      //     },
      //   ],
      //   { cancelable: true }
      // );
    } else {
      // call get otp
      this.props.navigation.navigate("login");
    }
  };

  render() {
    const { otp } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <ImageBackground
            source={require("../assets/background.png")}
            style={styles.imageBackground}
          >
            <View style={styles.header}>
              <Text style={styles.headerCenterText}>Verify OTP</Text>
            </View>
            <View style={styles.contentWrapper}>
              <TextInput
                style={styles.TextInput}
                placeholder="Enter OTP"
                placeholderTextColor="#522e90"
                value={otp}
                onChangeText={(text) => this.setState(text)}
              />
              <TouchableOpacity
                style={styles.verifyButton}
                onPress={() => this.verifyOtp()}
              >
                <Text style={styles.otpVerifyText}>Verify OTP</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
      </SafeAreaView>
    );
  }
}

export default VerifyOTP;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  header: {
    height: SCREEN_HEIGHT * 0.05,
    backgroundColor: "#522e90",
    justifyContent: "center",
    alignItems: "center",
  },
  imageBackground: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  headerCenterText: {
    color: "#fff",
  },
  TextInput: {
    borderRadius: 5,
    borderWidth: 0,
    backgroundColor: "#f9f9f9",
    marginBottom: 10,
    height: 40,
    elevation: 4,
    width: "90%",
    paddingLeft: 15,
  },
  contentWrapper: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: SCREEN_HEIGHT / 3.5,
  },
  verifyButton: {
    height: 40,
    backgroundColor: "#522e90",
    alignSelf: "center",
    borderRadius: 10,
    justifyContent: "center",
    marginTop: 10,
    borderWidth: 0,
    width: "90%",
  },
  otpVerifyText: {
    color: "#fff",
    alignSelf: "center",
  },
});
