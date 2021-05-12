import React, { Component } from 'react';  
//mport { View, Text, StyleSheet, Button } from 'react-native';  
import {Platform, StyleSheet, Text,Alert, View,TouchableOpacity,TextInput,Image,Dimensions,Button} from 'react-native'; 
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
        <Text style={{fontSize:20,color:'red'}}>Enter your username and password</Text>
        <TextInput placeholder="Username"
           placeholderTextColor="black"
           underlineColorAndroid="transparent"
           style={styless.txtInput}  onChangeText={(username) => this.setState({username:username})}/>
        <TextInput placeholder="Password"
            underlineColorAndroid="transparent"
            placeholderTextColor="black"
            secureTextEntry={true}
            style={styless.txtInput}  onChangeText={(password) => this.setState({password:password})}/>
        <TouchableOpacity onPress={this._onSubmit} style={styless.btnLogin}>
            <Text style={styless.txtLogin}>Login</Text>
        </TouchableOpacity>
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
    backgroundColor: '#F5FCFF',
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
     marginTop:2,
 
  },
  txtLogin:{
    color:'#fff',
    textAlign:'center',
    fontSize:20
  },
  txtWellcom:{
    marginTop:20,
    fontSize:30
  },
  txtReg:{
    marginBottom:30,
    fontSize:15
  }
});
class Login extends Component {  
    static navigationOptions = {  
         title: 'Login',  
    };  
    render() {  
        return (  
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' },styless.container}>  
                <Text style={styless.txtWellcom}>Welcome to our app</Text>  
                <ViewLogin />
                <Text style={styless.txtReg} onPress={() => this.props.navigation.navigate('Registration')}>Registration</Text>   
            </View>  
        );  
    }
}  
const LoginStackNavigator = createStackNavigator(  
    {  
        LoginNavigator: Login  
    }  );
export default LoginStackNavigator;