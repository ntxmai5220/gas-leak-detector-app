import React, { Component } from 'react';  
//mport { View, Text, StyleSheet, Button } from 'react-native';  
import {Platform, StyleSheet, Text,Alert, View,TouchableOpacity,TextInput,Image,Dimensions,Button} from 'react-native'; 
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import Icon from 'react-native-vector-icons/Ionicons'; 
import colors from '../assets/colors'
const style=StyleSheet.create({

    image_icon:{
        flex:1,
        width:150,
        alignSelf:'center',
        borderWidth:  3,
        borderRadius:250,
        borderColor:"black",
        resizeMode: "cover",
        backgroundColor:"#58D3F7"
    },
    padd_text:{
        flex:1,
        paddingRight:hp('10%'),
        // borderRadius:30,
    borderWidth:3,
    borderColor: "#D8D8D8",
    borderLeftWidth:0,
    borderRightWidth:0,
    // marginTop:hp('1%'),
    marginBottom:hp('1%'),
    fontSize:20,
    padding:10
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
      }
});
class Profile extends Component{
    static navigationOptions = {  
        title: 'Profile',  
   };  
render(){
    return (
           <View style={{flex:1}}>
               <View style={{flex:0.2}}></View>
               <Text style={{flex:1,fontSize:25,fontWeight:'bold'}}> Robert Pattinson</Text>
            <Image source={require('../assets/person-icon.png')} style={style.image_icon}></Image>
            <View style={{flex:0.5}}></View>
            
            <Text style={style.padd_text}>Email</Text>
            {/* <Text style={{flex:1}}>Name</Text> */}
            <Text style={{flex:3,fontSize:20}}>Device</Text>
            {/* <TouchableOpacity onPress={()=>{this.props.navigation.navigate('Profile')}} style={style.btnLogin}>
                    <Text style={style.txtLogin}>Add Device</Text>
                </TouchableOpacity> */}
        
    </View>
    )}
};
const ProfileStackNavigator = createStackNavigator(  
    {  
        LoginNavigator: Profile  
    },
    {  
        defaultNavigationOptions: ({ navigation }) => {  
            return {  
                headerLeft: (  
                    <Icon  
                        style={{ paddingLeft: 10 }}  
                        onPress={() => navigation.openDrawer()}  
                        name="md-menu"  
                        size={30}  
                    />  
                )  
            };  
        }  
    }  
      );
export default ProfileStackNavigator;