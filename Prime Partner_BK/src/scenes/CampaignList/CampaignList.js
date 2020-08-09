import React, { useEffect } from "react";
import {
  ScrollView,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import orm from "src/data";
import { drlUrl } from "../Constants/Constants";
import { getState } from "src/storeHelper";

const convert = require("xml-js");

const SCREEN_HEIGHT = Dimensions.get("screen").height;

const CampaignList = ({ navigation }) => {
  const [campaignList, setCampaignList] = React.useState([]);

  useEffect(() => {
    const campaign_list = [];
    const dbState = getState().data;
    const sess = orm.session(dbState);
    const User = sess.User.withId(0);
    const { AccountID } = User.ref;

    const detailsForCampDetails = {
      user: "DRL_API",
      password: "3JA2ASJx^7",
      MemberID: AccountID,
      type: "CampaignDetails",
    };

    const detailsForCampImages = {
      user: "DRL_API",
      password: "3JA2ASJx^7",
      MemberID: AccountID,
      type: "ShowCampaignImages",
    };

    const Body = Object.keys(detailsForCampDetails)
      .map(
        (key) =>
          encodeURIComponent(key) +
          "=" +
          encodeURIComponent(detailsForCampDetails[key])
      )
      .join("&");

    const newBody = Object.keys(detailsForCampImages)
      .map(
        (key) =>
          encodeURIComponent(key) +
          "=" +
          encodeURIComponent(detailsForCampImages[key])
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

    const newOptions = {
      method: "POST",
      body: newBody,
      headers: {
        Accept: "multipart/form-data",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    const campaignObjDetails = [];

    fetch(drlUrl + "/GetDetailsByType", options)
      .then((res) => res.text())
      .then((res) => {
        const xml = convert.xml2json(res, {
          compact: true,
          spaces: 4,
        });
        const parsedXml = JSON.parse(xml);
        if (
          Array.isArray(parsedXml.DataSet["diffgr:diffgram"].NewDataSet.Table)
        ) {
          parsedXml.DataSet["diffgr:diffgram"].NewDataSet.Table.map(
            (item, index) => {
              let obj = {};
              delete item._attributes;
              obj = item;
              campaignObjDetails.push(obj);
            }
          );
        } else {
          campaignObjDetails.push(
            parsedXml.DataSet["diffgr:diffgram"].NewDataSet.Table
          );
        }

        const campaignObjImages = [];

        fetch(drlUrl + "/GetDetailsByType", newOptions)
          .then((res) => res.text())
          .then((res) => {
            const xml = convert.xml2json(res, {
              compact: true,
              spaces: 4,
            });
            const parsedXml = JSON.parse(xml);
            if (
              Array.isArray(
                parsedXml.DataSet["diffgr:diffgram"].NewDataSet.Table
              )
            ) {
              parsedXml.DataSet["diffgr:diffgram"].NewDataSet.Table.map(
                (item, index) => {
                  let obj = {};
                  delete item._attributes;
                  obj = item;
                  campaignObjImages.push(obj);
                }
              );
            } else {
              campaignObjImages.push(
                parsedXml.DataSet["diffgr:diffgram"].NewDataSet.Table
              );
            }
            campaignObjDetails.map((campDetails, campDetailsIndex) => {
              const {
                CampaignID: { _text },
              } = campDetails;
              if (
                _text ===
                (campaignObjImages[campDetailsIndex] &&
                  campaignObjImages[campDetailsIndex].CampaignID._text)
              ) {
                Object.assign(campDetails, campaignObjImages[campDetailsIndex]);
                campaign_list.push(campDetails);
                setCampaignList(campaign_list);
              }
            });
          })
          .catch((err) => {
            console.log("err B", err.message);
            alert("Failed to fetch campaign image!");
          });
      })
      .catch((err) => {
        console.log("err A", err.message);
        alert("Failed to fetch campaign details!");
      });
  }, []);

  const getDate = (startDate) => {
    let date = new Date(`${startDate}`);
    let fullDate;
    fullDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    return fullDate;
  };

  return (
    <>
      <StatusBar backgroundColor="#522e90" barStyle="light-content" />
      <View style={styles.header}>
        <Text
          onPress={() => navigation.navigate("HomeTAB")}
          style={styles.headerBackText}
        >
          Back
        </Text>
        <Text style={styles.headerCenterText}>CampaignList</Text>
        <Text> </Text>
      </View>
      {campaignList.length > 0 ? (
        <ScrollView style={styles.container}>
          {campaignList.map((item, index) => {
            const {
              CampaignID,
              CampaignName,
              CampaignDescription,
              StartDate,
              EndDate,
              Bonus,
              ImageURL,
              Status,
            } = item;
            return (
              <View key={CampaignID._text} style={styles.card}>
                <Text style={styles.campName}>{CampaignName._text}</Text>
                <Text style={styles.campDesc}>{CampaignDescription._text}</Text>
                <Text style={styles.campDetails}>From: {getDate(StartDate._text)}</Text>
                <Text style={styles.campDetails}>To: {getDate(EndDate._text)}</Text>
                <Text style={styles.campDetails}>
                  Bonus: {Bonus ? Bonus._text : "NA"}
                </Text>
                <Text style={styles.campDetails}>
                  Image:{" "}
                  <Text
                    style={styles.imageLink}
                    onPress={() =>
                      navigation.navigate("ImagePreview", {
                        imageUrl: ImageURL._text,
                      })
                    }
                  >
                    view
                  </Text>
                </Text>
                <TouchableOpacity activeOpacity={0.6} onPress={() => navigation.navigate('Campaign', {
                  campId: CampaignID._text
                })} style={styles.uploadImgBtn}>
                  <Text style={styles.uploadImgText}>Upload Image</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <View style={styles.indicator}>
          <ActivityIndicator color="#522e90" size="large" />
        </View>
      )}
    </>
  );
};

export default CampaignList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  card: {
    paddingTop: 10,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 1,
    zIndex: 1,
    marginBottom: 20,
  },
  header: {
    height: SCREEN_HEIGHT * 0.05,
    backgroundColor: "#522e90",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerBackText: {
    color: "#fff",
    marginLeft: 15,
  },
  headerCenterText: {
    color: "#fff",
  },
  previewText: {
    marginRight: 15,
  },
  campName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  campDesc: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
  },
  campDetails: {
    fontSize: 14,
    fontWeight: "400",
    marginTop: 10,
  },
  imageLink: {
    color: "#522e90",
    fontWeight: "600",
  },
  indicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadImgBtn: {
    position: 'absolute',
    height: 40,
    bottom: -20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'center',
    backgroundColor: "#522e90",
    borderRadius: 4,
    zIndex: 1,
    elevation: 1,
    flex: 1,
  },
  uploadImgText: {
    color: "#fff",
  }
});
