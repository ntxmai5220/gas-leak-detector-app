import React, { Component } from 'react';  
//mport { View, Text, StyleSheet, Button } from 'react-native';  
import {Platform, StyleSheet, Text,Alert, View,TouchableOpacity,TextInput,Image,Dimensions,Button,ScrollView,AsyncStorage} from '../node_modules/react-native'; 
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { createStackNavigator } from 'react-navigation-stack';
import { Table, TableWrapper, Row } from 'react-native-table-component';
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
        //backgroundColor:"#58D3F7"
    },
    padd_text:{
        flex:0.5,
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
        title: 'Hồ sơ',  
   };  
   constructor(props) {
    super(props);
    this.state = {
      tableHead: ['ID', 'Tên', 'Thời gian', 'Trạng thái'],
      widthArr: [50,200,100,100],
      name:"",
      email:""
    }
  }
  // _retrieveData = async (topic) => {
  //   try {
  //     const value = await AsyncStorage.getItem(topic);
  //     if (value !== null) {
  //       // We have data!!
  //       console.log(value)
  //       this.setstate.name=value ;
  //     }
  //   } catch (error) {
  //     // Error retrieving data
  //   }
  // };
render(){
    const state = this.state;
    const data = [];
      data.push(['1','Gas sensor',(new Date()).getDate(),'on']);
      data.push(['2','Temperature sensor',(new Date()).getDate(),'on']);
      data.push(['3','Pump',(new Date()).getDate(),'off']);
      data.push(['4','Fan',(new Date()).getDate(),'on']);
      // console.log(data);
      AsyncStorage.getItem("fullname").then((name)=>{
        this.setState({name:name})
      });
      AsyncStorage.getItem("email").then((email)=>{
        this.setState({email:email})
      });
    return (
           <View style={{flex:1}}>
               <View style={{flex:0.2}}></View>
               <Text style={{flex:1,fontSize:25,fontWeight:'bold'}}> {this.state.name}</Text>
            <Image source={require('../assets/person-icon.png')} style={style.image_icon}></Image>
            <View style={{flex:0.5}}></View>
            
            <Text style={style.padd_text}>Email: {this.state.email}</Text>
            {/* <Text style={{flex:1}}>Name</Text> */}
            <View style={{flex:6}}>
            <Text style={{flex:1,fontSize:20}}>Thiết bị</Text>
            {/* <TouchableOpacity onPress={()=>{this.props.navigation.navigate('Profile')}} style={style.btnLogin}>
                    <Text style={style.txtLogin}>Add Device</Text>
                </TouchableOpacity> */}
                <View style={[styles.container,{flex:8}]}>
        <ScrollView horizontal={true}>
          <View>
            <Table borderStyle={{borderColor: '#C1C0B9'}}>
              <Row data={state.tableHead} widthArr={state.widthArr} style={styles.head} textStyle={styles.text}/>
            </Table>
            <ScrollView style={styles.dataWrapper}>
              <Table borderStyle={{borderColor: '#C1C0B9'}}>
                {
                  data.map((dataRow, index) => (
                    <Row
                      key={index}
                      data={dataRow}
                      widthArr={state.widthArr}
                      style={[styles.row, index%2 && {backgroundColor: '#ffffff'}]}
                      textStyle={styles.text}
                    />
                  ))
                }
              </Table>
            </ScrollView>
          </View>
        </ScrollView>
      </View>
      </View>
    </View>
    )}
};
const styles = StyleSheet.create({
    container: { 
      flex: 1, 
      padding: 16, 
      paddingTop: 30, 
      backgroundColor: '#ffffff' 
    },
    head: { 
      height: 50, 
      backgroundColor: '#6F7BD9' 
    },
    text: { 
      textAlign: 'center', 
      fontWeight: '200' 
    },
    dataWrapper: { 
      marginTop: -1 
    },
    row: { 
      height: 40, 
      backgroundColor: '#F7F8FA' 
    }
  });
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