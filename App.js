import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useRef }  from 'react';
import {ToastAndroid, Alert, Image, View, ScrollView, SafeAreaView, useWindowDimensions, AsyncStorage } from 'react-native';
import LoginComponent from './components/login';
import LogoutComponents from './components/logout';
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
import colors from './assets/colors';

import { LISTENING_SERVER } from './global/user'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
var STORAGE_KEY = 'id_token';
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
const showToastWithGravityAndOffset = (message,x,y) => {
    ToastAndroid.showWithGravityAndOffset(
      message,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
      x,
      y
    );
  };
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
        <DrawerItems {...props}
          onItemPress={(scene)=>{
						// console.log("route: ", scene)
            if(scene.route.routeName==="Logout"){
              Alert.alert(
                "Bạn muốn đăng xuất?","",
                [{
                    text: "Cancel",
                    onPress: () => {console.log('Cancel');},
                    style: "cancel"
                  },{ 
                    text: "OK", onPress: async ()=>{
                    const logoutlink = LISTENING_SERVER.logoutAPI;
                    let t = await AsyncStorage.getItem(STORAGE_KEY).then(value => value);
                    return fetch(logoutlink, { 
                      method: 'POST',
                      headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        token: t
                      }),
                    })
                    .then((response) => response.json())
                    .then((responseJson) => {
                      console.warn(responseJson);
                      if (responseJson.status=="success"){
                        console.warn(responseJson);
                        //Alert.alert("Thông báo!","Bạn đã đăng xuất thành công!");
                        console.log(responseJson.message);
                        props.navigation.navigate(scene.route.routeName);
                        showToastWithGravityAndOffset("Bạn đã đăng xuất thành công!",0,-100);
                      }
                      else{
                        // console.warn(responseJson);
                        showToastWithGravityAndOffset("Đăng xuất thất bại!",0,-100);
                        //Alert.alert("Đăng xuất thất bại!",responseJson.message);
                      }
                    })
                    .catch((error) =>{
                        console.error(error);
                    });
                  }
                }]
              );
              console.log('press logout')
            } else {
						  props.navigation.navigate(scene.route.routeName);
						}
          }}/>
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
    Logout: {  
        navigationOptions: () => ({
            title: 'Đăng xuất',
          }),
        screen: LoginComponent
    },
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
    //alert('Must use physical device for Push Notifications');
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
