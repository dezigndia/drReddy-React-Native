import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, TextInput, Modal, ActivityIndicator, Alert } from 'react-native';
import AnimateNumber from 'react-native-countup'
import * as ActionTypes from '../../data/actionTypes';
import orm from 'src/data';
import { getState } from 'src/storeHelper';
import baseUrl from '../Constants/Constants';
var parseString = require('xml2js').parseString;
import { NavigationEvents, NavigationActions } from 'react-navigation';
let SCREENHEIGHT = Dimensions.get('screen').height;
let SCREENWIDTH = Dimensions.get('screen').width;
export default class EarnPoints extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '',
      modalVisible: false,
      TotalEarnPoint:''
    };
  }
  _onSubmit = ()=>{
    const dbState = getState().data;
    const sess = orm.session(dbState);    
    console.log("sess",sess);
     if (sess.User.idExists(0)) {
      const User = sess.User.withId(0);
      const { id, ChemistCardNo, mobile, TotalEarnPoint } = User.ref;

     
      const details = {
          'memberLogin': ChemistCardNo,
          'VoucherCode': this.state.code
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
      var _that=this;
      fetch(baseUrl + '/GetEarnPoints', options)
          .then(res => res.text())
          .then(res => {
            this.setState({loading:false},()=>this.setModalVisible(!this.state.modalVisible));            //   let data = JSON.parse(res);
              console.log("data:", res);
              this.setState({
                code:''
              })
              parseString(res, async(err, result)=> {
                console.log("result",result);
                if (result.string._ === 'Voucher code has already been used') {
                    
                  Alert.alert(
                      'Prime Partner',
                      result.string._,
                      [
                          { text: 'OK', onPress: () => console.log('OK Pressed') },
                      ],
                      { cancelable: false },
                  );
                  
              }
              else if (result.string._ === 'Sorry!! You do not have permission to scan the Code.') {

                  Alert.alert(
                      'Prime Partner',
                      result.string._,
                      [
                          { text: 'OK', onPress: () => console.log('OK Pressed') },
                      ],
                      { cancelable: false },
                  );
                  
              }
              else if (result.string._ === 'Wrong VoucherCode') {

                  Alert.alert(
                      'Prime Partner',
                      result.string._,
                      [
                          { text: 'OK', onPress: () => console.log('OK Pressed') },
                      ],
                      { cancelable: false },
                  );
                  
              }
              else if (result.string._ === 'Invalid VoucherCode') {

                  Alert.alert(
                      'Prime Partner',
                      result.string._,
                      [
                          { text: 'OK', onPress: () => console.log('OK Pressed') },
                      ],
                      { cancelable: false },
                  );
                  
              } 
              else if (result.string._ === 'SKU is blocked') {

                  Alert.alert(
                      'Prime Partner',
                      result.string._,
                      [
                          { text: 'OK', onPress: () => console.log('OK Pressed') },
                      ],
                      { cancelable: false },
                  );
                  
              } else {
                  _that.props.navigation.navigate('Congratulations',{
                      message:result.string._
                  });
              }
                // if (result.string._ !== 'Voucher code has already been used') {
  
                //     _that.props.navigation.navigate('Congratulations',{

                //     });
                    
                // } else {
                //     // _that.props.navigation.navigate('Congratulations');
                //     Alert.alert(
                //         'Prime Partner',
                //         result.string._,
                //         [
                //             { text: 'OK', onPress: () => console.log('OK Pressed') },
                //         ],
                //         { cancelable: false },
                //     );
                // }
              })

          })
          .catch((err) => {
              console.log('error:', err);
               this.setState({loading:false},()=>this.setModalVisible(!this.state.modalVisible));  
              Alert.alert(
                  'Prime Partner',
                  JSON.stringify(err),
                  [
                      { text: 'OK', onPress: () => console.log('OK Pressed') },
                  ],
                  { cancelable: false },
              );
              // alert(JSON.stringify(err));
          })
        }
  }
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
    }   

  _getTotalEarnPoints = () =>{
    
    const dbState = getState().data;
    const sess = orm.session(dbState);    
    console.log("sess",sess);
     if (sess.User.idExists(0)) {
      const User = sess.User.withId(0);
      const { id, ChemistCardNo, mobile, TotalEarnPoint, Balance } = User.ref;
      this.setState({
        TotalEarnPoint:parseInt(Balance)
      },
        // ()=>alert("_getTotalEarnPoints")
      )
    }
  }
  componentDidMount = () =>{
    this._getTotalEarnPoints();
  }
  render() {
    return (
      <View style={styles.container}>
      <NavigationEvents onDidFocus={() => this._getTotalEarnPoints()}/>
        <View style={{flex:1, backgroundColor:'#fff', marginTop:15, marginBottom:20, marginLeft:10, marginRight:10, borderRadius:10 }}>
      	  <View style={{ flexDirection:'row', justifyContent:'space-between', margin:10, marginRight:20 }}> 
              <Image source={require('../assets/goldCoins.png')} 
                 style={{height:40, width:40, resizeMode:'contain', alignSelf:'center'}}
              />
              <Text style={{ fontSize:16, color:'#000', fontWeight:'600', alignSelf:'center'}}> Latest points Balance </Text>
              <Text style={{ fontSize:16, color:'#000', fontWeight:'600',   alignSelf:'center'}}>
              <AnimateNumber value={this.state.TotalEarnPoint} 
                        countBy={50}
                        formatter={(val) => {
                            return parseFloat(val).toFixed(0)
                        }}
                        timing={(interval, progress) => {
                            // slow start, slow end
                            return 1 * (1 - Math.sin(Math.PI*progress) )*10
                        }}
                        />
              </Text>
          </View>
          <View style={{marginLeft:10,marginRight:10,borderStyle: 'dashed', borderRadius:5, borderWidth:1, borderColor:'#6633cc',}}/>
          <View style={{justifyContent:'center', alignItems:'center', marginTop:20 }}>
                <TouchableOpacity
                onPress={()=>{
                  try{
                    this.props.navigation.replace('CameraScreen',{
                    dummy:'data111'
                    })
                  }catch(err){
                    console.log('err',err);
                  }
                }}
                >
                  <Image source={require('../assets/camera.png')}
                  style={{height:120, width:120, resizeMode:'contain'}}
                  />
                </TouchableOpacity>
          </View>
          <Text style={[styles.context,{marginTop:10}]}> Scan code on the box</Text>
          <Text></Text>
          <Text style={styles.context}>Or</Text>
          <TextInput
            value={this.state.code}
            keyboardType='decimal-pad'
            placeholder='Enter the code'
            placeholderTextColor='#4a4a4a'
            onChangeText={(code)=>this.setState({code:code})}
            style={{  borderLeftWidth: 0, borderRightWidth: 0, borderBottomWidth: 1, borderColor: '#67c2e1', alignSelf:'center', paddingLeft:20, paddingRight:20 }}
          />
          <TouchableOpacity
            style={{height:40, width:150, marginTop:20, backgroundColor:'#6633cc', alignSelf:'center', borderRadius:5, justifyContent:'center', alignItems:'center' }}
            onPress={() => {
              this.setState({ modalVisible: true });
              this._onSubmit();

              // this.props.navigation.navigate('Congratulations',{
              //         message:"Congratulations! You have earned 24 Points Your latest Balance is 974 points."
              //         // message:result.string._
              //     });
              // this.props.navigation.navigate('EarnPoints')
            }}
          >
              <Text style={{color:'#fff'}}>Submit</Text>
          </TouchableOpacity>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            // Alert.alert('Modal has been closed.');
          }}>
          <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
            <ActivityIndicator style={{ alignSelf: 'center' }} size="large" color="#0000ff" />
          </View>
        </Modal>
      </View>
    );
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
    }
    
})