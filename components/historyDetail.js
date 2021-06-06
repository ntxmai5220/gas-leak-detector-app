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
/*
  TODO:
  1.  Viết hàm get nhiệt theo 3 giờ 1 lần cho chart như mẫu,
  2.  Viết hàm get nhiệt độ realtime,
  3.  Viết hàm get trạng thái các thiết bị,
  4.  Viết hàm báo động.
  5.  Viết hàm get trạng thái hệ thống đang báo động hay ổn định,
  6.  Viết hàm cho button Bật/tắt báo động, gửi tín hiệu về cho server điều khiển thiết bị
 */

const iokey = 'aio_CraM232LDztkYUG2RxHySDg7ZUTr';
const user_name = 'CSE_BBC';
const feed = 'bk-iot-temp-humid';


// const data = {
//     labels: ['1:00', '4:00', '7:00', '10:00', '13:00', '16:00', '19:00', '22:00', //'17:00', '19:00'
//     // , '13:00', '15:00', '17:00'
//     ],
//         datasets: [{
//           data: [
//             29.0,
//             24.3,
//             26.0,
//             28.1,
//             32.0,
//             33.4,
//             35.0,
//             // 35.5,
//             // 34.0,
//             10,
//             // 30.0,
//           ]
//         }]
// }
// //chart
// const CustomChart = () => {
//     return(
//         <View>
        
//         <LineChart
//         //segments={5}
//         data={data}
//         width={wp('105%')} // from react-native
//         height={240}
//         chartConfig={chartConfig}
//         //fromZero
//         bezier
//         //maxValue={45}
//         style={{alignSelf:"center", marginTop:20}}
//         //formatYLabel={() => yLabelIterator.next().value}
//         />
//         </View>
//     );
// };
    
// FlatListBasics = () => {
//   return (
    
//   );
// }
class HistoryDetailComponent extends Component{
    constructor(props) {  
        super(props);  
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

        };

        var dateobj = this.props.navigation.getParam("day", "cant get date");
        var date = new Date(dateobj["timestamp"]);
        date.setTime( date.getTime() + new Date().getTimezoneOffset()*60*1000 );
        console.log(date.toISOString());

        this.gettemp(date);
    }

    static navigationOptions = {  
        title: 'Lịch sử ngày',  
        
    };

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
                        data={this.state.dataSource}
                        width={wp('105%')} // from react-native
                        height={240}
                        chartConfig={chartConfig}
                        //fromZero
                        bezier
                        //maxValue={45}
                        style={{alignSelf:"center", marginTop:20}}
                        //formatYLabel={() => yLabelIterator.next().value}
                    />
                </View>
                <Text style={styles.title}>BÁO ĐỘNG</Text>
                <View>
                    <FlatList
                    data={[
                        {key: 'time1'},
                        {key: 'time2'},
                        {key: 'time3'},
                        {key: 'time4'},
                        {key: 'time5'},
                    ]}
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