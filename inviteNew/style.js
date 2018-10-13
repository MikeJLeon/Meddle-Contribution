import {StyleSheet,Platform, Animated } from 'react-native';
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
export default {
    container: {
      backgroundColor: '#fff',
    },
    sections:{
      backgroundColor:"lightgray",
      height:25,
    },
    contacts:{
      flex:1, 
      flexDirection:"row",
      justifyContent:"space-between"
    },
    image:{
      margin:10,
      width:50,
      height:50,
    },
    name:{
      padding:10,
      position:'absolute',
      left:60,
      top:15,
    },
    button:{
      marginTop:25,
      marginRight:10,
      width:75,
      height:25,
      backgroundColor:"gray",
      borderRadius:20,
    },
    buttontext:{
      textAlign:"center",
      color:"white",
    }
}
