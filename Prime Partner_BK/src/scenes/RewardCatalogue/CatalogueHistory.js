import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  ActivityIndicator,
  ToastAndroid,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Entypo from "react-native-vector-icons/Entypo";
let SCREENWIDTH = Dimensions.get("screen").width;
let SCREENHEIGHT = Dimensions.get("screen").height;
import Modal from "react-native-modal";
import firebase from "react-native-firebase";
// import baseUrl from '../Constants/Constants';
import baseUrl, { baseUrlProd } from "../Constants/production";
var parseString = require("xml2js").parseString;

import * as ActionTypes from "../../data/actionTypes";
import orm from "src/data";
import { getState } from "src/storeHelper";

// sampleData=[
//     {
//         Address1: "SURYAKANTRAO JOSHI",
//         Address2: "SURVEY NO.-192/5 , NEAR SAI LAWN ,NEAR S.B.O.A. SCHOOL,",
//         Address3: "DEOGIRI ABHIJIT B-2,NEAR KRUSHNA MANGAL",
//         CardNumber: "23300056",
//         CityName: "Aurangabad",
//         GiftRequiredPoints: "4000.0000",
//         ImageURL: "http://drlprimepartner.accentivrewards.in/images/gifts/EGV1165.jpg",
//         ItemName: "Amazon E-Gift Voucher Rs 2000/-",
//         Itemcode: "EGV1165",
//         OrderDate: "08/12/2017",
//         OrderID: "33474",
//         OrderReference: "7E1CR-1D-82C2",
//         Pincode: "431001",
//         Quantity: "1",
//         ReceiveStatus: "Not Received",
//         StateName: "Maharashtra",
//         Status: "Approved",
//     },
//     {
//         Address1: "SURYAKANTRAO JOSHI",
//         Address2: "SURVEY NO.-192/5 , NEAR SAI LAWN ,NEAR S.B.O.A. SCHOOL,",
//         Address3: "DEOGIRI ABHIJIT B-2,NEAR KRUSHNA MANGAL",
//         CardNumber: "23300056",
//         CityName: "Aurangabad",
//         GiftRequiredPoints: "150.0000",
//         ImageURL: "http://drlprimepartner.accentivrewards.in/images/gifts/IT4546.jpg",
//         ItemName: "ITTest",
//         Itemcode: "IT4546",
//         OrderDate: "14/02/2017",
//         OrderID: "33469",
//         OrderReference: "7E12R-1D-82BD",
//         Pincode: "431001",
//         Quantity: "1",
//         ReceiveStatus: "Not Received",
//         StateName: "Maharashtra",
//         Status: "Rejected",
//     }
// ]

export default class CatalogueHistory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      loading: true,
      noData: false,
      mobileNumber: "",
      OTP: "",
      otpLoader: false,
      isVisible: false,
      orderId: "",
    };
  }

  componentDidMount = () => {
    const dbState = getState().data;
    const sess = orm.session(dbState);
    if (sess.User.idExists(0)) {
      const User = sess.User.withId(0);
      const { ChemistCardNo } = User.ref;
      console.log("ChemistCardNo", ChemistCardNo);
      const details = {
        memberLogin: ChemistCardNo,
      };

      const Body = Object.keys(details)
        .map(
          (key) =>
            encodeURIComponent(key) + "=" + encodeURIComponent(details[key])
        )
        .join("&");
      console.log("Body", Body);
      const options = {
        method: "POST",
        body: Body,
        headers: {
          Accept: "multipart/form-data",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      };
      let data = [];
      _that = this;
      fetch(baseUrl + "/GetOrderByMemberLogin", options)
        .then((res) => res.text())
        .then((res) => {
          console.log("res", res);
          parseString(res, async (err, result) => {
            console.log("result", result);
            if (
              result.DataSet["diffgr:diffgram"][0].NewDataSet[0].Table !=
              undefined
            ) {
              console.log(
                "(result.DataSet['diffgr:diffgram']",
                result.DataSet["diffgr:diffgram"][0].NewDataSet[0].Table
              );
              await result.DataSet[
                "diffgr:diffgram"
              ][0].NewDataSet[0].Table.map((item, index) => {
                console.log("item", item.DeliveryStatus);

                if (item.DeliveryStatus == undefined) {
                  console.log("undefined block");
                  let obb = {
                    // Address1:item.Address1[0],
                    // Address2: item.Address2[0],
                    // Address3: item.Address3[0],
                    CardNumber: item.CardNumber
                      ? item.CardNumber[0]
                      : undefined,
                    CityName: item.CityName ? item.CityName[0] : undefined,
                    // DeliveryDate:item.DeliveryDate[0],
                    DeliveryStatus: "Not Delivered",
                    // DispatchDate:item.DispatchDate[0],
                    GiftRequiredPoints: item.GiftRequiredPoints
                      ? item.GiftRequiredPoints[0]
                      : undefined,
                    ImageURL: item.ImageURL ? item.ImageURL[0] : undefined,
                    ItemName: item.ItemName ? item.ItemName[0] : undefined,
                    Itemcode: item.Itemcode ? item.Itemcode[0] : undefined,
                    OrderDate: item.OrderDate ? item.OrderDate[0] : undefined,
                    OrderID: item.OrderID ? item.OrderID[0] : undefined,
                    OrderReference: item.OrderReference
                      ? item.OrderReference[0]
                      : undefined,
                    Pincode: item.Pincode ? item.Pincode[0] : undefined,
                    Quantity: item.Quantity ? item.Quantity[0] : undefined,
                    ReceiveStatus: item.ReceiveStatus
                      ? item.ReceiveStatus[0]
                      : undefined,
                    // RedemptionStatus:item.RedemptionStatus[0],
                    StateName: item.StateName ? item.StateName[0] : undefined,
                    Status: item.Status ? item.Status[0] : undefined,
                    // TrackingAWBno:item.TrackingAWBno[0]
                  };
                  // console.log("if",obb);
                  data.push(obb);
                } else {
                  let obb = {
                    // Address1:item.Address1[0],
                    // Address2: item.Address2[0],
                    // Address3: item.Address3[0],
                    CardNumber: item.CardNumber
                      ? item.CardNumber[0]
                      : undefined,
                    CityName: item.CityName ? item.CityName[0] : undefined,
                    // DeliveryDate:item.DeliveryDate[0],
                    DeliveryStatus: "Not Delivered",
                    // DispatchDate:item.DispatchDate[0],
                    GiftRequiredPoints: item.GiftRequiredPoints
                      ? item.GiftRequiredPoints[0]
                      : undefined,
                    ImageURL: item.ImageURL ? item.ImageURL[0] : undefined,
                    ItemName: item.ItemName ? item.ItemName[0] : undefined,
                    Itemcode: item.Itemcode ? item.Itemcode[0] : undefined,
                    OrderDate: item.OrderDate ? item.OrderDate[0] : undefined,
                    OrderID: item.OrderID ? item.OrderID[0] : undefined,
                    OrderReference: item.OrderReference
                      ? item.OrderReference[0]
                      : undefined,
                    Pincode: item.Pincode ? item.Pincode[0] : undefined,
                    Quantity: item.Quantity ? item.Quantity[0] : undefined,
                    ReceiveStatus: item.ReceiveStatus
                      ? item.ReceiveStatus[0]
                      : undefined,
                    // RedemptionStatus:item.RedemptionStatus[0],
                    StateName: item.StateName ? item.StateName[0] : undefined,
                    Status: item.Status ? item.Status[0] : undefined,
                    // TrackingAWBno:item.TrackingAWBno[0]
                  };
                  // console.log("else",obb);
                  data.push(obb);
                }
              });
              console.log(data);
              _that.setState({ data: data, loading: false });
            } else {
              _that.setState({ loading: false, noData: true });
            }
          });
        })
        .catch((err) => {
          this.setState({ error: true, loading: false });
          console.log("err", err);
        });
    }
  };

  getProductDetails = () => {
    const details = {
      OrderReference: this.state.orderId,
      GiftReceiveImageUrl1: "Received",
      GiftReceiveImageUrl2: "",
      GiftReceiveImageUrl3: "",
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

    fetch(baseUrl + "/UpdateOrderDeliveryByOrderReference", options)
      .then((res) => res.text())
      .then((res) => {
        console.log("res", res);
        this.props.navigation.navigate("MainTab");
        this.setState({
          OTP: "",
          mobileNumber: "",
          otpLoader: false,
          isVisible: false,
        });
      })
      .catch((err) => {
        console.log("error:", err);
        alert("Something went wrong, please contact admin!");
      });
  };

  verifyOtp = () => {
    this.setState({ otpLoader: true });
    if (this.state.OTP.length !== 4) {
      alert("OTP not received, Please try again");
      return;
    }
    const dbState = getState().data;
    const sess = orm.session(dbState);
    const User = sess.User.withId(0);
    const { mobile } = User.ref;

    const details = {
      Mobile: mobile,
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

    fetch(baseUrlProd + "/MatchOTP", options)
      .then((res) => res.text())
      .then((res) => {
        console.warn(data);
        let data = JSON.parse(res);
        console.warn(data);
        console.log("data:", res);
        if (data[0].result === "Success") {
          this.getProductDetails();
        } else {
          this.setState({ otpLoader: false });
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
        this.setState({ otpLoader: false });
        console.log("error:", err);
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
      });
  };

  fetchOtp = (orderId) => {
    this.setState({ orderId: orderId });
    const dbState = getState().data;
    const sess = orm.session(dbState);
    if (sess.User.idExists(0)) {
      const User = sess.User.withId(0);
      const { mobile } = User.ref;

      if (mobile.length !== 10) {
        alert("OTP cannot be generated, mobile number is not valid!");
        return;
      }

      const details = {
        Mobile: mobile,
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

      fetch(baseUrlProd + "/GetOTP", options)
        .then((res) => res.text())
        .then((res) => {
          this.setState({ isVisible: true });
          data = JSON.parse(res);
          console.log(":res", data[0].OTP);
        })
        .catch((err) => {
          Alert.alert(
            "Prime Partner",
            "please enter valid details",
            [{ text: "OK", onPress: () => console.log("OK Pressed") }],
            { cancelable: false }
          );
          console.log("error", err);
        });
    } else {
      alert("User id not present!");
    }
  };

  renderItem = ({ item }) => {
    return (
      <View style={{ borderBottomWidth: 0.5 }}>
        <View style={{ flexDirection: "row", marginTop: 10 }}>
          <Image
            source={{ uri: item.ImageURL }}
            style={{ resizeMode: "contain", borderWidth: 0, width: "40%" }}
          />
          <View style={{ borderWidth: 0, width: "60%" }}>
            <Text style={{ color: "#000", fontSize: 12, letterSpacing: 0.8 }}>
              Ref Id: {item.OrderReference}
            </Text>
            <Text style={{ color: "#000", fontSize: 12, letterSpacing: 0.8 }}>
              Redeem On: {item.OrderDate}
            </Text>
            <Text style={{ color: "#000", fontSize: 12, letterSpacing: 0.8 }}>
              ItemCode: {item.Itemcode}
            </Text>
            <Text style={{ color: "#000", fontSize: 12, letterSpacing: 0.8 }}>
              Status: {item.Status}
            </Text>
          </View>
        </View>
        <View style={{ marginTop: 10 }}>
          {item.Status === "Approved" &&
            item.DeliveryStatus !== "SMS Delivered" && (
              <Image
                source={require("../assets/approved.png")}
                style={{ height: 50, width: SCREENWIDTH, resizeMode: "center" }}
              />
            )}
          {item.Status === "Pending" && (
            <Image
              source={require("../assets/pending.png")}
              style={{ height: 50, width: SCREENWIDTH, resizeMode: "center" }}
            />
          )}
          {item.Status === "Dispatched" && (
            <Image
              source={require("../assets/dispatched.png")}
              style={{ height: 50, width: SCREENWIDTH, resizeMode: "center" }}
            />
          )}
          {item.Status === "Approved" &&
            item.DeliveryStatus === "SMS Delivered" && (
              <Image
                source={require("../assets/delivered.png")}
                style={{ height: 50, width: SCREENWIDTH, resizeMode: "center" }}
              />
            )}
          <View
            style={{
              borderWidth: 0,
              justifyContent: "flex-end",
              alignItems: "flex-end",
            }}
          >
            <TouchableOpacity
              style={{
                height: 20,
                padding: 13,
                borderWidth: 0,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor:
                  item.Status === "Approved" &&
                  (item.DeliveryStatus === "SMS Delivered" ||
                    item.RedemptionStatus === "SMS Delivered") &&
                  item.ReceiveStatus === "Not Received"
                    ? "#00D084"
                    : "#666666",
                marginRight: 10,
              }}
              disabled={
                item.Status === "Approved" &&
                (item.DeliveryStatus === "SMS Delivered" ||
                  item.RedemptionStatus === "SMS Delivered") &&
                item.ReceiveStatus === "Not Received"
                  ? false
                  : true
              }
              onPress={() => {
                if (
                  item.Status === "Approved" &&
                  (item.DeliveryStatus === "SMS Delivered" ||
                    item.RedemptionStatus === "SMS Delivered") &&
                  item.ReceiveStatus === "Not Received"
                ) {
                  // this.props.navigation.navigate("PSRSignature", {
                  //   OrderReference: item.OrderReference,
                  // });
                  console.warn("pressed");
                  console.log(this.props.navigation);
                  this.fetchOtp(item.OrderID);
                }
              }}
            >
              <Text style={{ color: "#fff" }}>RECEIVED</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  render() {
    const { mobileNumber, otpLoader, isVisible, OTP } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <View style={styles.headerView}>
            <TouchableOpacity
              style={{ alignSelf: "center" }}
              onPress={() => this.props.navigation.navigate("RewardCatalogue")}
            >
              <Image
                source={require("../assets/history.png")}
                style={{
                  width: 35,
                  height: 35,
                  resizeMode: "contain",
                  paddingRight: 0,
                  alignSelf: "center",
                }}
              />
            </TouchableOpacity>
            <Text style={{ color: "#fff", alignSelf: "center", fontSize: 18 }}>
              Redemption History
            </Text>
            <TouchableOpacity
              style={{ alignSelf: "center" }}
              onPress={() => this.props.navigation.navigate("HomeTABS")}
            >
              <Entypo
                name="home"
                size={30}
                color="#fff"
                style={{ alignSelf: "center" }}
              />
            </TouchableOpacity>
          </View>
          {!this.state.loading ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {!this.state.noData ? (
                <FlatList
                  // data={[{ key: 'a' },]}
                  data={this.state.data}
                  renderItem={this.renderItem}
                />
              ) : (
                <Text style={{ alignSelf: "center" }}>No History Found.</Text>
              )}
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color="#6633cc" />
            </View>
          )}
          <Modal
            isVisible={isVisible}
            avoidKeyboard={true}
            backdropOpacity={0.2}
            style={{
              margin: 0,
              padding: 0,
              marginTop: SCREENHEIGHT / 8,
            }}
            onBackButtonPress={() =>
              this.setState({
                isVisible: false,
                loading: false,
              })
            }
            onBackdropPress={() =>
              this.setState({
                isVisible: false,
                loading: false,
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
                  value={OTP}
                  onChangeText={(text) => this.setState({ OTP: text })}
                  maxLength={4}
                  keyboardType="number-pad"
                />
                <TouchableOpacity
                  style={styles.requestButton}
                  onPress={() => this.verifyOtp()}
                >
                  {otpLoader ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <Text style={styles.otpRequestText}>Verify OTP</Text>
                  )}
                </TouchableOpacity>
              </View>
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
  },
  headerView: {
    height: SCREENHEIGHT * 0.06,
    backgroundColor: "#6633cc",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 10,
    paddingRight: 10,
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
