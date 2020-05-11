import React, { Component } from 'react'
import { Text, View, StyleSheet, Dimensions, SafeAreaView, Image, TouchableOpacity, ScrollView, Modal, ActivityIndicator, Alert, NetInfo } from 'react-native'

import { DrawerActions,  NavigationActions, StackActions } from 'react-navigation'
import AnimatedProgressWheel from 'react-native-progress-wheel';
import MyLabels from './MyLabels';
import Pie from 'react-native-fab-pie';
import AnimateNumber from 'react-native-countup'
import * as ActionTypes from '../../data/actionTypes';
import orm from 'src/data';
import { getState } from 'src/storeHelper';
import baseUrl from '../Constants/Constants';
import PTRView from 'react-native-pull-to-refresh';
var parseString = require('xml2js').parseString;
// import 'react-circular-progressbar/dist/styles.css';
let SCREENHEIGHT = Dimensions.get('screen').height;
let SCREENWIDTH = Dimensions.get('screen').width;
const pia = [
    { name: 'Points Balance', population: 1750, color: '#00ef9f', legendFontColor: '#000', legendFontSize: 14 },
    { name: 'Point redeemed', population: 2300, color: '#ffc7b8', legendFontColor: '#000', legendFontSize: 14 },
    // { name: 'Beijing', population: 527612, color: 'red', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    // { name: 'New York', population: 8538000, color: '#000', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    // { name: 'Moscow', population: 11920000, color: 'rgb(0, 0, 255)', legendFontColor: '#7F7F7F', legendFontSize: 15 }
  ]
const chartConfig = {
    backgroundGradientFrom: '#1E2923',
    backgroundGradientTo: '#08130D',
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2 // optional, default 3
  }
export default class HomTab extends Component {
    constructor(props) {
        super(props)    
        this.state = {
          pieData:[
            {value: '0', title: "Points Balance: 0", color: "#00ef9f", key: "pie-0"},
            {value: '0', title: "Points Redeemed: 0", color: "#ffc7b8", key: "pie-1"}
          ],
          loading:false,
          Balance:'',
          Output:'',
          Membership:'',
          TotalEarnPoint:'',
          modalVisible: false,
          mobile:'',
          password:'',
          TotalSpentPoint:'',
          PointsRequired:'', 
          Points:'',
        };
      }
        setModalVisible(visible) {
            this.setState({ modalVisible: visible });
        }
      componentDidMount = async()=> {
        NetInfo.getConnectionInfo().then((connectionInfo) => {
            console.log(
              'Initial, type: ' +
                connectionInfo.type +
                ', effectiveType: ' +
                connectionInfo.effectiveType,
            );
          });
        NetInfo.isConnected.fetch().then(isConnected => {
            console.log('First, is ' + (isConnected ?'online' :'offline'));
          });
        console.log("this.props.navigation", this.props, "NavigationActions", NavigationActions);
        this.pie.current.animate();

        const dbState = getState().data;
        const sess = orm.session(dbState);    
        console.log("sess",sess);
        if (sess.User.idExists(0)) {
          const User = sess.User.withId(0);
          const { id, Balance, Output, Membership, TotalEarnPoint, mobile, password, TotalSpentPoint, PointsRequired, Points } = User.ref;
          this.setState({ id, Balance, Output, Membership, TotalEarnPoint, mobile, password, TotalSpentPoint, PointsRequired:parseInt(PointsRequired), Points:parseInt(Points) },()=>{
              this.setState({
                pieData:[
                    {value: parseInt(Balance).toString(), title: "Points Balance:  "+parseInt(Balance).toString(), color: "#00ef9f", key: "pie-0"},
                    {value: parseInt(TotalSpentPoint).toString(), title: "Points Redeemed:"+parseInt(TotalSpentPoint).toString(), color: "#ffc7b8", key: "pie-1"}
                  ],
                  loading:false
              })
            //   this.setState({loading:false},()=>this.setModalVisible(!this.state.modalVisible))
          });
        }
      }
    _onLogin = async () => {
        this.setState({loading:true},()=>this.setModalVisible(!this.state.modalVisible))
        const dbState = getState().data;
        const sess = orm.session(dbState);    
        console.log("sess",sess);
        if (sess.User.idExists(0)) {
          const User = sess.User.withId(0);
          const { id, Balance, Output, Membership, TotalEarnPoint, password, mobile, TotalSpentPoint } = User.ref;
          this.setState({ id, Balance, Output, Membership, TotalEarnPoint,  password, mobile, TotalSpentPoint})
       
        const details = {
            'MobileNo': this.state.mobile,
            'Password': this.state.password,
            'DeviceID': 'sadasdasdasd'
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
        var _that = this;
        fetch(baseUrl + '/PrimaLogin', options)
            .then(res => res.text())
            .then(res => {
                this.setState({ loading: false }, () => this.setModalVisible(!this.state.modalVisible))
                parseString(res, function (err, result) {
                    if (result.Value.AccountID[0] != 'NA') {
                        console.log('result', result.Value, _that.props.navigation);


                        _that.setState({
                            Balance: result.Value.Balance[0],
                            Output: result.Value.Output[0],
                            Membership: result.Value.Membership[0],
                            TotalEarnPoint: result.Value.TotalEarnPoint[0],
                            pieData:[
                                {value: parseInt(result.Value.Balance[0]).toString(), title: "Points Balance:  "+parseInt(result.Value.Balance[0]).toString(), color: "#00ef9f", key: "pie-0"},
                                {value: parseInt(result.Value.TotalEarnPoint[0]).toString(), title: "Points Redeemed:"+parseInt(result.Value.TotalEarnPoint[0]).toString(), color: "#ffc7b8", key: "pie-1"}
                              ],
                        })
                        _that.setState({
                            Points: parseInt(result.Value.Points[0]),
                            TotalExpiredPoint: parseInt(result.Value.TotalExpiredPoint[0]),
                        })

                        const { dispatch } = _that.props.navigation;
                        const User = Object.assign({}, {
                            id: 0,
                            AccountID: result.Value.AccountID[0],
                            AccountTypeID: result.Value.AccountTypeID[0],
                            Balance: result.Value.Balance[0],
                            ChemistCardNo: result.Value.ChemistCardNo[0],
                            DaysRemainingforNextTier: result.Value.DaysRemainingforNextTier[0],
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
                        });
                        dispatch({
                            type: ActionTypes.USER_DATA,
                            User
                        });
                        Alert.alert(
                            'Prime Partner',
                            'Refreshed successfully',
                            [
                                { text: 'OK', onPress: () => console.log('OK Pressed') },
                            ],
                            { cancelable: false },
                        );
                        const dbState = getState().data;
                        const sess = orm.session(dbState);
                        console.log("sess", sess);
                    } else {
                        Alert.alert(
                            'Prime Partner',
                            result.Value.ChemistCardNo[0],
                            [
                                { text: 'OK', onPress: () => console.log('OK Pressed') },
                            ],
                            { cancelable: false },
                        );
                        // alert(result.Value.ChemistCardNo[0])
                        // this.setModalVisible(!this.state.modalVisible);
                    }
                });
            })
            .catch((err => console.log("err", err)))
        }
    }
      _refresh=()=> {
        return new Promise((resolve) => {
          setTimeout(()=>{
            this._onLogin();
            resolve()
            }, 800)
        });
      }
      pie = React.createRef();

    render() {
        console.log("this.state",this.state)
        return (
            <SafeAreaView style={styles.container}>
            <View style={styles.container}>
            <PTRView onRefresh={this._refresh} >
                <View style={{flexDirection:'row', alignSelf:'center', margin:20, width:SCREENWIDTH-20, borderWidth:0, backgroundColor:'#6633cc', borderRadius:10, }}>
                        <TouchableOpacity style={{ borderWidth: 0, width: '33.3%', height: 40, flexDirection: 'row', justifyContent:'center', borderTopLeftRadius:10, borderBottomLeftRadius:10}}
                        onPress={() => this.props.navigation.navigate('EarnPointsTab')}
                        >
                            <Image
                                source={(require('../assets/Icons-03.png'))}
                                style={{ height: 25, width: 25, resizeMode: "contain", alignSelf:'center' }}
                            />
                            <Text style={{color:'#fff', alignSelf:'center', margin:2}}>Earn Points</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ borderWidth: 0, width: '33.3%', height: 40, flexDirection: 'row', justifyContent:'center',borderLeftWidth:1, borderRightWidth:1,borderColor:'#fff' }}
                        onPress={() => this.props.navigation.navigate('Trend')}                        
                        >
                            <Image
                                source={(require('../assets/Icons-04.png'))}
                                style={{ height: 25, width: 25, resizeMode: "contain", alignSelf:'center', }}
                            />
                            <Text style={{color:'#fff', alignSelf:'center', margin:5}}>Trend</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ borderWidth: 0, width: '33.3%', height: 40, flexDirection: 'row', justifyContent:'center', borderTopRightRadius:10, borderBottomRightRadius:10 }}
                        onPress={() => this.props.navigation.navigate('RewardCatalogue')}
                        >
                            <Image
                                source={(require('../assets/Icons-06.png'))}
                                style={{ height: 25, width: 25, resizeMode: "contain", alignSelf:'center' }}
                            />
                            <Text style={{color:'#fff', alignSelf:'center', margin:0, }}>Redeem Gifts</Text>
                        </TouchableOpacity>
                   
                </View>
                <ScrollView>
                <View style={{ height:SCREENHEIGHT * 0.7,backgroundColor:'#fff', marginLeft:10, marginRight:10, marginBottom:10, borderRadius:10}}>
                    <View style={{height:SCREENHEIGHT * 0.2, borderWidth:0, flexDirection:'row'}}>
                        <View style={{height:'100%', width:'50%', borderWidth:0}}>
                                {
                                    this.state.Membership === 'Gold' &&
                                    <Image source={require('../assets/Gold.png')}
                                    style={{resizeMode:'contain', width:'100%', height:'100%'}}
                                    />
                                }
                                {
                                    this.state.Membership === 'Silver' &&
                                    <Image source={require('../assets/Silver.png')}
                                    style={{resizeMode:'contain', width:'100%', height:'100%'}}
                                    />
                                }
                                {
                                    this.state.Membership === 'Platinum' &&
                                    <Image source={require('../assets/Platinum.png')}
                                    style={{resizeMode:'contain', width:'100%', height:'100%'}}
                                    />
                                }

                            
                        </View>
                        <View style={{height:'100%', width:'50%', borderWidth:0, justifyContent:'center', alignItems:'center', borderWidth:0}}>
                            {/* <PercentageCircle 
                                radius={50} 
                                percent={17} 
                                color={"#000000"}
                                textStyle={{fontSize: 24, color: '#000', fontWeight:'400'}}
                                borderWidth={5}
                                bgcolor={'#ffd766'}
                            
                            ></PercentageCircle> */}
                            {/* <AnimatedProgressWheel
                                    progress={17}
                                    animateFromValue={0}
                                    duration={5000}
                                    color={'#000'}
                                    fullColor={'red'}
                                    backgroundColor={'#ffd766'}
                            /> */}


                                <AnimatedProgressWheel
                                    size={SCREENWIDTH/3.5}
                                    width={5}
                                    duration={1000}
                                    animateFromValue={-1}
                                    color={'#000'}
                                    progress={
                                       
                                        this.state.PointsRequired=== 0 ?
                                            100
                                        :
                                        this.state.Membership ==="Gold" ?
                                        (
                                            parseInt((this.state.Points/this.state.PointsRequired)*100)
                                        )
                                        :
                                        (
                                            this.state.Membership ==="Silver" ?
                                                parseInt((this.state.Points/this.state.PointsRequired)*100)
                                            :
                                                100
                                        )

                                        }
                                    backgroundColor={'#ffd766'}
                                >
                                </AnimatedProgressWheel>
                                    {
                                        this.state.PointsRequired=== 0 ?
                                            
                                            <Text style={{color:'#000',position:'absolute', fontSize:18}}>100%</Text>
                                        :
                                        (
                                            this.state.Membership ==='Platinum' ? 
                                            <Text style={{color:'#000',position:'absolute', fontSize:18}}>{parseInt((this.state.Points/2500)*100)}%</Text>
                                            : 
                                            <Text style={{color:'#000',position:'absolute', fontSize:18}}>{parseInt((this.state.Points/this.state.PointsRequired)*100)}%</Text>
                                        )
                                    }
                                    {/* <Text style={{color:'#000',position:'absolute', fontSize:18}}>{parseInt(this.state.PointsRequired)}%</Text> */}
                                   
                        </View>
                    </View>
                    <View style={{paddingBottom:20,}}>
                        <Text style={{alignSelf:'center', fontSize:12, textAlign:'center', letterSpacing:0.8, color:'#000'}}>{this.state.Output}</Text>
                    </View>
                    <View style={{marginLeft:10,marginRight:10,borderStyle: 'dashed', borderRadius:5, borderWidth:1, borderColor:'#6633cc',}}/>
                    <View style={{height:SCREENHEIGHT * 0.3}}>
                        <Text style={{alignSelf:'center',textAlign:'center', fontSize:16, fontWeight:'600', color:'#000', margin:10}}> Total Points Earned </Text>
                        <View style={{borderWidth:0, height:SCREENHEIGHT * 0.3, justifyContent:'center', alignItems:'center',}}>
                                {/* <PieChart
                                    style={{elevation:5}}
                                    data={pia}
                                    width={SCREENWIDTH}
                                    height={SCREENHEIGHT*0.3}
                                    chartConfig={chartConfig}
                                    accessor="population"
                                    backgroundColor="transparent"
                                    paddingLeft="0"
                                    absolute
                                />
                                 */}
                                <Pie
                                    ref={this.pie}
                                    containerStyle={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        marginVertical: 0,
                                    }}
                                    pieStyle={{
                                        width: 200,
                                        height: 200,
                                        flex: 1,
                                    }}
                                    outerRadius={80}
                                    innerRadius={0.1}
                                    data={this.state.pieData}
                                    animate
                                >
                                    <MyLabels />
                                </Pie>
                        </View>
                    
                    <Text style={{color:'#000', alignSelf:'center', fontSize:16}}>Point Balance: <AnimateNumber value={this.state.Balance} 
                        countBy={50}
                        formatter={(val) => {
                            return parseFloat(val).toFixed(0)
                        }}
                        timing={(interval, progress) => {
                            // slow start, slow end
                            return 1 * (1 - Math.sin(Math.PI*progress) )*10
                        }}
                        /></Text>
                    {/* <AnimateNumber value={100} timing="linear"/> */}
                    
                    {/* <AnimateNumber value={100} timing="easeIn"/> */}
                    </View>
                </View>
                </ScrollView>
                <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.modalVisible}
                        onRequestClose={() => {
                            Alert.alert('Modal has been closed.');
                        }}>
                        <View style={styles.modalView}>
                        <ActivityIndicator style={styles.spinner} size="large" color="#0000ff" />
                        </View>
                    </Modal>
            </PTRView>
            </View>
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#87cefa',
        // justifyContent:'center',
    },
    context:{
        alignSelf:'center',
        textAlign:'center'
    },
    spinner:{
        alignSelf:'center'
    },
    modalView:{
        flex:1, 
        justifyContent:'center',
        backgroundColor:'rgba(0,0,0,0.3)' 
    },
})