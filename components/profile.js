import React, { Component } from 'react';  
//mport{ View, Text, StyleSheet, Button } from 'react-native';  
import { StyleSheet, Text, View,Image,ScrollView} from 'react-native'; 
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { createStackNavigator } from 'react-navigation-stack';
import { Table, Row } from 'react-native-table-component';
// import { createDrawerNavigator } from 'react-navigation-drawer';
import Icon from 'react-native-vector-icons/Ionicons'; 
import colors from '../assets/colors'
import {AsyncStorage} from '../node_modules/react-native';

class Profile extends Component{
    static navigationOptions = ({ navigation }) => {  
            return {  
                title: 'Thông tin người dùng',
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
   constructor(props) {
    super(props);
    this.state = {
      tableHead: ['STT', 'Tên thiết bị'],
      widthArr: [50,300],
      name:"",
      email:""
    }
    this.setInfo();
  
  }
  
  setInfo=async ()=>{
      this.setState({name: await AsyncStorage.getItem('fullname').then(value => value)});
      this.setState({email:  await AsyncStorage.getItem('email').then(value => value)});
  }
render(){
    //const state = this.state;
    const data = [];
      data.push(['1','Cảm biến nồng độ khí gas']);
      data.push(['2','Cảm biến nhiệt độ']);
      data.push(['3','Động cơ quạt']);
      data.push(['4','Máy bơm nước']);
      // console.log(data);
      
      // AsyncStorage.getItem("fullname").then((name)=>{
      //   this.setState({name:name})
      // });
      // AsyncStorage.getItem("email").then((email)=>{
      //   this.setState({email:email})
      // });
    //  this.setInfo();
    return (
           <View style={{flex:1}}>
               <View style={{flex:0.2}}></View>
               <Text style={{flex:1,fontSize:25,fontWeight:'bold'}}> {this.state.name}</Text>
            <Image source={require('../assets/person-icon.png')} style={style.image_icon}></Image>
            <View style={{flex:0.5}}></View>
            <Text style={style.padd_text}>Email: {this.state.email}</Text>
            <View style={{flex:6}}>
            <Text style={{flex:1,fontSize:20}}>Thiết bị</Text>
                <View style={[styles.container,{flex:8}]}>
        <ScrollView horizontal={true}>
          <View>
            <Table borderStyle={{borderColor: '#C1C0B9'}}>
              <Row data={this.state.tableHead} widthArr={this.state.widthArr} style={styles.head} textStyle={styles.text}/>
            </Table>
            <ScrollView style={styles.dataWrapper}>
              <Table borderStyle={{borderColor: '#C1C0B9'}}>
                {
                  data.map((dataRow, index) => (
                    <Row
                      key={index}
                      data={dataRow}
                      widthArr={this.state.widthArr}
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
const ProfileComponent = createStackNavigator(  
    {  
        Profile: Profile  
    }
);
export default ProfileComponent;