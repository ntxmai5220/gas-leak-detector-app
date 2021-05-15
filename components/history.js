import React, { Component } from 'react';  
//mport { View, Text, StyleSheet, Button } from 'react-native';  
import {Platform, StyleSheet, Text,Alert, View,TouchableOpacity,TextInput,Image,Dimensions,Button} from 'react-native'; 
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import Icon from 'react-native-vector-icons/Ionicons'; 
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    calendar: {
        backgroundColor: 'blue',
        flex: 1,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 20,
    }
});

class History extends Component{
    static navigationOptions = {  
        title: 'History',  
    };
    _date_submit = (day) => {
        console.log("do some thing with this: ", day);
    };
    render(){
        return (
            <View style={styles.container}>
                {/* <Text>Wellcome to history</Text> */}
                <View style={styles.calendar}>

                    <Calendar
                        onDayPress={(day) => {this._date_submit(day)}}
                    />
                </View>
            </View>
        )}
    };
const HistoryStackNavigator = createStackNavigator(  
    {  
        LoginNavigator: History  
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
export default HistoryStackNavigator;