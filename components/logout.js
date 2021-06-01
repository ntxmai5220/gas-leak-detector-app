import React, { Component } from 'react';  
//mport { View, Text, StyleSheet, Button } from 'react-native';  
import colors from '../assets/colors'
import {
  Platform,
  StyleSheet,
  Text,
  Alert,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
  Button,
  ImageBackground,AsyncStorage
} from '../node_modules/react-native'; 
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
const styless = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column"
  },
  image: {
    flex: 1,
    width:wp('100%'),
    flexDirection: "column",
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: 'center',
    alignSelf:'center',
  },
  txtInput:{
    backgroundColor: colors.white,
    width: wp('90%'),
    height: 50,

    borderRadius:30,
    borderWidth:0.3,

    borderColor: colors.main_blue,
    shadowColor: colors.main_blue,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 5, 

    alignSelf:'center',
    color: colors.main_blue,
    marginTop:hp('2%'),
    marginBottom:hp('1%'),
    paddingLeft:hp('3%'),
    paddingRight:hp('2%'),
  },
  btnLogin:{
    width: wp('40%'),
    height:50,
    backgroundColor:colors.main_blue,
    borderRadius:30,

    shadowColor: colors.main_blue,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.9,
    shadowRadius: 1,
    elevation: 5, 
    alignSelf: 'center',
    alignItems: "center",
    marginTop:hp('4%'),
  },
  txtLogin:{
    color:'#fff',
    fontWeight:'700',
    fontSize:20,
    letterSpacing:1.5,
    textTransform:'uppercase',
    textAlign: 'center',
    padding:10,
  },
  txtReg:{
    fontSize:16,
    color:colors.main_blue,
    position:'absolute',
    bottom:hp('5%'),
    alignSelf: 'center',
    alignItems: "center",
  }, 
});

var STORAGE_KEY = 'id_token';

class Logout extends Component {  
    static navigationOptions = {  
        title: '',  
        headerShown:false,
    };  
    constructor(props){
      super(props);
      this.state={
        username:"",
        password:"",
        checkLogin:0
      }
    }
    _onSubmit= async ()=>{
        const logoutlink = 'https://mysterious-reaches-12750.herokuapp.com/api/users/logout';
        let t = await AsyncStorage.getItem(STORAGE_KEY).then(value => value);
        return fetch(logoutlink, { 
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: t
            }),
        })
        .then((response) => response.json())
        .then((responseJson) => {
            console.warn(responseJson);
            if (responseJson.status=="success"){
                console.warn(responseJson);
                Alert.alert("Thông báo!","Bạn đã đăng xuất thành công!");
                
                console.log(responseJson.message);
            }
            else{
                // console.warn(responseJson);
                Alert.alert("Đăng xuất thất bại!",responseJson.message);
            }
            this.props.navigation.navigate('Login');
        })
        .catch((error) =>{
            console.error(error);
        });
    }

    render() {  
        return ( 
            <View style={styless.container}>
                <Text style={{fontSize:15, color:colors.main_blue, marginTop:30, alignSelf:'center'}}>Logout?</Text>
                <TouchableOpacity onPress={this._onSubmit} style={styless.btnLogin}>
                    <Text style={styless.txtLogin}>Logout</Text>
                </TouchableOpacity>
            </View>
            
        );  
    }
}

const LogoutStackNavigator = createStackNavigator({  
    LogoutNavigator: Logout
});
export default LogoutStackNavigator;