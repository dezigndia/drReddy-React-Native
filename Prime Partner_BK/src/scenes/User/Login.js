import React, { Component } from "react";
import {
  Text,
  AsyncStorage,
  View,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  ImageBackground,
  Image,
  TextInput,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
  BackHandler,
  Platform,
} from "react-native";
import {
  Container,
  Header,
  Content,
  Form,
  Item,
  Input,
  Label,
} from "native-base";
import firebase from "react-native-firebase";
import DeviceInfo from 'react-native-device-info';

import baseUrl from "../Constants/Constants";
var parseString = require("xml2js").parseString;
import XMLParser from "react-xml-parser";
import * as ActionTypes from "../../data/actionTypes";
import orm from "src/data";
import { getState } from "src/storeHelper";

let SCREENWIDTH = Dimensions.get("screen").width;
let SCREENHEIGHT = Dimensions.get("screen").height;
// import xml2json from '../Xml2Json/Xml2Json';

export default class Login extends Component {
  static navigationOptions = {
    drawerLockMode: "locked-closed",
  };
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      password: "",
      loading: false,
      modalVisible: false,
    };
  }

  handleBackPress = () => {
    BackHandler.exitApp(); // works best when the goBack is async
    return true;
  };
  componentDidMount() {
    console.log(DeviceInfo.getUniqueId());
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackPress
    );
    // this.checkPermission();
    // this.createNotificationListeners();
    const dbState = getState().data;
    const sess = orm.session(dbState);
    console.log("sess", sess);
  }

  //     //1
  // async checkPermission() {
  //     const enabled = await firebase.messaging().hasPermission();
  //     if (enabled) {
  //         this.getToken();
  //     } else {
  //         this.requestPermission();
  //     }
  //   }

  //     //3
  //   async getToken() {
  //     let fcmToken = await AsyncStorage.getItem('fcmToken');
  //     if (!fcmToken) {
  //         fcmToken = await firebase.messaging().getToken();
  //         if (fcmToken) {
  //             // user has a device token
  //             await AsyncStorage.setItem('fcmToken', fcmToken);
  //             console.log("fcmToken",fcmToken);
  //         }
  //     }
  //   }

  //     //2
  //   async requestPermission() {
  //     try {
  //         await firebase.messaging().requestPermission();
  //         // User has authorised
  //         this.getToken();
  //     } catch (error) {
  //         // User has rejected permissions
  //         console.log('permission rejected');
  //     }
  //   }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  _onLogin = async () => {
    let fcmToken = await AsyncStorage.getItem("fcmToken");
    const details = {
      MobileNo: this.state.userName,
      Password: this.state.password,
      // 'MobileNo': '8879755940',
      // 'Password':'poonam',
      DeviceID: DeviceInfo.getUniqueId(),
    };
    const Body = Object.keys(details)
      .map(
        (key) =>
          encodeURIComponent(key) + "=" + encodeURIComponent(details[key])
      )
      .join("&");
    console.warn("details", details);
    const options = {
      method: "POST",
      body: Body,
      headers: {
        Accept: "multipart/form-data",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };
    var _that = this;
    fetch(baseUrl + "/PrimaLogin", options)
      .then((res) => res.text())
      .then((res) => {
        this.setState({ loading: false }, () =>
          this.setModalVisible(!this.state.modalVisible)
        );
        parseString(res, function (err, result) {
          if (result.Value.AccountID[0] != "NA") {
            console.log("result", result.Value, _that.props.navigation);
            const { dispatch } = _that.props.navigation;
            const User = Object.assign(
              {},
              {
                id: 0,
                mobile: _that.state.userName,
                AccountID: result.Value.AccountID[0],
                AccountTypeID: result.Value.AccountTypeID[0],
                Balance: result.Value.Balance[0],
                ChemistCardNo: result.Value.ChemistCardNo[0],
                DaysRemainingforNextTier:
                  result.Value.DaysRemainingforNextTier[0],
                LastTierUpgradeDate: result.Value.LastTierUpgradeDate[0],
                Membership: result.Value.Membership[0],
                NextTierLevel: result.Value.NextTierLevel[0],
                Output: result.Value.Output[0],
                Points: result.Value.Points[0],
                PointsEarned: result.Value.PointsEarned[0],
                PointsRequired: result.Value.PointsRequired[0],
                TotalEarnPoint: result.Value.TotalEarnPoint[0],
                TotalExpiredPoint: result.Value.TotalExpiredPoint[0],
                TotalSpentPoint: result.Value.TotalSpentPoint[0],
                UpdatedBy: result.Value.UpdatedBy[0],
                UpdatedOn: result.Value.UpdatedOn[0],
                CreatedBy: result.Value.CreatedBy[0],
                login: "true",
                password: _that.state.password,
              }
            );
            dispatch({
              type: ActionTypes.USER_DATA,
              User,
            });
            _that.props.navigation.navigate("MainTab");
            Alert.alert(
              "Prime Partner",
              "Login successfully",
              [{ text: "OK", onPress: () => console.log("OK Pressed") }],
              { cancelable: false }
            );
            // alert('Login successfully');
            const dbState = getState().data;
            const sess = orm.session(dbState);
            console.log("sess", sess);
          } else {
            if (
              result.Value.ChemistCardNo[0] === "Mobile number does not exist"
            ) {
              Alert.alert(
                "Prime Partner",
                result.Value.ChemistCardNo[0],
                [
                  {
                    text: "OK",
                    onPress: () => _that.props.navigation.navigate("SignUp"),
                  },
                ],
                { cancelable: false }
              );
            } else {
              Alert.alert(
                "Prime Partner",
                result.Value.ChemistCardNo[0],
                [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                { cancelable: false }
              );
            }

            // alert(result.Value.ChemistCardNo[0])
            // this.setModalVisible(!this.state.modalVisible);
          }
        });
      })
      .catch((err) => {
        this.setState({ loading: false }, () =>
          this.setModalVisible(!this.state.modalVisible)
        );
        Alert.alert(
          "Prime Partner",
          "Check your internet connection!",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }],
          { cancelable: false }
        );
        console.log("err", err);
      });
  };
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <ImageBackground
            source={require("../assets/background.png")}
            style={styles.imageBackground}
          >
            <View style={styles.imagesView}>
              <View style={styles.reddysImageView}>
                {/* <Text>image 1</Text> */}
                <Image
                  source={require("../assets/drreddy.png")}
                  style={styles.reddysImage}
                />
              </View>
              <View style={styles.primePartnerView}>
                <Image
                  source={require("../assets/primePartner.png")}
                  style={styles.primePartnerImage}
                />
                {/* <Text>image 2</Text> */}
              </View>
            </View>
            <View style={styles.formView}>
              <Form style={styles.form}>
                <Item inlineLabel style={styles.item}>
                  <TextInput
                    style={styles.inputUsername}
                    placeholder="Registered Mobile No"
                    placeholderTextColor="#522e90"
                    onChangeText={(userName) => this.setState({ userName })}
                    keyboardType="number-pad"
                  />
                </Item>
                <Item style={styles.item}>
                  <TextInput
                    style={styles.inputPassword}
                    placeholder="Password"
                    placeholderTextColor="#522e90"
                    onChangeText={(password) => this.setState({ password })}
                    secureTextEntry={true}
                  />
                </Item>
                <Item inlineLabel style={styles.item}>
                  <TouchableOpacity
                    style={styles.loginButton}
                    onPress={() => {
                      if (
                        this.state.userName != "" &&
                        this.state.userName.length == 10
                      ) {
                        this.setState({ loading: true }, () => {
                          this._onLogin();
                          this.setModalVisible(true);
                        });
                      } else {
                        Alert.alert(
                          "Prime Partner",
                          "Please enter the valid details",
                          [
                            {
                              text: "OK",
                              onPress: () => console.log("OK Pressed"),
                            },
                          ],
                          { cancelable: false }
                        );
                      }
                    }}
                  >
                    <Text style={styles.loginText}>Login</Text>
                  </TouchableOpacity>
                </Item>
                <Item style={[styles.itemForgotPassword]}>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate("ForgotPassword")
                    }
                  >
                    <Text style={styles.textForgetPassword}>
                      Forget Password ?
                    </Text>
                  </TouchableOpacity>
                </Item>
              </Form>
            </View>
            <View style={styles.enrollView}>
              <Text
                onPress={() => this.props.navigation.navigate("SignUp")}
                style={styles.enrollText}
              >
                Not Prime Partner? Enroll Now.
              </Text>
            </View>
            {Platform.OS === "android" ? (
              <View style={[styles.enrollView, { paddingTop: 10 }]}>
                <Text
                  onPress={() => this.props.navigation.navigate("RequestOTP")}
                  style={styles.enrollText}
                >
                  Login With OTP
                </Text>
              </View>
            ) : null}
          </ImageBackground>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              // Alert.alert('Modal has been closed.');
              this.setState({ loading: false }, () =>
                this.setModalVisible(!this.state.modalVisible)
              );
            }}
          >
            <View style={styles.modalView}>
              <ActivityIndicator
                style={styles.spinner}
                size="large"
                color="#0000ff"
              />
            </View>
          </Modal>
        </View>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  context: {
    alignSelf: "center",
    textAlign: "center",
  },
  imageBackground: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  imagesView: {
    height: SCREENHEIGHT / 3.5,
    borderWidth: 0,
  },
  reddysImageView: {
    height: "20%",
    borderWidth: 0,
  },
  reddysImage: {
    height: 25,
    width: 120,
    alignSelf: "flex-end",
    right: 10,
    top: 10,
    bottom: 0,
  },
  primePartnerView: {
    height: "80%",
    borderWidth: 0,
    justifyContent: "center",
  },
  primePartnerImage: {
    alignSelf: "center",
    height: SCREENWIDTH / 5,
    width: SCREENWIDTH / 2,
  },
  formView: {
    // height:SCREENHEIGHT/3,
    borderWidth: 0,
  },
  form: {
    paddingLeft: 40,
    paddingRight: 40,
    paddingTop: 40,
  },
  item: {
    borderBottomWidth: 0,
  },
  inputUsername: {
    borderRadius: 20,
    borderWidth: 0,
    flex: 1,
    backgroundColor: "#fff",
    marginBottom: 7,
    height: 40,
  },
  inputPassword: {
    borderRadius: 20,
    borderWidth: 0,
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 7,
    height: 40,
  },
  loginButton: {
    flex: 1,
    height: 40,
    backgroundColor: "#522e90",
    alignSelf: "center",
    borderRadius: 10,
    justifyContent: "center",
    marginTop: 10,
    borderWidth: 0,
  },
  loginText: {
    color: "#fff",
    alignSelf: "center",
  },
  itemForgotPassword: {
    justifyContent: "center",
    borderBottomWidth: 0,
    margin: 10,
  },
  textForgetPassword: {
    fontSize: 16,
    alignSelf: "center",
    bottom: 0,
  },
  enrollView: {
    // height:SCREENHEIGHT/3,
    borderWidth: 0,
  },
  enrollText: {
    color: "#88bffa",
    alignSelf: "center",
    fontSize: 16,
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  spinner: {
    alignSelf: "center",
  },
});
