import React, { Component } from 'react';  
//mport { View, Text, StyleSheet, Button } from 'react-native';  
import {Platform, StyleSheet, Text,Alert, View,TouchableOpacity,TextInput,Image,Dimensions,Button} from 'react-native'; 
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import Icon from 'react-native-vector-icons/Ionicons'; 
class Profile extends Component{
    static navigationOptions = {  
        title: 'Profile',  
   };  
render(){
    return (
           <View>
        <Text>ahihi chào bạn</Text>
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