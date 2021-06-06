import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useRef }  from 'react';
import { StyleSheet, Text, Image, View, ScrollView, SafeAreaView, useWindowDimensions } from 'react-native';
import LoginComponent from './components/login';
import LogoutComponent from './components/logout';
import RegistrationComponent from './components/registration';
import ProfileComponent from './components/profile';
import HistoryComponent from './components/history';
import HistoryDetailComponent from './components/historyDetail';
import DashboardComponent from './components/dashboard';
import {  
  createSwitchNavigator,  
  createAppContainer
   
} from 'react-navigation';  
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator, DrawerItems} from 'react-navigation-drawer';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

    return (
      <AppContainer/>
    );
}

const AppDrawerNavigator = createDrawerNavigator({ 
    Login: {  
        screen: LoginComponent  ,
    },  
    Registration: {  
        screen: RegistrationComponent  
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
        navigationOptions: () => ({
            title: 'Trang chủ',
          }),
        screen: DashboardComponent
    },
    History: {  
        navigationOptions: () => ({
            title: 'Lịch sử',
          }),
        screen: HistoryComponent
    },  
    Profile: {  
        navigationOptions: () => ({
            title: 'Thông tin người dùng',
          }),
        screen: ProfileComponent
    },
    Logout:{
        navigationOptions: () => ({
            title: 'Đăng xuất',
          }),
        screen: LogoutComponent 
    }
},{
  initialRouteName:'Dashboard',
  contentComponent:Custom_AppDrawerNavigator1,   
});

const AppSwitchNavigator = createSwitchNavigator({ 
    Welcome: { screen: AppDrawerNavigator }, 
    Main: {
        screen: AppDrawerNavigator1
    },
}); 


async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [255, 255, 255, 255],
      lightColor: '#005792',
    });
  }

  return token;
}


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
