import React, { Component } from 'react';  
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


class HistoryDetail extends Component{
    static navigationOptions = {  
        title: 'History Detail',  
        
    };
    render(){
        var time = this.props.navigation.getParam("day", "cant get date");

        return (
            <ScrollView>
                <Text> Today is { time.day } - { time.month }</Text>
                <View style={home_styles.container}>
                    <CustomChart/>

                    <TouchableOpacity onPress={ () => this.props.navigation.goBack() } style={home_styles.btnHistory}>
                        <Text style={home_styles.txt_History}>Quay Lại</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );}
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
export default HistoryDetail;