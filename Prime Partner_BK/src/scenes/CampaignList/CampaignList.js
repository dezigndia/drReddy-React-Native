import React, { useEffect } from "react";
import {
  ScrollView,
  Dimensions,
  StatusBar,
  Image,
  View,
  Text,
  StyleSheet,
} from "react-native";
import orm from "src/data";
import { drlUrl } from "../Constants/Constants";
import { getState } from "src/storeHelper";

const convert = require("xml-js");

const DATA = [
  {
    id: 0,
    campName: "Campaign Name 1",
    campDesc: "Campaign Description",
    from: "12-06-2020",
    to: "22-07-2020",
    bonus: "600",
    imageUrl: "",
  },
  {
    id: 1,
    campName: "Campaign Name 2",
    campDesc:
      "Campaign Description Campaign Description Campaign Description Campaign Description Campaign Description",
    from: "12-06-2020",
    to: "22-07-2020",
    bonus: "600",
    imageUrl:
      "https://image.freepik.com/free-vector/surprise-theme-happy-birthday-card-illustration_1344-199.jpg",
  },
  {
    id: 2,
    campName: "Campaign Name 2",
    campDesc:
      "Campaign Description Campaign Description Campaign Description Campaign Description Campaign Description",
    from: "12-06-2020",
    to: "22-07-2020",
    bonus: "600",
    imageUrl: "",
  },
  {
    id: 3,
    campName: "Campaign Name 2",
    campDesc:
      "Campaign Description Campaign Description Campaign Description Campaign Description Campaign Description",
    from: "12-06-2020",
    to: "22-07-2020",
    bonus: "600",
    imageUrl: "",
  },
];

const SCREEN_HEIGHT = Dimensions.get("screen").height;

const CampaignList = ({ navigation }) => {
  useEffect(() => {
    const CAMPAIGN_LIST = [];
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

    fetch(drlUrl + "/GetDetailsByType", options)
      .then((res) => res.text())
      .then((res) => {
        const xml = convert.xml2json(res, {
          compact: true,
          spaces: 4,
        });
        const parsedXml = JSON.parse(xml);
        console.log("parsedXml", parsedXml);
        Object.keys(parsedXml.DataSet["diffgr:diffgram"].NewDataSet.Table).map(
          (item, index) => {
            const {
              CampaignID,
              CampaignName,
              CampaignDescription,
              StartDate,
              EndDate,
            } = item;
            return console.log(
              "item, A",
              item,
              CampaignID,
              CampaignName,
              CampaignDescription,
              StartDate,
              EndDate
            );
          }
        );
      })
      .catch((err) => {
        console.log("err A", err.message);
      });

    fetch(drlUrl + "/GetDetailsByType", newOptions)
      .then((res) => res.text())
      .then((res) => {
        const xml = convert.xml2json(res, {
          compact: true,
          spaces: 4,
        });
        const parsedXml = JSON.parse(xml);
        console.log("parsedXml", parsedXml);
        Object.keys(parsedXml.DataSet["diffgr:diffgram"].NewDataSet.Table).map(
          (item, index) => {
            const { CampaignName, ImageURL, Status, StartDate, EndDate } = item;
            return console.log(
              "item B", item,
              CampaignName,
              ImageURL,
              Status,
              StartDate,
              EndDate
            );
          }
        );
      })
      .catch((err) => {
        console.log("err B", err.message);
      });
  }, []);

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
      <ScrollView style={styles.container}>
        {DATA.map((item, index) => {
          const { id, campName, campDesc, from, to, bonus, imageUrl } = item;
          return (
            <View key={id} style={styles.card}>
              <Text style={styles.campName}>{campName}</Text>
              <Text style={styles.campDesc}>{campDesc}</Text>
              <Text style={styles.campDetails}>From: {from}</Text>
              <Text style={styles.campDetails}>To: {to}</Text>
              <Text style={styles.campDetails}>Bonus: {bonus}</Text>
              <Text style={styles.campDetails}>
                Image:{" "}
                <Text
                  style={styles.imageLink}
                  onPress={() =>
                    navigation.navigate("ImagePreview", {
                      imageUrl: imageUrl,
                    })
                  }
                >
                  view
                </Text>
              </Text>
            </View>
          );
        })}
      </ScrollView>
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
    paddingVertical: 10,
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
});
