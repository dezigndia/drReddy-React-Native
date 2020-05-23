import React from "react";
import {
  View,
  Text,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import Modal from "react-native-modal";
import firebase from "react-native-firebase";

const SCREEN_HEIGHT = Dimensions.get("screen").height;

class RequestOTP extends React.Component {
  state = {
    mobileNumber: "",
    confirmResult: null,
    verificationCode: "",
    userId: "",
    loading: false,
    isVisible: false,
  };

  handleVerifyCode = () => {
    // Request for OTP verification
    const { confirmResult, verificationCode } = this.state;
    this.setState({ loading: true });
    if (confirmResult) {
      confirmResult
        .confirm(verificationCode)
        .then((user) => {
          this.setState({
            userId: user.uid,
            isVisible: false,
            mobileNumber: "",
            loading: false,
            verificationCode: "",
          });
          this.props.navigation.navigate("MainTab");
          ToastAndroid.show(
            "User verified, login successful!",
            ToastAndroid.SHORT
          );
        })
        .catch((error) => {
          this.setState({ loading: false });
          alert(error.message);
          console.log(error);
        });
    } else {
      this.setState({ loading: false });
      alert("Please enter a 6 digit OTP code.");
    }
  };

  getOtp = () => {
    // Request to send OTP
    const { mobileNumber, confirmResult } = this.state;
    if (mobileNumber.length === 10 && !confirmResult) {
      this.setState({ isVisible: true });
      firebase
        .auth()
        .signInWithPhoneNumber(`+91 ${mobileNumber}`)
        .then((confirmResult) => {
          console.warn("confirmResult", confirmResult);
          this.setState({ confirmResult: confirmResult });
        })
        .catch((error) => {
          console.warn(error);
        });
    }
    if (confirmResult) {
      this.setState({ isVisible: true });
    } else {
      alert("Please enter valid mobile number");
    }
  };

  render() {
    const { mobileNumber, loading, isVisible, verificationCode } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <ImageBackground
            source={require("../assets/background.png")}
            style={styles.imageBackground}
          >
            <View style={styles.header}>
              <Text
                onPress={() => this.props.navigation.navigate("Login")}
                style={styles.headerBackText}
              >
                Back
              </Text>
              <Text style={styles.headerCenterText}>Request OTP</Text>
            </View>
            <View style={styles.contentWrapper}>
              <TextInput
                style={[
                  styles.TextInput,
                  loading ? { backgroundColor: "lightgray" } : {},
                ]}
                autoFocus
                placeholder="Enter 10 digit Mobile Number"
                placeholderTextColor="#522e90"
                value={mobileNumber}
                onChangeText={(text) => this.setState({ mobileNumber: text })}
                maxLength={10}
                keyboardType="number-pad"
              />
              <TouchableOpacity
                style={[
                  styles.requestButton,
                  loading ? { backgroundColor: "#f9f9f9" } : {},
                ]}
                onPress={() => this.getOtp()}
              >
                <Text style={styles.otpRequestText}>Request OTP</Text>
              </TouchableOpacity>
            </View>
            <Modal
              isVisible={isVisible}
              avoidKeyboard={true}
              backdropOpacity={0.2}
              style={{
                margin: 0,
                padding: 0,
                marginTop: SCREEN_HEIGHT / 8,
              }}
              onBackButtonPress={() =>
                this.setState({
                  isVisible: false,
                })
              }
              onBackdropPress={() =>
                this.setState({
                  isVisible: false,
                })
              }
            >
              <View
                style={{
                  flex: 1,
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                  backgroundColor: "#fff",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    padding: 8,
                    justifyContent: "flex-start",
                    borderBottomWidth: 1,
                    borderBottomColor: "#efefef",
                    elevation: 1,
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#522e90",
                      textAlign: "center",
                      fontSize: 16,
                      fontWeight: "200",
                      marginVertical: 10,
                    }}
                  >
                    Verify OTP
                  </Text>
                </View>
                <View
                  style={{
                    marginTop: 20,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextInput
                    style={[styles.TextInput]}
                    placeholder="Enter OTP"
                    placeholderTextColor="#522e90"
                    value={verificationCode}
                    onChangeText={(text) =>
                      this.setState({ verificationCode: text })
                    }
                    maxLength={6}
                    keyboardType="number-pad"
                  />
                  <TouchableOpacity
                    style={styles.requestButton}
                    onPress={() => this.handleVerifyCode()}
                  >
                    {loading ? (
                      <ActivityIndicator color="#ffffff" />
                    ) : (
                      <Text style={styles.otpRequestText}>Verify OTP</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
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
  imageBackground: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  headerBackText: {
    marginLeft: "5%",
    color: "#fff",
  },
  headerCenterText: {
    paddingLeft: "30%",
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
    paddingTop: SCREEN_HEIGHT / 3,
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
