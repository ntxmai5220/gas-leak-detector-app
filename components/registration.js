import React, { Component } from 'react';  
//mport { View, Text, StyleSheet, Button } from 'react-native';  
import {Platform,
   StyleSheet,
    Text,
    Alert,
     View,
     TouchableOpacity,
     TextInput,
     Image,
     Dimensions,
     Button
     ,ScrollView,
     ImageBackground,AsyncStorage
  } from '../node_modules/react-native';
  //var ReactNative = require('react-native');
// var t = require('tcomb-form-native')
//var {AsyncStorage} =ReactNative
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
//import { useFonts } from 'expo-font';
import colors from '../assets/colors'
var STORAGE_KEY = 'id_token';


class Registration extends Component{
    static navigationOptions = {  
        title: '',
        headerShown:false  
   };
   
  constructor(props){
    super(props);
    this.state={
      passwordConfirm:"",
      password:"",
      email:"",
      fullname:"",
    }
  };
	_onSubmit=()=>{
		//Alert.alert("Thông báo!","Bạn đã đăng nhập thành công!");
		if (this.state.password != this.state.passwordConfirm) {
			Alert.alert("Thông báo!", "Mật khẩu và xác nhận không khớp nhau!");
			return null;
		} else {
			return fetch('https://mysterious-reaches-12750.herokuapp.com/api/users/signup', { 
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name: this.state.fullname,
					password: this.state.password,
					email:this.state.email,
					// passwordConfirm:this.state.passwordConfirm
				})
			})
			.then((response) => response.json())
			.then((responseJson) => {
				// this.setState({checkReg:responseJson.success});
				if (responseJson.status=="success"){
					console.warn(responseJson);
					Alert.alert("Thông báo!","Bạn đã đăng ký thành công!");
					this._onValueChange(STORAGE_KEY,responseJson.token)
          this._onValueChange("fullname",responseJson.data.name)
          this._onValueChange("email",responseJson.data.email)
					this.props.navigation.navigate('Dashboard');
				}
				else{
				// console.warn(responseJson);
					Alert.alert("Thông báo!",responseJson.message)
				}
			})
			.catch((error) =>{
				console.error(error);
			});
		}
	}
	async _onValueChange(item, selectedValue) {
		try {
		await AsyncStorage.setItem(item, selectedValue);
		} catch (error) {
		console.log('AsyncStorage error: ' + error.message);
		}
	}
//   async _getProtectedQuote() {
//     var DEMO_TOKEN = await AsyncStorage.getItem(STORAGE_KEY);
//     fetch("http://localhost:3001/api/protected/random-quote", {
//       method: "GET",
//       headers: {
//         'Authorization': 'Bearer ' + DEMO_TOKEN
//       }
//     })
//     .then((response) => response.text())
//     .then((quote) => {
//       Alert.alert(
//         "Chuck Norris Quote:", quote)
//     })
//     .done();
//   }
//   async _getProtectedQuote() {
//   var DEMO_TOKEN = await AsyncStorage.getItem(STORAGE_KEY);
//   fetch("http://localhost:3001/api/protected/random-quote", {
//     method: "GET",
//     headers: {
//       'Authorization': 'Bearer ' + DEMO_TOKEN
//     }
//   })
//   .then((response) => response.text())
//   .then((quote) => {
//     Alert.alert(
//       "Chuck Norris Quote:", quote)
//   })
//   .done();
// }
// _userSignup() {
//   var value = this.refs.form.getValue();
//   if (value) { // if validation fails, value will be null
//     fetch("http://localhost:3001/users", {
//       method: "POST",
//       headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         username: value.username,
//         password: value.password,
//       })
//     })
//     .then((response) => response.json())
//     .then((responseData) => {
//       this._onValueChange(STORAGE_KEY, responseData.id_token),
//       Alert.alert(
//         "Signup Success!",
//         "Click the button to get a Chuck Norris quote!"
//       )
//     })
//     .done();
//   }
// }
  render() {
    return (
		<ImageBackground source={require('../assets/brReg.jpg')} style={styless.image}>
			
		<View style={styless.container}>
			<Image source={require('../assets/logo1.png')} style={{flex:2, alignSelf:'center', position:'relative', top:hp('5%'),}}/>
			<View style ={{flex:5, position:'relative', top:hp('7%'),}}>
				<Text style={{fontSize:20,color:'white',fontWeight: "bold"}}>Thông tin tài khoản</Text>
				<TextInput placeholder="Họ tên"
				placeholderTextColor={colors.main_blue}
				underlineColorAndroid="transparent"
				style={styless.txtInput}  onChangeText={(fullname) => this.setState({fullname:fullname})}/>
				<TextInput placeholder="Email"
				placeholderTextColor={colors.main_blue}
				underlineColorAndroid="transparent"
				style={styless.txtInput}  onChangeText={(email) => this.setState({email:email})}/>
				<TextInput placeholder="Mật khẩu"
					underlineColorAndroid="transparent"
					placeholderTextColor={colors.main_blue}
					secureTextEntry={true}
					style={styless.txtInput}  onChangeText={(password) => this.setState({password:password})}/>
				<TextInput placeholder="Xác nhận mật khẩu"
				placeholderTextColor={colors.main_blue} 
        secureTextEntry={true}
				underlineColorAndroid="transparent"
				style={styless.txtInput}  onChangeText={(passwordConfirm) => this.setState({passwordConfirm:passwordConfirm})}/>
				<TouchableOpacity onPress={this._onSubmit} style={styless.btnReg}>
					<Text style={styless.txtReg}>Đăng ký</Text>
				</TouchableOpacity>
        <Text style={styless.txtLogin} onPress={() => this.props.navigation.navigate('Login')}>Đăng nhập</Text>
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
    position:'relative',
    top:hp('5%'),
    alignSelf: 'center',
    alignItems: "center",
  }
  
});
const RegistrationComponent = createStackNavigator(  
    {  
        Registration: Registration  
    });
export default RegistrationComponent;