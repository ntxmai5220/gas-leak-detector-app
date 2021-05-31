import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, Image, View, ScrollView, SafeAreaView, useWindowDimensions } from 'react-native';
import LoginStackNavigator from './components/login';
import RegistrationStackNavigator from './components/registration';
import ProfileStackNavigator from './components/profile';
import HistoryStackNavigator from './components/history';
import DashboardStackNavigator from './components/dashboard'
import {  
  createSwitchNavigator,  
  createAppContainer
   
} from 'react-navigation';  
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator, DrawerItems} from 'react-navigation-drawer';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default function App() {
  return (
    <AppContainer />
  );
}

const AppDrawerNavigator = createDrawerNavigator({ 
    Login: {  
        screen: LoginStackNavigator  ,
    },  
    Registration: {  
        screen: RegistrationStackNavigator  
    }});

const Custom_AppDrawerNavigator1=(props)=>(
    <SafeAreaView>
        {/* <View></View> */}
        <View style={{height: hp('30%'),alignItems:'center',justifyContent:'center'}}>
        <Image source={require('./assets/logo.png')} style={{height:wp('35%'),width:wp('35%'),alignSelf:'center'}}/>
        </View>
        <ScrollView>
        <DrawerItems {...props}/>
        </ScrollView>
    </SafeAreaView>
);
const AppDrawerNavigator1 = createDrawerNavigator({ 
    Dashboard:{  
        screen: DashboardStackNavigator
    },
    History: {  
        screen: HistoryStackNavigator
    },  
    Profile: {  
        screen: ProfileStackNavigator
    },
    Logout:{
        screen: LoginStackNavigator 
    }
},{
    contentComponent:Custom_AppDrawerNavigator1
});

const AppSwitchNavigator = createSwitchNavigator({ 
    Login: { screen: AppDrawerNavigator }, 
    Profile: {
        screen: AppDrawerNavigator1
    }
}); 
// const Drawer = createDrawerNavigator();

// const AppContainer=()=> {
//   const dimensions = useWindowDimensions();

//   return (
//     <Drawer.Navigator
//       drawerType={dimensions.width >= 768 ? 'permanent' : 'front'}
//     >
//       {/* Screens */}
//     </Drawer.Navigator>
//   );
// }
const AppContainer = createAppContainer(AppSwitchNavigator);  
