import React, { Component } from 'react';  
//mport { View, Text, StyleSheet, Button } from 'react-native';  
import {FlatList, Platform, StyleSheet, Text,Alert, View,TouchableOpacity,TextInput,Image,Dimensions,Button, ScrollView} from 'react-native'; 
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import Icon from 'react-native-vector-icons/Ionicons'; 
import colors from '../assets/colors';
import {
  LineChart
} from 'react-native-chart-kit';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {AsyncStorage} from "../node_modules/react-native";

import { LISTENING_SERVER } from '../global/user';

const TEMPERATURE_CHART_GAP = 1

class HistoryDetailComponent extends Component{
    constructor(props) {  
        super(props);  
        
        var dateobj = this.props.navigation.getParam("day", "cant get date");
        var date = new Date(dateobj["timestamp"]);
        // date.setTime( date.getTime() + new Date().getTimezoneOffset()*60*1000 );
        console.log(date.toISOString());

        this.state = {  
            dataSource: {
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
            },
            alarmDataHistory: [],
            token: null,
            today: date,
        };

        const self = this;
        AsyncStorage.getItem('id_token').then(value => {
            self.setState({token: value});
        })

        // this.gettemp(date);
    }

    componentDidMount() {
        this.getTemperatureFromDatabase();
        this.getAlarm();
    }

    static navigationOptions = {  
        title: 'Lịch sử ngày',  
        
    };

    _getFormattedTime(dateTimeObj) {
        let hms = dateTimeObj.toTimeString().split(" ")[0];
        return hms;
    }

    getTemperatureFromDatabase = async () => {
        // TODO
        const self = this;
        self._getTemperatureRequest().then(res => {
            console.log('res: ', res)
            var ret = self._executeTemperatureFormat(res.data);

            self._drawChart(ret.temp, ret.time);

        }).catch((mess) => {
			console.log(mess)
		});
    }
    _getTemperatureRequest = async () => {
        let dt =  this.state.today.getDate();
        if (dt < 10) dt = '0' + dt;
        let m = this.state.today.getMonth() + 1;
        if (m < 10) m = '0' + m;

        var date = `${m}-${dt}-${this.state.today.getFullYear()}`;
        var link = LISTENING_SERVER.dailyData + `?date=${date}`;
        console.log("date links: ", link);

        return fetch(link, {
            method: 'GET',
            headers: new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + this.state.token,
            })
        })
        .then(response => response.json())
		.then((res) => {
			if (res.status == "fail") {
                console.log("Failed to get temperature!");
				console.log(res.message);
                return Promise.reject(new Error("Lấy nhiệt độ từ server thất bại!"));
			} else {
				console.log("success getting temperature");
                return res;
				// this.getdayalarm(res, new Date(2021, 5, 14));
			}
		})
		.catch((mess) => {
			console.log(mess)
		})
    }
    _executeTemperatureFormat = (temps) => {
        const self = this;
        var todaytemp = []
        temps.forEach(elem => {
            let oridate = new Date(elem.time);
            oridate.setTime( oridate.getTime() - new Date().getTimezoneOffset()*60*1000 )
            todaytemp.push({temp: elem.temperature, time:  oridate})
        })

        todaytemp.sort(function (a, b) {
            return a.time.getTime() - b.time.getTime();
        });

        var filtertemp = []
        var filtertime = []

        todaytemp.forEach(item => {
            filtertemp.push(item.temp)
            filtertime.push(item.time.toTimeString().split(" ")[0])
        })

        return {temp: filtertemp, time: filtertime};
    }
    _drawChart = (temperature, timeline) => {

        this.setState({
            dataSource: {
                labels: timeline,
                datasets: [{
                    data: temperature.reverse(), color: (opacity = 1) => `rgba(0,87,146, ${opacity})`,
                },{
                    data: [40,40,40,40,40,40,40,40], color: (opacity = 1) => `rgba(147, 12, 12, ${opacity})`,
                },{
                    data: [Math.max(...temperature) + TEMPERATURE_CHART_GAP], color: (opacity = 0) => `rgba(237,249,252, ${opacity})`
                },{
                    data: [Math.min(...temperature) - TEMPERATURE_CHART_GAP], color: (opacity = 0) => `rgba(237,249,252, ${opacity})`
                }]
            }
        })
    }

    // UNUSED
    gettemp = async (date) => {
        const self = this;
        

        var lb = [];
        var dt = [];

        console.log("before for:")

        for (let i = 0; i < 8; i++) {

            var dateformat = date.toISOString();
            console.log(dateformat);
            console.log(`https://io.adafruit.com/api/v2/${user_name}/feeds/${feed}/data?start_time=${dateformat}&limit=1`);

            await fetch(`https://io.adafruit.com/api/v2/${user_name}/feeds/${feed}/data?start_time=${dateformat}&limit=1`, {
                method: 'GET',
                headers: {
                    'X-AIO-Key': iokey
                }
            })
            .then(response => response.json())
            .then(function(response) {
                console.log("response:");
                console.log(response);
    
                //---------------------------
            
                let d = new Date(response[0]["created_at"]);
                lb.push(d.getHours() + ":00");
                dt.push(parseInt(JSON.parse(response[0]["value"])["data"]));

                date.setHours(date.getHours() + 3);
            })
            .catch(function (err) {
                console.log("Error!");
                console.log(err);
            })


        }

        console.log(lb);
        console.log(dt);

        self.setState({
            dataSource: {
                labels: lb,
                datasets: [{
                    data: dt
                }]
            }
        })

    }

    _getAlarmRequest = async () => {
        return fetch(LISTENING_SERVER.historyAPI, { 
            method: 'GET',
            headers: new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + this.state.token,
				// 'Authorization': this.state.token,
            }),
        })
		.then(response => response.json())
		.then((res) => {
			if (res.status == "fail") {
                console.log("Failed to get history!");
				console.log(res.message);
                return Promise.reject(new Error("Lấy báo động từ server thất bại!"));
			} else {
				console.log("success getting alarms");
                return res;
				// this.getdayalarm(res, new Date(2021, 5, 14));
			}
		})
		.catch((mess) => {
			console.log(mess)
		})
    }
    getAlarm = async () => {
        const self = this;

        self._getAlarmRequest().then(alarmList => {

            var AlarmThisDay = [];
            // var alarmcount = 1;

            alarmList.reverse().forEach(element => {
                let historyTime = new Date(element.timestamp);

                // Check if alarm is on the right day
                if (historyTime.toDateString() === self.state.today.toDateString()) {
                    console.log("Alarm this day: ", historyTime.toString());
                    // AlarmThisDay.push({key: `Báo động ${alarmcount}: ` + self._getFormattedTime(historyTime)});
                    AlarmThisDay.push({key: historyTime});
                    // alarmcount += 1;
                }
            });

            AlarmThisDay.sort(function (a, b) {
                return a.key.getTime() - b.key.getTime();
            });

            var AlarmFormatted = []
            AlarmThisDay.forEach(elem => {
                AlarmFormatted.push({key: self._getFormattedTime(elem.key)})
            })

            self.setState({alarmDataHistory: AlarmFormatted})
        })
        .catch(error => {
            Alert.alert("Thông báo", error);
        })
    }

    render(){
        var time = this.props.navigation.getParam("day", "cant get date");

        return (
          <View style={styles.container}>
            <ScrollView>
            
                <View style={styles.date_wrapper}>
                    <View style={styles.item_wrapper}>
                    <Text style={styles.item_title}>Day</Text>
                    <Text style={styles.item_status}>{ time.day}</Text>
                    </View>
                    <View style={styles.item_wrapper}>
                    <Text style={styles.item_title}>Month</Text>
                    <Text style={styles.item_status}>{ time.month }</Text>
                    </View>
                    <View style={styles.item_wrapper}>
                    <Text style={styles.item_title}>Year</Text>
                    <Text style={styles.item_status}>{ time.year }</Text>
                    </View>
                </View>
                <Text style={styles.title}>NHIỆT ĐỘ</Text>
                {/* <CustomChart/> */}
                <View>
                    <LineChart
                        //segments={5}
                         verticalLabelRotation={55}
                        data={this.state.dataSource}
                        width={wp('104%')} // from react-native
                        height={hp('30%')}
                        chartConfig={chartConfig}
                        //fromZero
                        bezier
                        //maxValue={45}
                        style={{alignSelf:"center", marginTop:15, paddingBottom:25, marginBottom:-35}}
                    />
                </View>
                <Text style={styles.title}>BÁO ĐỘNG</Text>
                <View>
                    <FlatList
                    data = {this.state.alarmDataHistory}
                    // data={[
                    //     {key: 'time1'},
                    //     {key: 'time2'},
                    //     {key: 'time3'},
                    //     {key: 'time4'},
                    //     {key: 'time5'},
                    // ]}
                    renderItem={({item}) => <Text style={styles.txtLst}>{item.key}</Text>}
                    />
                </View>
                {/* <TouchableOpacity onPress={ () => this.props.navigation.goBack() } style={styles.btnHistory}>
                    <Text style={styles.txt_History}>Quay Lại</Text>
                </TouchableOpacity> */}
            
            
            </ScrollView>
            </View>
        );}
};

const chartConfig={
    backgroundColor: colors.main_blue,
    backgroundGradientFrom: 'rgba(255, 255, 255, 1)',
    backgroundGradientTo: 'rgba(255, 255, 255, 1)',
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

const styles = StyleSheet.create({
  
    container: {
        flex: 1,
        flexDirection: "column",
        //alignItems:'center',
        justifyContent:'space-around',
        paddingTop:25,
        backgroundColor:colors.white,
    },
    title:{
        fontSize:25,
        fontWeight:'600',
        color:colors.main_blue,
        marginTop: wp('5%'),
        marginLeft:wp('7%'),
        letterSpacing:1.5,
        textDecorationLine:'underline'
    },
    date_wrapper:{
        flex:1,
        flexDirection:"row",
        width: wp('90%'),
        alignSelf:'center',
        justifyContent: 'space-around'
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
        backgroundColor:colors.background ,
    },
    item_wrapper:{
        flexDirection: "column",
        alignItems:'center',
        width:wp('25%'),
        height:wp('25%'),

        borderRadius:10,
        shadowColor: colors.main_blue,
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 1,
        elevation: 2, 
        backgroundColor:colors.main_blue,
    },
    item_title:{
        flex:1,
        fontSize:20,
        fontWeight:'500',
        marginTop:8,
        marginBottom:8,
        color:colors.white,
        letterSpacing:2
    },
    item_status:{
        flex:2,
        fontSize:32,
        fontWeight:'700',
        color:colors.white,
        letterSpacing:2
    },
    txtLst:{
        fontSize:22,
        fontWeight:'600',
        marginTop:5,
        color:colors.red,
        letterSpacing:2,
        marginLeft:wp('55%'),
    },
    btnHistory:{
        flex:1,
        width: wp('30%'),
        height:50,
        marginTop:wp('5%'),
        marginBottom:wp('5%'),
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
        alignItems:'center',
        alignSelf:'center',
    },
    txt_History:{
        fontSize:18,
        fontWeight:'400',
        color:colors.white,
    }
});
export default HistoryDetailComponent;