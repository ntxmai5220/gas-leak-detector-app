import React, { Component } from 'react';  
//mport { View, Text, StyleSheet, Button } from 'react-native';  
import colors from '../assets/colors'
import {
  ToastAndroid,
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  Button,
  ImageBackground,
  AsyncStorage
} from '../node_modules/react-native'; 
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import { LISTENING_SERVER } from '../global/user';

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
    width: wp('87%'),
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
    width: wp('50%'),
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
    letterSpacing:1.2,
    textTransform:'uppercase',
    textAlign: 'center',
    padding:10,
  },
  txtReg:{
    fontSize:16,
    color:colors.main_blue,
    position:'relative',
    top:hp('2%'),
    alignSelf: 'center',
    alignItems: "center",
  }, 
});
var STORAGE_KEY = 'id_token';
const showToastWithGravityAndOffset = (message,x,y) => {
    ToastAndroid.showWithGravityAndOffset(
        message,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
        x,
        y);
    };
class Login extends Component {  
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
    _onSubmit=()=>{
        //Alert.alert("Thông báo!","Bạn đã đăng nhập thành công!");
        //console.log(this.state.password)
        // const loginlink = 'http://192.168.43.123:3000/login';
        const loginlink = LISTENING_SERVER.loginAPI;
        return fetch(loginlink, { 
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email:this.state.email,
                password: this.state.password,
            })
        })
        .then((response) => response.json())
        .then((responseJson) => {
            console.warn(responseJson);
            if (responseJson.status=="success"){
                console.warn(responseJson);
                showToastWithGravityAndOffset('Hi, '+ responseJson.data.name +"\nBạn đã đăng nhập thành công!", 0, -100);
                this._onValueChange(STORAGE_KEY,responseJson.token);
                this._onValueChange("fullname",responseJson.data.name)
                this._onValueChange("email",responseJson.data.email)
                this._retrieveData(STORAGE_KEY);
                console.log(responseJson.data.name);
                this.props.navigation.navigate('Dashboard')
            }
            else{
                // console.warn(responseJson);
                showToastWithGravityAndOffset(responseJson.message, 0, -100);
                //Alert.alert("Thông báo!",responseJson.message);
            }
        })
        .catch((error) =>{
            console.error(error);
        });
    }
    async _onValueChange(item, selectedValue) {
        try {
            await AsyncStorage.setItem(item, selectedValue);
          
        } catch (error) {
            console.log('AsyncStorage error: ' + error.message);
        }
    }
    _retrieveData = async (topic) => {
        try {
            const value = await AsyncStorage.getItem(topic);
            if (value !== null) {
                // We have data!!
                console.log(value);
            }
        } catch (error) {
            // Error retrieving data
        }
    };
    render() {  
        return ( 
            // <View style={styless.container}>
            <ImageBackground source={require('../assets/login-background.png')} style={styless.image}>
                <View style={styless.container,{flex:1}}>
                    <View style={{flex:1, alignItems:'center'}}></View>
                    <Image source={require('../assets/logo1.png')} style={{flex:2, alignSelf:'center'}}/>
                    <View style={{flex:2, alignItems:'center'}}></View>

                    <View style={{flex:4, alignItems: 'center'}}>
                        <Text style={{fontSize:15, color:colors.main_blue, marginTop:30, alignSelf:'center'}}>Điền thông tin để đăng nhập</Text>
                        <TextInput placeholder="Email"
                            placeholderTextColor={colors.main_blue}
                            underlineColorAndroid="transparent"
                            style={styless.txtInput}  onChangeText={(email) => this.setState({email:email})}
                        />
                        <TextInput placeholder="Mật khẩu"
                            placeholderTextColor={colors.main_blue}
                            underlineColorAndroid="transparent"
                            secureTextEntry={true}
                            style={styless.txtInput}  onChangeText={(password) => this.setState({password:password})}
                        />
                        {/* <TouchableOpacity onPress={this._onSubmit} style={styless.btnLogin}>
                            <Text style={styless.txtLogin}>Login</Text>
                        </TouchableOpacity> */}
                        <TouchableOpacity onPress={this._onSubmit} style={styless.btnLogin}>
                        {/* ()=>{this.props.navigation.navigate('Profile')} */}
                            <Text style={styless.txtLogin}>Đăng nhập</Text>
                        </TouchableOpacity>
                        {/* <Text style={{flex:1}} onPress={() => this.props.navigation.navigate('Dashboard')}>Dashboard</Text> */}
                        <Text style={{flex:1},styless.txtReg} onPress={() => this.props.navigation.navigate('Registration')}>Đăng ký</Text>
                    </View>
                    {/* <Button title="Go to Home"/> */}
                    {/* <HomeScreen /> */}
                    
                </View>
            </ImageBackground>
            // </View>
        );  
    }
}

const LoginComponent = createStackNavigator({  
    Login: Login 
});
export default LoginComponent;