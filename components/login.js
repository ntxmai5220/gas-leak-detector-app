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
  ImageBackground
} from 'react-native'; 
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer'
class ViewLogin extends Component{
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
    return fetch('http://10.0.137.109:8888/user/login', { 
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
        this.setState({checkLogin:responseJson.success});
        if(this.state.checkLogin>0){
            console.warn(responseJson);
            Alert.alert("Thông báo!","Bạn đã đăng nhập thành công!");
        }
        else{
           // console.warn(responseJson);
            Alert.alert("Thông báo!","Bạn đã đăng nhập không thành công!");
        }
    })
    .catch((error) =>{
        console.error(error);
    });
  }

  render() {
    return (
      <View style={styless.container}>
        <View style={{flex:1, alignItems:'center'}}></View>
        <Image source={require('../assets/logo1.png')} style={{flex:2, alignSelf:'center'}}/>
        <View style={{flex:2, alignItems:'center'}}></View>

        <View style={{flex:4, alignItems: 'center'}}>
          <Text style={{fontSize:15, color:colors.main_blue, marginTop:30, alignSelf:'center'}}>Enter your username and password</Text>
          <TextInput placeholder="Username"
              placeholderTextColor={colors.main_blue}
              underlineColorAndroid="transparent"
              style={styless.txtInput}  onChangeText={(username) => this.setState({username:username})}/>
          <TextInput placeholder="Password"
              placeholderTextColor={colors.main_blue}
              underlineColorAndroid="transparent"
              secureTextEntry={true}
              style={styless.txtInput}  onChangeText={(password) => this.setState({password:password})}/>
          <TouchableOpacity onPress={this._onSubmit} style={styless.btnLogin}>
              <Text style={styless.txtLogin}>Login</Text>
          </TouchableOpacity>
         
        </View>
        {/* <Button title="Go to Home"/> */}
        {/* <HomeScreen /> */}
        
      </View>
    );
  }
}
const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
const styless = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column"
  },
  image: {
    flex: 1,
    flexDirection: "column",
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: 'center',
  },
  title:{
    fontSize:30,
    color:'red',
     textAlign: 'center',
  },
  txtInput:{
    backgroundColor: colors.white,
    width: DEVICE_WIDTH - 60,
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
    marginTop:10,
    marginBottom:10,
    paddingLeft:20,
    paddingRight:20
  },
  btnLogin:{
    width: 182,
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
    marginTop:30,
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
    top:DEVICE_HEIGHT - 50
  }, 
});
class Login extends Component {  
    static navigationOptions = {  
         title: '',  
         headerShown:false,
    };  
    render() {  
        return ( 
          // <View style={styless.container}>
            <ImageBackground source={require('../assets/login-background.png')} style={styless.image}>
              <ViewLogin style={{flex:1}}></ViewLogin> 
              <Text style={{flex:1},styless.txtReg} onPress={() => this.props.navigation.navigate('Registration')}>Registration</Text>
            </ImageBackground>
          // </View>
          );  
    }
}  
const LoginStackNavigator = createStackNavigator(  
    {  
        LoginNavigator: Login 
    }  );
export default LoginStackNavigator;