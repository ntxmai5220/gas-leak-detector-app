import React, { Component, useState} from 'react';  
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

import { LISTENING_SERVER, getAdafruitFetch } from '../global/user';

import {AsyncStorage} from "../node_modules/react-native";
import * as Notifications from 'expo-notifications';

import io from 'socket.io-client';



const TEMPERATURE_CHART_GAP = 1;
const TEMP_CAP = 40;


class Dashboard extends Component{
    static navigationOptions = ({ navigation }) => {  
        return {  
            title: 'Trang chủ',
            headerLeft: (  
                <Icon  
                    style={{ paddingLeft: 10 }}  
                    onPress={() => navigation.openDrawer()}  
                    name="md-menu"  
                    size={30}  
                />  
            )  
        };   
    };
    constructor(props) {
        super(props);
        this.state = {
            token : null,
            socket: null,
            valve : 'MỞ',
            fan: 'TẮT',
            pump: 'TẮT',
            temp: '0',
            warning: false,
            data: {
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
                },{data: [25]},{data:[45]}]
            }

        }

    }

    // set states of inner relay dependencies
    _setInnerRelay = (relay) => {
        console.log("Relay set to: ", relay)
        if (relay) {
            this.setState({valve: 'ĐÓNG', fan: 'BẬT', pump: 'BẬT'});
        } else {
            this.setState({valve: 'MỞ', fan: 'TẮT', pump: 'TẮT'});
        }
    }

    // set state of alarm
    _setAlarmState = (st) => {
        this.setState({warning: st});
    }

    // get api state of alarm
    _getStateApi = async () => {
        await this._stateFetch();
    }
    _stateFetch = () => {
        const self = this;
        return fetch(LISTENING_SERVER.stateGet, {
            method: 'GET',
        })
        .then(response =>  {
            // console.log("response _stateFetch: ", response.text())
            return response.json();
        })
        .then(res => {
            console.log("Alarm state api: ", res.state)
            self._setAlarmState(res.state == "on")
        })
        .catch(err => {
            console.log("Error _stateFetch: ", err)
        })
    }
    

    // mounting -------------------------------------------------------------------------------
    componentDidMount() {
        const self = this;

        // connect socket
        const socket = io(LISTENING_SERVER.sockethost);
        self.setState({socket: socket});
        
        socket.on("connect", () => {console.log("socket io connected!")});
        socket.on("tempHumid", obj => {
            console.log("temp humid data: ", obj.data);
            let t = obj.data.split('-')[0];
            
            self.setState({temp: t});
            
            // update chart
            self._realtimeChartUpdate(parseInt(t));
            
            if (t > TEMP_CAP) self.schedulePushNotification("Cảm biến nhiệt " + t +"*C");
		});
		socket.on("gas", obj => {
            let datavalue = obj.data;
            console.log("gas: ", datavalue)

            if (datavalue == 1) self.schedulePushNotification("Cảm biến nồng độ gas vượt ngưỡng");
		});
		socket.on("alarm", obj => {
            console.log("alarm: ", obj);
            if (obj.gasOverThreshold || obj.temperature > TEMP_CAP) {
                // self.setState({warning: true});
                self._getStateApi();
            }
            
		});
		socket.on("relay", obj => {
            console.log("relay socket data: ", obj.data);
            self._setInnerRelay(obj.data == '1');
		});
        socket.on("state", obj => {
            console.log("state connected! data: ", obj);
        });
		socket.on("lastest", obj => {
            console.log("latest data of socket: ", obj);
            self._setInnerRelay(obj.relay == '1')
            // self.setState({temp: obj.temperatureData});
            self._initTemp(obj.temperatureData);
		});
        
        // get init data
        self.getInitData();
    }
    componentWillUnmount() {
        console.log("removing listeners...");
        this.state.socket.removeAllListeners("tempHumid");
        this.state.socket.removeAllListeners("gas");
        this.state.socket.removeAllListeners("alarm");
        this.state.socket.removeAllListeners("relay");
        this.state.socket.removeAllListeners("state");
        this.state.socket.removeAllListeners("lastest");
        console.log("removing listeners complete!");
    }

    _initTemp = (jsonobj) => {
        const self = this;
        // get first data
        let t = jsonobj[0].temperature;
        self.setState({temp: t});

        // get 8 data for chart
        var lb = [];
        var dt = [];

        var count = 0;
    
        jsonobj.forEach(elem => {
            count += 1;
            if (true) {
                let d = new Date(elem["time"]);
                lb.push(d.toTimeString().split(" ")[0]);
                dt.push(elem.temperature);
            }
    
        });

        self.setState({
            data: {
                labels: lb.reverse(),
                datasets: [{
                    data: dt.reverse(), color: (opacity = 1) => `rgba(0,87,146, ${opacity})`,
                },{
                    data: [Math.max(...dt) + TEMPERATURE_CHART_GAP], color: (opacity = 0) => `rgba(237,249,252, ${opacity})`
                },{
                    data: [Math.min(...dt) - TEMPERATURE_CHART_GAP], color: (opacity = 0) => `rgba(237,249,252, ${opacity})`
                }]
            }
        })

        console.log("Success getting init temp!");
    }


    // get init data of state
    getInitData = () => {
        const self = this;

        // get init state
        self._getStateApi();

        // get init temperature
        // getAdafruitFetch('temp', 8).then(jsonobj => {
        //     console.log("temp data: ", jsonobj);
        //     // // get first data
        //     // let t = JSON.parse(jsonobj[0].value).data.split('-')[0];
        //     // self.setState({temp: t});

        //     // get 8 data for chart
        //     var lb = [];
        //     var dt = [];

        //     var count = 0;
        
        //     jsonobj.forEach(elem => {
        //         count += 1;
        //         if (true) {
        //             let d = new Date(elem["created_at"]);
        //             lb.push(d.toTimeString().split(" ")[0]);
        //             dt.push(parseInt(JSON.parse(elem["value"])["data"]));
        //         }
        
        //     });

        //     self.setState({
        //         data: {
        //             labels: lb.reverse(),
        //             datasets: [{
        //                 data: dt.reverse(), color: (opacity = 1) => `rgba(0,87,146, ${opacity})`,
        //             },{
        //                 data: [Math.max(...dt) + TEMPERATURE_CHART_GAP], color: (opacity = 0) => `rgba(237,249,252, ${opacity})`
        //             },{
        //                 data: [Math.min(...dt) - TEMPERATURE_CHART_GAP], color: (opacity = 0) => `rgba(237,249,252, ${opacity})`
        //             }]
        //         }
        //     })

        //     console.log("Success getting init temp!");

        // })
        // .catch(err => {
        //     console.warn(err);
        // })
        
        // console.log("Get init data successfully!");


        // get init relay
        // getAdafruitFetch('relay', 1).then(jsonobj => {
        //     console.log("relay data: ", jsonobj);
        //     // get first data
        //     let d = JSON.parse(jsonobj[0].value).data;
        //     self._setInnerRelay(d == '1');

        //     console.log("Success getting init relay!");

        // })
        // .catch(err => {
        //     console.warn(err);
        // })

        
    }

    // // main object update (NOT USED)
    // updateObjects = (destinationName, data) => {
    //     Subscribe_Topics.forEach(({ name, thing, feed }) => {
    //         if (name == destinationName) {
    //             this.subscriberHandler(thing, data);
    //         }
    //     });
    // }
    // subscriberHandler = (subscribeObject, data) => {
    //     const self = this;

    //     // relay subscriber
    //     // ------------------------------------------------------------------------------
    //     if (subscribeObject == 'relay') {
    //         self._setInnerRelay(data == '1');
    //     }

    //     // temp subscriber
    //     // ------------------------------------------------------------------------------
    //     if (subscribeObject == 'temp') {
    //         let t = data.split('-')[0];

    //         // update temp number
    //         self.setState({temp: t});

    //         // update chart
    //         self._realtimeChartUpdate(parseInt(t));

    //         // WARNING HANDLE:
    //         // TURN ON IF TEMP IS OVER TEMP_CAP
    //         // TURN OFF MANUALLY, TEMP DOESNT AFFECT ALARM STATE. 
    //         if (parseFloat(t) > TEMP_CAP) {
    //             self._turnOnHandler();
    //             self.setState({warning: true});
    //             self.schedulePushNotification("Cảm biến nhiệt " + t +"*C");
    //         } else {
    //             // self.setState({ warning: false});
    //             // self.turnOffHandler();
    //         }
    //     }

    //     // gas subscriber
    //     // -------------------------------------------------------------------------------
    //     if (subscribeObject == 'gas') {
    //         if (data == '1') {
    //             // self.turnOnHandler();
    //             self.setState({warning: true});
    //             self.schedulePushNotification("Cảm biến nồng độ gas vượt ngưỡng");
    //         } else {
    //             // self.turnOffHandler();
    //         }
    //     }
    // }



    _realtimeChartUpdate = (temp) => {
        let dt = this.state.data.datasets[0].data;
        let lb = this.state.data.labels;
        
        dt = dt.slice(1);
        dt.push(temp);
        
        const thistime = new Date();
        console.log(thistime.toTimeString())

        lb = lb.slice(1);
        lb.push(thistime.toTimeString().split(" ")[0]);

        
        this.setState({
            data: {
                labels: lb,
                datasets: [{
                    data: dt, color: (opacity = 1) => `rgba(0,87,146, ${opacity})`,
                },{
                    data: [Math.max(...dt) + TEMPERATURE_CHART_GAP], color: (opacity = 0) => `rgba(237,249,252, ${opacity})`
                },{
                    data: [Math.min(...dt) - TEMPERATURE_CHART_GAP], color: (opacity = 0) => `rgba(237,249,252, ${opacity})`
                }]
            }

        })
    }

    // // not used!
    // getInitChartData = () => {

    //     const self = this;

    //     fetch(`https://io.adafruit.com/api/v2/${user_name}/feeds/${feed}/data?limit=${data_limit}`, {
    //         method: 'GET',
    //         headers: {
    //             'X-AIO-Key': iokey
    //         }
    //     })
    //     .then(response => response.json())
    //     .then(function(response) {
    //         console.log("response:");
    //         console.log(response);

    //         //---------------------------
    //         var lb = [];
    //         var dt = [];

    //         var count = 0;
        
    //         response.forEach(elem => {
    //             count += 1;
    //             if (count % distance == 1) {
    //                 let d = new Date(elem["created_at"]);
    //                 lb.push(d.toTimeString());
    //                 dt.push(parseInt(JSON.parse(elem["value"])["data"]));
    //             }
        
    //         });
        
    //         console.log(lb);
    //         console.log(dt);
        
    //         // data.labels = lb;
    //         // data.datasets[0]["data"] = dt;
    //         self.setState({
    //             data: {
    //                 labels: lb,
    //                 datasets: [{
    //                     data: dt
    //                 }]
    //             }
    //         })
            
    //         // console.log(response["data"]["columns"])
    //         // console.log(response["data"]["data"])
    //     })
    //     .catch(function (err) {
    //         console.log("Error!");
    //         console.log(err);
    //     })
    // }

    // -----------------------------------------------------------------------------------
    // SCHEDULE
    schedulePushNotification(mess) {
        Notifications.scheduleNotificationAsync({
            content: {
            title: "HỆ THỐNG BÁO ĐỘNG được kích hoạt !!",
            body: mess,
            },
            trigger: { seconds: 1 },
        });
    }

    // -----------------------------------------------------------------------------------
    // ON OFF ALARM CALLS
    turnOnHandlerButton = () => {
        const self = this;

        if (self.state.warning) return;

        Alert.alert(
            "Bật báo động","Bạn có thực sự muốn bật báo động không?",[{
                text: "Không!",
                onPress: () => {console.log('Cancel alarm!');},
                style: "cancel"
            }, {
                text: "Bật ngay!",
                onPress: async () => {await self._turnOnHandler();},
                style: "destructive"
        }]);
    }
    turnOffHandlerButton = () => {
        const self = this;

        if (!self.state.warning) return;

        Alert.alert(
            "Tắt báo động","Bạn có thực sự muốn tắt báo động không?",[{
                text: "Không!",
                onPress: () => {console.log('Cancel turn off alarm!');},
                style: "cancel"
            }, {
                text: "Tắt báo động!",
                onPress: async () => {await self._turnOffHandler();},
                style: "destructive"
        }]);
    }

    // call server to turn on alarm
    _turnOnHandler = async () => {
        // Topics.forEach(({ name, jsonobj, on }) => {
        //     this.mqtt.send(name, JSON.stringify(jsonobj(on)));
        // });
        const self = this;

        if (this.state.token == null) {
            this.setState({token: await AsyncStorage.getItem('id_token').then(value => value)});
        }

        console.log("Turning on alarm");

        
        return fetch(LISTENING_SERVER.turnOnAlarm, { 
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: this.state.token,
                gas:1,
                temperature:this.state.temp
            })
        })
        .then((response) => response.json())
        .then((responseJson) => {
            // this.setState({checkReg:responseJson.success});
            if (responseJson.status=="success"){
                console.log("turn on json: ", responseJson);
                Alert.alert("Thông báo!","Báo động đã được bật!");
                // self.setState({warning: true});
                self._getStateApi();
            }
            else{
                console.warn(responseJson);
                Alert.alert("Thông báo!!!",responseJson.message);
                self._getStateApi();
            }
        })
        .catch((error) =>{
            console.log("error _turnOnHandler:");
            console.error(error);
        });
    }
    // call server to turn off alarm
    _turnOffHandler = async () => {
        // Topics.forEach(({ name, jsonobj, off }) => {
        //     this.mqtt.send(name, JSON.stringify(jsonobj(off)));
        // });
        const self = this;

        if (this.state.token == null) {
            this.setState({token: await AsyncStorage.getItem('id_token').then(value => value)});
        }
        
        console.log("Turning off alarm");

        
        return fetch(LISTENING_SERVER.turnOffAlarm, { 
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: this.state.token,
            })
        })
        .then((response) => response.json())
        .then((responseJson) => {
            // this.setState({checkReg:responseJson.success});
            if (responseJson.status=="success"){
                console.log("turn off json: ",responseJson);
                Alert.alert("Thông báo!","Báo động đã tắt!");
                // self.setState({warning: false});
                self._getStateApi();
            }
            else{
                console.warn(responseJson);
                Alert.alert("Thông báo!!!",responseJson.message);
                self._getStateApi();
            }
        })
        .catch((error) =>{
            console.log("error _turnOffHandler:");
            console.error(error);
        });
    }
    // -----------------------------------------------------------------------------------

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
                <TouchableOpacity onPress={this.turnOnHandlerButton} style={home_styles.btnOn}>
                    <Text style={home_styles.txtOn}>BẬT</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.turnOffHandlerButton} style={home_styles.btnOff}>
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
            {/* <CustomChart/> */}
            <View>
                <LineChart
                    //segments={5}
                    verticalLabelRotation={55}
                    data={this.state.data}
                    width={wp('104%')} // from react-native
                    height={hp('30%')}
                    chartConfig={chartConfig}
                    //fromZero
                    bezier
                    //maxValue={45}
                    style={{alignSelf:"center", marginTop:-10, paddingBottom:20, marginBottom:-25}}
                    //formatYLabel={() => yLabelIterator.next().value}
                />
            </View>
            <View style={[home_styles.box2, {marginBottom:-55}]}>
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
            </View>
            </ScrollView>
        );
    }
};


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
    paddingTop:20,
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
})
const DashboardComponent = createStackNavigator(  
    {  
        Dashboard: Dashboard,
    }
);
export default DashboardComponent;