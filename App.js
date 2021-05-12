import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LoginStackNavigator from './components/login';
import RegistrationStackNavigator from './components/registration';
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
      screen: LoginStackNavigator  
   },  
   Registration: {  
      screen: RegistrationStackNavigator  
  },
});
const AppSwitchNavigator = createSwitchNavigator({ 
  Login: { screen: AppDrawerNavigator }, 
}); 
const AppContainer = createAppContainer(AppSwitchNavigator);  

