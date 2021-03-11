import React from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";

import MyHeader from "../components/MyHeader";
import db from "../config";
import firebase from "firebase";

export default class Settings extends React.Component {
  constructor() {
    super();
    this.state = {
      firstName: "",
      lastName: "",
      address: "",
      contact: "",
      docId: "",
      email_id:"",
    };
  }

  getUserDetails = () => {
    var Email = firebase.auth().currentUser.email;
    db.collection("users")
      .where("email_id", "==", Email)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var data = doc.data();
          this.setState({
            firstName: data.first_name,
            lastName: data.last_name,
            contact: data.contact,
            address: data.address,
            docId: doc.id,
            email_id:data.email_id
          });
        });
      });
  };

  componentDidMount = () => {
    this.getUserDetails();
  };

  UpdateUserDeatils=()=>{
      db.collection("users").doc(this.state.docId).update({
        first_name:this.state.firstName,
        last_name:this.state.lastName,
        contact:this.state.contact,
        address:this.state.address,
      })
      Alert.alert('Your profile was successfully updated.')
  }

  render() {
    return (
      <View style={styles.container}>
        <MyHeader title="Settings" navigation={this.props.navigation}/>
        <View style={styles.TextInputcontainer}>
          <TextInput
            style={styles.formTextInput}
            placeholder={"First Name"}
            maxLength={10}
            onChangeText={(text) => {
              this.setState({
                firstName: text,
              });
            }}
            value={this.state.firstName}
          />
          <TextInput
            style={styles.formTextInput}
            placeholder={"Last Name"}
            maxLength={10}
            onChangeText={(text) => {
              this.setState({
                lastName: text,
              });
            }}
            value={this.state.lastName}
          />
          <TextInput
            style={styles.formTextInput}
            placeholder={"Contact"}
            maxLength={10}
            keyboardType={"numeric"}
            onChangeText={(text) => {
              this.setState({
                contact: text,
              });
            }}
            value={this.state.contact}
          />
          <TextInput
            style={styles.formTextInput}
            placeholder={"Address"}
            multiline={true}
            onChangeText={(text) => {
              this.setState({
                address: text,
              });
            }}
            value={this.state.address}
          />

          <TouchableOpacity
            onPress={() => {
              this.UpdateUserDeatils();
            }}
            style={styles.savebutton}
          >
            <Text style={styles.savebuttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
  TextInputcontainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  formTextInput: {
    width: "75%",
    height: 35,
    alignSelf: "center",
    borderColor: "#ffab91",
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 20,
    padding: 10,
  },
  savebutton: {
    width: "75%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#ff5722",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop: 20,
  },

  savebuttonText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#fff",
  },
});
