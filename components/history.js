import React, { Component } from 'react';  
//mport { View, Text, StyleSheet, Button } from 'react-native';  
import {Platform, StyleSheet, Text,Alert, View,TouchableOpacity,TextInput,Image,Dimensions,Button} from 'react-native'; 
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import Icon from 'react-native-vector-icons/Ionicons'; 
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import HistoryDetail from './historyDetail';
import colors from '../assets/colors'


class History extends Component{
    static navigationOptions = ({ navigation }) => {  
            return {  
                title: 'Lịch sử',
                headerLeft: (  
                    <Icon  
                        style={{ paddingLeft: 10 }}  
                        onPress={() => navigation.openDrawer()}  
                        name="md-menu"  
                        size={30}  
                    />  
                )  
            };   
    };
    _date_submit = (day) => {
        console.log("do some thing with this: ", day);
        this.props.navigation.navigate('HistoryDetail', { day: day });
    };
    render(){
        return (
            <View style={styles.container}>
                {/* <Text>Wellcome to history</Text> */}
                <View style={styles.calendar}>

                    <Calendar
           
                        current={Date.now()}
                        minDate={Date.now() - 12096e5}
                        maxDate={Date.now()}
                        onDayPress={(day) => {this._date_submit(day)}}
                        theme={{
                            todayTextColor: colors.green,
                            selectedDayTextColor: colors.main_blue,
                            textDayFontWeight: '300',
                            textMonthFontWeight: '700',
                            textDayHeaderFontWeight: '400',
                            textDayFontSize: 16,
                            textMonthFontSize: 20,
                            textDayHeaderFontSize: 16,
                            arrowColor: colors.green,
                        }}
                    />
                </View>
            </View>
        )}
    };
    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
        },
        calendar: {
            flex: 1,
            marginLeft: 20,
            marginRight: 20,
            marginTop: 20,
        },
    });
    const HistoryComponent = createStackNavigator({  
        History: History,
        HistoryDetail: HistoryDetail
        }
    );
export default HistoryComponent;