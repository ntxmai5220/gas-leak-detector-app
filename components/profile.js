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
      name:"unknown",
      email:"unknown"
    }
    
  }
  
  componentDidMount() {
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
      data.push(['5','Van gas']);
      data.push(['6','Loa']);
      data.push(['7','Màn hình']);
      // console.log(data);
      
      // AsyncStorage.getItem("fullname").then((name)=>{
      //   this.setState({name:name})
      // });
      // AsyncStorage.getItem("email").then((email)=>{
      //   this.setState({email:email})
      // });
    //  this.setInfo();
    return (
        <View style={{flex:1,alignItems:'center',backgroundColor:colors.white}}>
        <View style={style.headerPage}>
        </View>  
            <View style={style.midPage}>
            <Image source={require('../assets/user.png')} style={style.image_icon}></Image>
              <Text style={{fontSize:25,fontWeight:'600',alignSelf:'center',color: colors.main_blue}}> {this.state.name}</Text>
              <Text style={style.padd_text}>Email: {this.state.email}</Text>
            </View>
            <View style={[styles.container,{flex:9.5}]}>
         
              <Table borderStyle={{borderColor: colors.black}}>
                <Row data={this.state.tableHead} widthArr={this.state.widthArr} style={styles.head} textStyle={{textAlign: 'center',color: colors.white, fontSize:17, fontWeight:'600'}}/>
              </Table>
              <ScrollView style={styles.dataWrapper}>
                <Table borderStyle={{borderColor: colors.grey}}>
                  {
                    data.map((dataRow, index) => (
                      <Row
                        key={index}
                        data={dataRow}
                        widthArr={this.state.widthArr}
                        style={[styles.row, index%2 && {backgroundColor: colors.white}]}
                        textStyle={styles.text}
                      />
                    ))
                  }
                </Table>
              </ScrollView>
            </View>
      </View>
    )}
};
const style=StyleSheet.create({
    headerPage:{
      flex:4.5,
      justifyContent:'center',
      backgroundColor:colors.main_blue,
      width:wp('150%'),
      borderBottomRightRadius:wp('50%'),
      borderBottomLeftRadius:wp('50%'),
    },
    midPage:{
      flex:2.7,
      justifyContent:'space-between',
      marginTop:-wp('15%'),
      width:wp('90%'),
      backgroundColor:colors.white,
      borderRadius:15,
      shadowColor: colors.black,
      shadowOffset: {
        width: 2,
        height: 2,
      },
      shadowOpacity:5,
      elevation: 5, 
    },
    image_icon:{
        marginTop:-wp('20%'),
        width:wp('30%'),
        height:wp('30%'),
        alignSelf:'center',
        borderWidth: 2,
        borderRadius:wp('25%'),
        borderColor:colors.background,
        resizeMode: "cover",
        //backgroundColor:"#58D3F7"
    },
    padd_text:{
        fontSize:16,
        //padding:5,
        marginBottom:10,
        alignSelf:'center'
    },
});
const styles = StyleSheet.create({
    container: {  
      width:wp('100%'),
      //borderTopLeftRadius:wp('20%'),
      marginTop:wp('3%'),
      padding: 15, 
      backgroundColor: colors.white,
      alignItems:'center'
    },
    head: { 
      height: 50, 
      backgroundColor: colors.main_blue 
    },
    text: { 
      textAlign: 'center', 
      fontWeight: '400' ,
      fontSize:15
    },
    dataWrapper: { 
      marginTop: -1 
    },
    row: { 
      height: 40, 
      backgroundColor: colors.grey ,
    }
  });
const ProfileComponent = createStackNavigator(  
    {  
        Profile: Profile  
    }
);
export default ProfileComponent;