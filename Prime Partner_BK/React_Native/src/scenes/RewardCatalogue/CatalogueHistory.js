import React, { Component } from 'react'
import { Text, StyleSheet, View, Dimensions, SafeAreaView, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
let SCREENWIDTH = Dimensions.get('screen').width;
let SCREENHEIGHT = Dimensions.get('screen').height;
// import baseUrl from '../Constants/Constants';
import baseUrl from '../Constants/production';
var parseString = require('xml2js').parseString;


import * as ActionTypes from '../../data/actionTypes';
import orm from 'src/data';
import { getState } from 'src/storeHelper';

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
        super(props)

        this.state = {
            data: [],
            loading:true,
            noData:false,
        }
    }

    componentDidMount = ()=>{
        const dbState = getState().data;
        const sess = orm.session(dbState);
        if (sess.User.idExists(0)) {
            const User = sess.User.withId(0);
            const { id, ChemistCardNo} = User.ref;

        const details = {
            'MemberLogin': ChemistCardNo,
            // 'MemberLogin': '23300027',
            // 'MemberLogin': '23300020',
          }
          const Body = Object.keys(details).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key])).join('&');
      
          const options = {
            method: 'POST',
            body: Body,
            headers: {
              'Accept': 'multipart/form-data',
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          };
          let data=[];
          _that=this;
          fetch(baseUrl + '/GetOrderByMemberLogin', options)
            .then(res => res.text())
            .then(res => {
                // console.log("res",res);
               parseString(res, async(err, result)=> {
                   console.log("result",result);
                if(result.DataSet["diffgr:diffgram"][0].NewDataSet[0].Table!=undefined){
                console.log("(result.DataSet['diffgr:diffgram']",result.DataSet["diffgr:diffgram"][0].NewDataSet[0].Table);
                await result.DataSet["diffgr:diffgram"][0].NewDataSet[0].Table.map((item,index)=>{
                    console.log("item",item.DeliveryStatus);

                    if(item.DeliveryStatus == undefined){
                        console.log("undefined block",);
                        let obb= {
                            // Address1:item.Address1[0], 
                            // Address2: item.Address2[0],  
                            // Address3: item.Address3[0], 
                            CardNumber:item.CardNumber[0],
                            CityName:item.CityName[0],
                            // DeliveryDate:item.DeliveryDate[0],
                            DeliveryStatus:'Not Delivered',
                                // DispatchDate:item.DispatchDate[0],  
                            GiftRequiredPoints:item.GiftRequiredPoints[0],
                            ImageURL:item.ImageURL[0],
                            ItemName:item.ItemName[0],
                            Itemcode:item.Itemcode[0],
                            OrderDate:item.OrderDate[0],
                            OrderID:item.OrderID[0],
                            OrderReference:item.OrderReference[0],
                            Pincode:item.Pincode[0],
                            Quantity:item.Quantity[0],
                            ReceiveStatus:item.ReceiveStatus[0],
                            // RedemptionStatus:item.RedemptionStatus[0],
                            StateName:item.StateName[0],
                            Status:item.Status[0],
                            // TrackingAWBno:item.TrackingAWBno[0]
                        }
                        // console.log("if",obb);
                         data.push(obb);
                    }else{
                        let obb= {
                            // Address1:item.Address1[0], 
                            // Address2: item.Address2[0],  
                            // Address3: item.Address3[0], 
                            CardNumber:item.CardNumber[0],
                            CityName:item.CityName[0],
                                // DeliveryDate:item.DeliveryDate[0],
                            DeliveryStatus:item.DeliveryStatus[0],
                                // DispatchDate:item.DispatchDate[0],  
                            GiftRequiredPoints:item.GiftRequiredPoints[0],
                            ImageURL:item.ImageURL[0],
                            ItemName:item.ItemName[0],
                            Itemcode:item.Itemcode[0],
                            OrderDate:item.OrderDate[0],
                            OrderID:item.OrderID[0],
                            OrderReference:item.OrderReference[0],
                            Pincode:item.Pincode[0],
                            Quantity:item.Quantity[0],
                            ReceiveStatus:item.ReceiveStatus[0],
                            // RedemptionStatus:item.RedemptionStatus[0],
                            StateName:item.StateName[0],
                            Status:item.Status[0],
                            // TrackingAWBno:item.TrackingAWBno[0]
                        }
                        // console.log("else",obb);
                         data.push(obb);
                    }
                    // let obb= {
                    //     Address1:item.Address1[0], 
                    //     Address2: item.Address2[0],  
                    //     Address3: item.Address3[0], 
                    //     CardNumber:item.CardNumber[0],
                    //         CityName:item.CityName[0],
                    //         // DeliveryDate:item.DeliveryDate[0],
                    //         // DeliveryStatus:item.DeliveryStatus[0],
                    //         // DispatchDate:item.DispatchDate[0],  
                    //     GiftRequiredPoints:item.GiftRequiredPoints[0],
                    //     ImageURL:item.ImageURL[0],
                    //     ItemName:item.ItemName[0],
                    //     Itemcode:item.Itemcode[0],
                    //     OrderDate:item.OrderDate[0],
                    //     OrderID:item.OrderID[0],
                    //     OrderReference:item.OrderReference[0],
                    //     Pincode:item.Pincode[0],
                    //     Quantity:item.Quantity[0],
                    //     ReceiveStatus:item.ReceiveStatus[0],
                    //     // RedemptionStatus:item.RedemptionStatus[0],
                    //     StateName:item.StateName[0],
                    //     Status:item.Status[0],
                    //     // TrackingAWBno:item.TrackingAWBno[0]
                    // }
                    //  data.push(obb);
                })
                console.log(data);
                _that.setState({data:data, loading:false})

                }else{
                    _that.setState({loading:false, noData:true})
                }
              }); 
            })
            .catch((err => {
              this.setState({error:true, loading:false})
              console.log("err", err)
            }))
        }
    }
    renderItem = ({ item }) => {
    return(
        <View style={{ borderBottomWidth: 0.5, }}>
            <View style={{ flexDirection:'row', marginTop:10}}>

                <Image
                    source={{uri:item.ImageURL}}
                    style={{resizeMode:'contain', borderWidth:0, width:'40%'}}
                />
                <View style={{borderWidth:0, width:'60%'}}>
                    <Text style={{color:'#000', fontSize:12, letterSpacing:.8}}>Ref Id: {item.OrderReference}</Text>
                    <Text style={{color:'#000', fontSize:12, letterSpacing:.8}}>Redeem On: {item.OrderDate}</Text>
                    <Text style={{color:'#000', fontSize:12, letterSpacing:.8}}>ItemCode: {item.Itemcode}</Text>
                    <Text style={{color:'#000', fontSize:12, letterSpacing:.8}}>Status: {item.Status}</Text>
                </View>
            </View>
            <View style={{marginTop:10}}>
                {
                    
                item.Status === 'Approved' && item.DeliveryStatus!=="Delivered" &&<Image 
                    source={require('../assets/approved.png')}
                    style={{height:50, width:SCREENWIDTH ,resizeMode:'center'}}
                />
                }
                {
                    
                item.Status === 'Pending' &&<Image 
                    source={require('../assets/pending.png')}
                    style={{height:50, width:SCREENWIDTH ,resizeMode:'center'}}
                />
                }
                {
                    
                item.Status === 'Dispatched' &&<Image 
                    source={require('../assets/dispatched.png')}
                    style={{height:50, width:SCREENWIDTH ,resizeMode:'center'}}
                />
                }
                {
                    
                item.Status === 'Approved' && item.DeliveryStatus==="Delivered"&&<Image 
                    source={require('../assets/delivered.png')}
                    style={{height:50, width:SCREENWIDTH ,resizeMode:'center'}}
                />
                }
                <View
                    style={{borderWidth:0,justifyContent:'flex-end', alignItems:'flex-end'}}
                >
                <TouchableOpacity
                    style={{height:20, padding:13, borderWidth:0, justifyContent:'center', alignItems:'center', backgroundColor:  item.Status === 'Approved' && item.DeliveryStatus==="Delivered" && item.ReceiveStatus === 'Not Received' ? '#00D084' :'#666666', marginRight:10}}
                    disabled={item.Status === 'Approved' && item.DeliveryStatus==="Delivered" && item.ReceiveStatus === 'Not Received' ? false : true}
                        onPress={() => {
                            if (item.Status === 'Approved' && item.DeliveryStatus==="Delivered" && item.ReceiveStatus === 'Not Received') {
                                this.props.navigation.navigate("PSRSignature", {    
                                    OrderReference: item.OrderReference,
                                })
                            }
                        }
                        }
                >
                    <Text style={{color:'#fff'}}>RECEIVED</Text>
                    
                </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
    render() {
        return (
            <SafeAreaView style={styles.container}>
            <View style={styles.container}>
                <View style={styles.headerView}>
                <TouchableOpacity
                        style={{alignSelf:'center'}}
                        onPress={()=>this.props.navigation.navigate("RewardCatalogue")}
                    >
                <Image source={require('../assets/history.png')}
                            style={{ width: 35, height: 35, resizeMode: 'contain', paddingRight: 0, alignSelf:"center" }}
                />
                </TouchableOpacity>
                    <Text style={{color:'#fff', alignSelf:'center', fontSize:18}}>Redemption History</Text>
                    <TouchableOpacity
                    style={{alignSelf:'center'}}
                        onPress={()=>this.props.navigation.navigate("HomeTABS")}
                    >
                    <Entypo 
                        name="home" size={30} color="#fff" style={{alignSelf:'center'}}    
                    />
                    </TouchableOpacity>
                </View>
                {
                        !this.state.loading ?
                <View style={{flex:1,justifyContent:'center', alignItems:'center'}}>
                        {
                        !this.state.noData ?
                        <FlatList
                            // data={[{ key: 'a' },]}
                            data={this.state.data}
                            renderItem={this.renderItem}
                        />

                        :

                        <Text style={{alignSelf:'center'}}>No History Found.</Text>
                        }                   
                </View>

                :

                <View style={{ flex:1, justifyContent:'center', alignItems:'center'}}>
                    <ActivityIndicator size='large' color='#6633cc'/>
                </View>
                }

            </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    headerView:{
        height:SCREENHEIGHT * 0.06,
        backgroundColor:'#6633cc',
        flexDirection:'row',
        justifyContent:'space-between',
        paddingLeft:10,
        paddingRight:10,
    }
})

