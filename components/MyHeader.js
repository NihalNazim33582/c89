import React, { Component } from "react";
import { Header, Icon, Badge } from "react-native-elements";
import { View, Text, StyleSheet, Alert } from "react-native";
import firebase from "firebase";
import db from "../config";

export default class MyHeader extends React.Component {
  constructor(props){
    super(props)
    this.state={
      value:''
    }
  }

  UnreadNotification=()=>{
    db.collection('AllNotifications').where("Notification", "==", "UnRead").onSnapshot(snapshot=>{
      var UnreadNotifications=snapshot.docs.map((doc)=>doc.data())
       this.setState({
         value:UnreadNotifications.length
       })
    }
  )}

  bellIconWithValue=(props)=>{
    return(<View>
      <Icon
          name="bell"
          type="font-awesome"
          color="black"
          size={25}
          onPress={() => {
            this.props.navigation.navigate("Notification");
          }}

        />
        <Badge value={this.state.value} containerStyle={{position:'absolute',top:-10,right:-10}}/>
    </View>)
  }

  componentDidMount=()=>{
    this.UnreadNotification()
  }

  render(){
  return (
    <Header
      centerComponent={{
        text: this.props.title,
        style: { color: "#90A5A9", fontSize: 20, fontWeight: "bold" },
      }}
      backgroundColor="#eaf8fe"
      leftComponent={
        <Icon
          name="bars"
          type="font-awesome"
          color="black"
          size={25}
          onPress={() => {
            this.props.navigation.toggleDrawer();
          }}
        />
      }
      rightComponent={
        <this.bellIconWithValue {...this.props}/>
      }
    />
  );}
};


