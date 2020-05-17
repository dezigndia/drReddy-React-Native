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

class RequestOTP extends React.Component {
  state = {
    mobileNumber: "",
  };

  getOtp = () => {
    const { mobileNumber } = this.state;
    const { navigation } = this.props;
    if (mobileNumber.length !== 10) {
      Alert.alert(
        "Prime Partner",
        "Please enter the valid mobile number",
        [
          {
            text: "OK",
            onPress: () => console.log("OK Pressed"),
          },
        ],
        { cancelable: true }
      );
    } else {
      // call get otp
      this.setState({ mobileNumber: "" });
      navigation.navigate("VerifyOTP");
    }
  };

  render() {
    const { mobileNumber } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <ImageBackground
            source={require("../assets/background.png")}
            style={styles.imageBackground}
          >
            <View style={styles.header}>
              <View style={styles.headerBack}>
                <Text
                  onPress={() => this.props.navigation.navigate("Login")}
                  style={styles.headerBackText}
                >
                  Back
                </Text>
              </View>
              <View style={styles.headerCenter}>
                <Text style={styles.headerCenterText}>Request OTP</Text>
              </View>
            </View>
            <View style={styles.contentWrapper}>
              <TextInput
                style={styles.TextInput}
                placeholder="Enter 10 digit Mobile Number"
                placeholderTextColor="#522e90"
                value={mobileNumber}
                onChangeText={(text) => this.setState({ mobileNumber: text })}
                maxLength={10}
                keyboardType="number-pad"
              />
              <TouchableOpacity
                style={styles.requestButton}
                onPress={() => this.getOtp()}
              >
                <Text style={styles.otpRequestText}>Request OTP</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
      </SafeAreaView>
    );
  }
}

export default RequestOTP;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  header: {
    height: SCREEN_HEIGHT * 0.05,
    backgroundColor: "#522e90",
    flexDirection: "row",
  },
  headerBack: {
    width: "35%",
    height: "100%",
  },
  imageBackground: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  headerBackText: {
    marginLeft: 20,
    color: "#fff",
  },
  headerCenter: {
    width: "60%",
    height: "100%",
  },
  headerCenterText: {
    alignSelf: "flex-start",
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
  requestButton: {
    height: 40,
    backgroundColor: "#522e90",
    alignSelf: "center",
    borderRadius: 10,
    justifyContent: "center",
    marginTop: 10,
    borderWidth: 0,
    width: "90%",
  },
  otpRequestText: {
    color: "#fff",
    alignSelf: "center",
  },
});
