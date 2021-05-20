import React, { Component, useState } from 'react';  
//mport { View, Text, StyleSheet, Button } from 'react-native';  
import {Platform, StyleSheet, Text,Alert, View,TouchableOpacity,TextInput,Image,Dimensions,Button, ScrollView} from 'react-native'; 
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import Icon from 'react-native-vector-icons/Ionicons'; 
import colors from '../assets/colors';
import {
  LineChart
} from 'react-native-chart-kit';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import { USER, DefaultConnectOptions, ConnectSetting, Topics, Subscribe_Topics } from '../global/user';


import MQTT from '../mqtt/mqtt-object';
import {AsyncStorage} from "../node_modules/react-native";
import init from 'react_native_mqtt';
import uuid from 'react-native-uuid';
import { interpolate } from 'react-native-reanimated';



/*
  TODO:
  1.  Viết hàm get nhiệt theo 3 giờ 1 lần cho chart như mẫu,
  2.  Viết hàm get nhiệt độ realtime,
  3.  Viết hàm get trạng thái các thiết bị,
  4.  Viết hàm báo động.
  5.  Viết hàm get trạng thái hệ thống đang báo động hay ổn định,
  6.  Viết hàm cho button Bật/tắt báo động, gửi tín hiệu về cho server điều khiển thiết bị
 */

const data = {
  labels: ['1:00', '4:00', '7:00', '10:00', '13:00', '16:00', '19:00', '22:00', //'17:00', '19:00'
  // , '13:00', '15:00', '17:00'
  ],
        datasets: [{
          data: [
            29.0,
            24.3,
            26.0,
            28.1,
            32.0,
            33.4,
            35.0,
            // 35.5,
            // 34.0,
            10,
            // 30.0,
          ]
        }]
}
//chart
const CustomChart = () => {
  return(
    <View>
      <LineChart
      //segments={5}
      data={data}
      width={wp('105%')} // from react-native
      height={240}
      chartConfig={chartConfig}
      //fromZero
      bezier
      //maxValue={45}
      style={{alignSelf:"center", marginTop:-10}}
      //formatYLabel={() => yLabelIterator.next().value}
      />
    </View>
  );
};


// init({
//     size: 10000,
//     storageBackend: AsyncStorage,
//     defaultExpires: 1000 * 3600 * 24,
//     enableCache: true,
//     sync: {},
// });





class Dashboard extends Component{
    constructor(props) {
        super(props);
        this.state = {
            valve : 'OFF',
            fan: 'OFF',
            pump: 'OFF',
            temp: '0',
            warning: false,
        }

        this.turnOnHandler = this.turnOnHandler.bind(this);
        this.turnOffHandler = this.turnOffHandler.bind(this);
        this.subscribeTopics = this.subscribeTopics.bind(this);
        this.updateObjects = this.updateObjects.bind(this);

        this.mqtt = new MQTT();
        this.mqtt.ConnectSuccessAction = () => {
            this.subscribeTopics();
        }
        this.mqtt.SetResponseFunction = (message) => {
            console.log("Changing state of ", message.destinationName);
            console.log("see value:  ", JSON.parse(message.payloadString).data);
            let val = JSON.parse(message.payloadString).data
            this.updateObjects(message.destinationName, val);
        }
        this.mqtt.connect(USER.host, USER.port, USER.userName, USER.password);
        
    }
    
    static navigationOptions = {  
        title: 'Dashboard',  
    };
    
    // main object update
    updateObjects(destinationName, data) {
        Subscribe_Topics.forEach(({ name, thing }) => {
            if (name == destinationName) {
                if (thing == 'relay') {
                    if (data == '1') {
                        this.setState({valve: 'ON', fan: 'ON', pump: 'ON', warning: true});
                    } else {
                        this.setState({valve: 'OFF', fan: 'OFF', pump: 'OFF', warning: false});
                    }    
                }
                if (thing == 'temp') {
                    let t = data.split('-')[0];
                    this.setState({temp: t});
                    if (parseInt(t) > 37) {
                        this.setState({ warning: true });
                    } else {
                        this.setState({ warning: false});
                    }
                }
                if (thing == 'gas') {
                    let t = data.split('-')[0];
                    if (data == '1') {
                        this.turnOnHandler();
                    } else {
                        this.turnOffHandler();
                    }
                }
            }
        });
    }
    
    subscribeTopics() {
        console.log("Subscribing");
        Subscribe_Topics.forEach((sub_topic) => {
            this.mqtt.subscribeTopic(sub_topic.name);
        });
    }
    
    turnOnHandler() {
        
        Topics.forEach(({ name, jsonobj, on }) => {
            this.mqtt.send(name, JSON.stringify(jsonobj(on)));
        });
    }
    
    turnOffHandler() {
        Topics.forEach(({ name, jsonobj, off }) => {
            this.mqtt.send(name, JSON.stringify(jsonobj(off)));
        });
    }

    render(){
        return (
            <ScrollView>
            <View style={home_styles.container}>
            <View style={home_styles.control_wrapper}>
                <View style={home_styles.connect_view}>
                    <Text style={home_styles.txtBlue_title}>BÁO ĐỘNG</Text>

                    {/* <TouchableOpacity onPress={this.subscribeTopics} style={home_styles.btnOn}>
                        <Text style={home_styles.txtOn}>sub</Text>
                    </TouchableOpacity> */}
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-evenly',}}>
                <TouchableOpacity onPress={this.turnOnHandler} style={home_styles.btnOn}>
                    <Text style={home_styles.txtOn}>BẬT</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.turnOffHandler} style={home_styles.btnOff}>
                    <Text style={home_styles.txtOff}>TẮT</Text>
                </TouchableOpacity>
                </View>
            </View>
            <View style={home_styles.box2}>
                <View style={home_styles.temperature_wrapper}>
                <Text style={home_styles.txtWhite_title}>NHIỆT ĐỘ</Text>
                <Text style={home_styles.txtWhite_nhietdo}>{ this.state.temp }</Text>
                </View>
                <View style={[home_styles.status_wrapper,this.state.warning?{backgroundColor:colors.red}:{backgroundColor:colors.white}]}>
                <Text style={[home_styles.txtBlue_title,this.state.warning?{color:colors.white}:{color:colors.main_blue}]}>HỆ THỐNG</Text>
                <Text style={[home_styles.txt_Hethong,this.state.warning?{color:colors.white}:{color:colors.green}]}>
                  {this.state.warning?'CẢNH BÁO':'ỔN ĐỊNH'}</Text>
                </View>
            </View>
            <CustomChart/>
            <View style={home_styles.box2}>
                <View style={[home_styles.item_wrapper]}>
                <Text style={home_styles.item_title}>VAN GAS</Text>
                <Text style={[home_styles.item_status,this.state.warning?{color:colors.red}:{color:colors.main_blue}]}>{ this.state.valve }</Text>
                </View>
                <View style={[home_styles.item_wrapper]}>
                <Text style={home_styles.item_title}>QUẠT</Text>
                <Text style={[home_styles.item_status,this.state.warning?{color:colors.red}:{color:colors.main_blue}]}>{ this.state.fan }</Text>
                </View>
                <View style={home_styles.item_wrapper}>
                <Text style={home_styles.item_title}>MÁY BƠM</Text>
                <Text style={[home_styles.item_status,this.state.warning?{color:colors.red}:{color:colors.main_blue}]}>{ this.state.pump }</Text>
                </View>
            </View>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('History')} style={home_styles.btnHistory}>
                <Text style={home_styles.txt_History}>XEM LỊCH SỬ HOẠT ĐỘNG</Text>
            </TouchableOpacity>
            </View>
            </ScrollView>
        );
    }
};
const DashboardStackNavigator = createStackNavigator(  
    {  
        LoginNavigator: Dashboard
  
    },
    {  
        defaultNavigationOptions: ({ navigation }) => {  
            return {  
                headerLeft: (  
                    <Icon  
                        style={{ paddingLeft: 10 }}  
                        onPress={() => navigation.openDrawer()}  
                        name="md-menu"  
                        size={30}  
                    />  
                )  
            };  
        }  
    }  
      );


const chartConfig={
    backgroundColor: colors.main_blue,
    backgroundGradientFrom: 'rgba(237, 249, 252, 1)',
    backgroundGradientTo: 'rgba(237, 249, 252, 1)',
    color: (opacity = 1) => `rgba(0,87,146, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0,87,146, ${opacity})`,
    fillShadowGradient:colors.main_blue,
    // backgroundGradientFrom: colors.main_blue,
    // backgroundGradientTo: colors.black,
    // color: (opacity = 1) => `rgba(255,255,255, ${opacity})`,
    // labelColor: (opacity = 1) => `rgba(255,255,255, ${opacity})`,
    // fillShadowGradient:colors.white,
    decimalPlaces: 2, // optional, defaults to 2dp
    propsForDots: {
        r: "3",
    },
}

const home_styles = StyleSheet.create({

    connect_view: {
        flexDirection: 'row',
    },

  container: {
    flex: 1,
    flexDirection: "column",
    alignItems:'center',
    //justifyContent:'space-around',
    paddingTop:25,
    backgroundColor:colors.background,
  },
  control_wrapper:{
    flexDirection: "column",
    width:wp('90%'),
    height:118,
    //marginTop: 35,

    borderRadius:10,

    shadowColor: colors.main_blue,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity:1,
    elevation: 5, 
    backgroundColor:colors.white,
  },
  txtBlue_title:{
    fontWeight:'500',
    fontSize:18,
    marginTop:12,
    marginBottom:15,
    marginLeft:15,
    color: colors.main_blue,
  },
  txtWhite_title:{
    fontWeight:'500',
    fontSize:18,
    marginTop:12,
    marginBottom:10,
    marginLeft:15,
    color: colors.white,
  },
  txtWhite_nhietdo:{
    fontWeight:'700',
    fontSize:55,
    alignSelf:'center',
    color: colors.white,
  },
  txt_Hethong:{
    fontWeight:'700',
    fontSize:24,
    alignSelf:'center',
    color: colors.green,
  },
  btnOn:{
    width:wp('40%'),
    height:45,
    backgroundColor:colors.white,
    borderColor:colors.main_blue,
    borderWidth:1,
    borderRadius:50,
    justifyContent:'center'
  },
  btnOff:{
    width:wp('40%'),
    height:45,
    backgroundColor:colors.red,
    borderColor:colors.red,
    borderWidth:1,
    borderRadius:50,
    justifyContent:'center'
  },
  txtOn:{
    fontSize:20,
    fontWeight:'700',
    color:colors.main_blue,
    alignSelf:'center'
  },
  txtOff:{
    fontSize:20,
    fontWeight:'700',
    color:colors.white,
    alignSelf:'center'
  },
  box2:{
    marginTop:25,
    width: wp('90%'), 
    height:190,
    flexDirection: "row", 
    justifyContent: 'space-between'
  },
  temperature_wrapper:{
    flexDirection: "column",
    width:wp('50%'),
    height:146,
    borderRadius:10,
    shadowColor: colors.main_blue,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    elevation: 5, 
    backgroundColor:colors.main_blue,
  },
  status_wrapper:{
    flexDirection: "column",
    width:wp('35%'),
    height:103,

    borderRadius:10,
    shadowColor: colors.main_blue,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    elevation: 5, 
    backgroundColor:colors.white,
  },
  item_wrapper:{
    flexDirection: "column",
    alignItems:'center',
    width:wp('28%'),
    height:115,

    borderRadius:10,
    shadowColor: colors.main_blue,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    elevation: 5, 
    backgroundColor:colors.white,
  },
  item_title:{
    flex:1,
    fontSize:18,
    fontWeight:'400',
    marginTop:8,
    marginBottom:8,
    color:colors.main_blue,
    letterSpacing:2
  },
  item_status:{
    flex:2,
    fontSize:24,
    fontWeight:'700',
    color:colors.main_blue,
    letterSpacing:2
  },
  btnHistory:{
    width: wp('75%'),
    height:50,
    marginTop:-30,
    marginBottom:hp('5%'),
    borderRadius:50,
    shadowColor: colors.main_blue,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    elevation: 5, 
    backgroundColor:colors.main_blue,
    justifyContent:'center',
    alignItems:'center'
  },
  txt_History:{
    fontSize:18,
    fontWeight:'400',
    color:colors.white,
  }
})
export default DashboardStackNavigator;