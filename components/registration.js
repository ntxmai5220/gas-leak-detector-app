import React, { Component } from 'react';  
//mport { View, Text, StyleSheet, Button } from 'react-native';  
import {Platform, StyleSheet, Text,Alert, View,TouchableOpacity,TextInput,Image,Dimensions,Button,ScrollView,ImageBackground} from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
//import { useFonts } from 'expo-font';
import colors from '../assets/colors'
class Registration extends Component{
    static navigationOptions = {  
        title: '',
        headerShown:false  
   };
   
  constructor(props){
    super(props);
    this.state={
      username:"",
      password:"",
      email:"",
      fullname:"",
      checkReg:0
    }
  };
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
        this.setState({checkReg:responseJson.success});
        if(this.state.checkReg>0){
            console.warn(responseJson);
            Alert.alert("Thông báo!","Bạn đã đăng nhập thành công!");
            this.props.navigation.navigate('Login');
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
      <ImageBackground source={require('../assets/brReg.jpg')} style={styless.image}>
         
      <View style={styless.container}>
      <Image source={require('../assets/logo1.png')} style={{flex:2, alignSelf:'center'}}/>
      <View style ={{flex:4}}>
        <Text style={{fontSize:20,color:'white',fontWeight: "bold"}}>Information for your account</Text>
        <TextInput placeholder="Full name"
           placeholderTextColor={colors.main_blue}
           underlineColorAndroid="transparent"
           style={styless.txtInput}  onChangeText={(fullname) => this.setState({fullname:fullname})}/>
        <TextInput placeholder="Username"
           placeholderTextColor={colors.main_blue}
           underlineColorAndroid="transparent"
           style={styless.txtInput}  onChangeText={(username) => this.setState({username:username})}/>
        <TextInput placeholder="Email"
           placeholderTextColor={colors.main_blue}
           underlineColorAndroid="transparent"
           style={styless.txtInput}  onChangeText={(email) => this.setState({email:email})}/>
        <TextInput placeholder="Password"
            underlineColorAndroid="transparent"
            placeholderTextColor={colors.main_blue}
            secureTextEntry={true}
            style={styless.txtInput}  onChangeText={(password) => this.setState({password:password})}/>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')} style={styless.btnReg}>
            <Text style={styless.txtReg}>Registration</Text>
        </TouchableOpacity>
        </View>
        <View style={{flex:1}}>
        <Text style={styless.txtLogin} onPress={() => this.props.navigation.navigate('Login')}>Login</Text>
        {/* <Button title="Go to Home"/> */}
        {/* <HomeScreen /> */}
      </View>
      </View>
      </ImageBackground>
    );
  }
}
const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
const styless = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#A9D0F5',
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
    color:'red'
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
  btnReg:{
    //  width: DEVICE_WIDTH - 40,
    //  backgroundColor:'rgba(0,145,234,1)',
    //  padding:8,
    //  borderRadius: 20,
    //  marginTop:2
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
  txtReg:{
    color:'#fff',
    fontWeight:'700',
    fontSize:20,
    letterSpacing:1.5,
    textTransform:'uppercase',
    textAlign: 'center',
    padding:10,
  },
  txtLogin:{
    fontSize:16,
    color:colors.white,
    position:'absolute',
    // top:DEVICE_HEIGHT - 20,
    alignItems: "center"
    
  }
  
});
const RegistrationStackNavigator = createStackNavigator(  
    {  
        LoginNavigator: Registration  
    }  );
export default RegistrationStackNavigator;