import React, { Component } from 'react';  
//mport { View, Text, StyleSheet, Button } from 'react-native';  
import {Platform, StyleSheet, Text,Alert, View,TouchableOpacity,TextInput,Image,Dimensions,Button,ScrollView} from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer'
class Registration extends Component{
    static navigationOptions = {  
        title: 'Registration',  
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
        this.setState({checkReg:responseJson.success});
        if(this.state.checkLogin>0){
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
      <View style={styless.container}>
        <Text style={{fontSize:25,color:'red'}}>Information for your account</Text>
        <TextInput placeholder="Full name"
           placeholderTextColor="black"
           underlineColorAndroid="transparent"
           style={styless.txtInput}  onChangeText={(fullname) => this.setState({fullname:fullname})}/>
        <TextInput placeholder="Username"
           placeholderTextColor="black"
           underlineColorAndroid="transparent"
           style={styless.txtInput}  onChangeText={(username) => this.setState({username:username})}/>
        <TextInput placeholder="Email"
           placeholderTextColor="black"
           underlineColorAndroid="transparent"
           style={styless.txtInput}  onChangeText={(email) => this.setState({email:email})}/>
        <TextInput placeholder="Password"
            underlineColorAndroid="transparent"
            placeholderTextColor="black"
            secureTextEntry={true}
            style={styless.txtInput}  onChangeText={(password) => this.setState({password:password})}/>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')} style={styless.btnLogin}>
            <Text style={styless.txtLogin}>Registration</Text>
        </TouchableOpacity>
        <Text onPress={() => this.props.navigation.navigate('Login')}>Login</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#A9F5F2',
  },
  title:{
    fontSize:30,
    color:'red'
  },
  txtInput:{
    backgroundColor: 'rgba(0,0,0, 0.1)',
    width: DEVICE_WIDTH - 40,
     
    marginHorizontal: 20,
    padding:8,
    borderRadius: 20,
    color: '#000',
    marginTop:2
  },
  btnLogin:{
     width: DEVICE_WIDTH - 40,
     backgroundColor:'rgba(0,145,234,1)',
     padding:8,
     borderRadius: 20,
     marginTop:2
 
  },
  txtLogin:{
    color:'#fff',
    textAlign:'center'
  }
  
});
const RegistrationStackNavigator = createStackNavigator(  
    {  
        LoginNavigator: Registration  
    }  );
export default RegistrationStackNavigator;