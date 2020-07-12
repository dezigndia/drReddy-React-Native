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
  Alert,
} from "react-native";
import Modal from "react-native-modal";
import baseUrl from "../Constants/Constants";

const SCREEN_HEIGHT = Dimensions.get("screen").height;

class RequestOTP extends React.Component {
  state = {
    mobileNumber: "",
    OTP: "",
    loading: false,
    isVisible: false,
  };

  fetchOtp = () => {
    if (this.state.mobileNumber.length !== 10) {
      alert("Please enter valid mobile number!");
      return;
    }
    this.setState({ loading: true });
    const details = {
      Mobile: this.state.mobileNumber,
      RefralCode: "",
    };
    const Body = Object.keys(details)
      .map(
        (key) =>
          encodeURIComponent(key) + "=" + encodeURIComponent(details[key])
      )
      .join("&");

    const options = {
      method: "POST",
      body: Body,
      headers: {
        Accept: "multipart/form-data",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    fetch(baseUrl + "/GetOTP", options)
      .then((res) => res.text())
      .then((res) => {
        this.setState({ isVisible: true, loading: false });
        data = JSON.parse(res);
        console.log(":res", data[0].OTP);
        this.setState({ OTP: data[0].OTP });
        // alert('otp is:'+data[0].OTP);
      })
      .catch((err) => {
        this.setState({ loading: false });
        Alert.alert(
          "Prime Partner",
          "please enter valid details",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }],
          { cancelable: false }
        );
        console.log("error", err);
      });
  };

  verifyOtp = () => {
    this.setState({ loading: true });
    const details = {
      Mobile: this.state.mobileNumber,
      OTP: this.state.OTP,
    };
    const Body = Object.keys(details)
      .map(
        (key) =>
          encodeURIComponent(key) + "=" + encodeURIComponent(details[key])
      )
      .join("&");

    const options = {
      method: "POST",
      body: Body,
      headers: {
        Accept: "multipart/form-data",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    fetch(baseUrl + "/MatchOTP", options)
      .then((res) => res.text())
      .then((res) => {
        console.warn(data);
        let data = JSON.parse(res);
        console.warn(data);
        console.log("data:", res);
        if (data[0].result === "Success") {
          // call another api
          this.props.navigation.navigate("MainTab");
          ToastAndroid.show(
            "User verified, login successful!",
            ToastAndroid.SHORT
          );
          this.setState({
            OTP: "",
            mobileNumber: '',
            loading: false,
            isVisible: false
          });
        } else {
          this.setState({ loading: false });
          Alert.alert(
            "Prime Partner",
            "Invalid entered OTP",
            [
              {
                text: "OK",
                onPress: () =>
                  this.setState({
                    OTP: "",
                  }),
              },
            ],
            { cancelable: false }
          );
        }
      })
      .catch((err) => {
        this.setState({ loading: false }, () =>
          this.setModalVisible(!this.state.modalVisible)
        );
        console.log("error:", err);
        Alert.alert(
          "Prime Partner",
          "Invalid entered OTP",
          [
            {
              text: "OK",
              onPress: () =>
                this.setState({
                  code: "",
                }),
            },
          ],
          { cancelable: false }
        );
      });
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
                style={[styles.TextInput]}
                autoFocus
                placeholder="Enter 10 digit Mobile Number"
                placeholderTextColor="#522e90"
                value={mobileNumber}
                onChangeText={(text) => this.setState({ mobileNumber: text })}
                maxLength={10}
                keyboardType="number-pad"
              />
              <TouchableOpacity
                style={[styles.requestButton]}
                onPress={() => this.fetchOtp()}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.otpRequestText}>Request OTP</Text>
                )}
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
                    onChangeText={(text) => this.setState({ OTP: text })}
                    maxLength={4}
                    keyboardType="number-pad"
                  />
                  <TouchableOpacity
                    style={styles.requestButton}
                    onPress={() => this.verifyOtp()}
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
