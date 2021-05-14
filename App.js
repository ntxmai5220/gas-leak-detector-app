import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View,useWindowDimensions } from 'react-native';
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
import { createDrawerNavigator } from 'react-navigation-drawer'
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
const AppDrawerNavigator1 = createDrawerNavigator({ 
  Dashboard:{screen:DashboardStackNavigator},
    History: {  
        screen: HistoryStackNavigator,
     },  
    Profile: {
      screen: ProfileStackNavigator
    }
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

