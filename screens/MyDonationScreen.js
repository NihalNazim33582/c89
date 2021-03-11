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
  FlatList,
} from "react-native";

import { Header, Card, Icon, ListItem } from "react-native-elements";
import BookDonateScreen from "../screens/BookDonateScreen";
import RecieverDeatils from "../screens/RecieverDetailsScreen";
import MyHeader from "../components/MyHeader";
import db from "../config";
import firebase from "firebase";
//import { FlatList } from "react-native-gesture-handler";

export default class MyDonation extends React.Component {
  constructor() {
    super();
    this.state = {
      DonorId: firebase.auth().currentUser.email,
      allDonations: [],
      donorName:''
    };
    this.bookRef = null;
  }

  donorDetails=()=>{
    db.collection('users').where('email_id','==',DonorId).get()
    .then((snapshot)=>{
      snapshot.forEach(doc=>{
        this.setState({
          donorName:doc.data().first_name+doc.data().last_name
        })
      })
    })
  }

  getAllDonations = () => {
    this.bookRef = db
      .collection("AllDonations")
      .where("DonorId", "==", this.state.DonorId)
      .onSnapshot((snapshot) => {
        var allDonations =[]
        snapshot.docs.map(doc=>{
          var donation=doc.data()
          allDonations.push(donation)
        })
        this.setState({
          allDonations: allDonations,
        });
      });
  };

  sendBook = (bookDetails) => {
    if (bookDetails.requestStatus === "bookSent") {
      var requestStatus = "Donor Is Intreseted";
      db.collection("AllDonations").doc(bookDetails.doc_id).update({
        requestStatus: "Donor Is Intrested",
      });
      this.sendNotification(bookDetails, requestStatus);
    } else {
      var requestStatus = "Book Was sent";
      db.collection("AllDonations").doc(bookDetails.doc_id).update({
        requestStatus: "Book Was Sent",
      });
      this.sendNotification(bookDetails, requestStatus);
    }
  };

  sendNotification = (bookDetails, requestStatus) => {
    var requestId = bookDetails.request_id;
    var donor_id = bookDetails.donor_id;
    db.collection("AllNotifications")
      .where("requestId", "==", requestId)
      .where("donor_id", "==", donor_id)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var message = "";
          if (requestStatus === "bookSent") {
            message = this.state.donorName + " has sent you the book.";
          } else {
            message =
              this.state.donorName +
              " has shown an intrest in donation your book.";
          }

          db.collection("AllNotifications").doc(doc.id).update({
            message: message,
            date: firebase.firestore.FieldValue.serverTimestamp(),
            Notification: "UnRead",
          });
        });
      });
  };

  componentDidMount = () => {
    this.getAllDonations();
  };

  componentWillUnmount =()=>{
    this.bookRef();
  };

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, i }) => {
    return (
      <ListItem
        key={i}
        title={item.book_name}
        subtitle={
          "Requested By: " + item.requestBy + "\nStatus: " + item.requestStatus
        }
        leftElement={
          <Icon
            name="book-bookmark"
            type="foundation"
            color="black"
            size={25}
          />
        }
        titleStyle={{ color: "black", fontWeight: "bold" }}
        rightElement={
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor:
                  item.requestStatus === "Book was Sent" ? "green" : "red",
              },
            ]}
            onPress={()=>{
                this.sendBook(item);
            }}
          >
            <Text style={{ color: "#ffff" }}>Send Book</Text>
          </TouchableOpacity>
        }
        bottomDivider
      />
    );
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MyHeader title="My Dontaions" navigation={this.props.navigation}/>
        <View style={{ flex: 1 }}>
          {this.state.allDonations.length === 0 ? (
            <View style={styles.subtitle}>
              <Text style={{ fontSize: 20 }}>List of All Donations</Text>
            </View>
          ) : (
            <FlatList
              keyExtractor={this.keyExtractor}
              data={this.state.allDonations}
              renderItem={this.renderItem}
            />
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    width: 100,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ff5722",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    elevation: 16,
  },
  subtitle: {
    flex: 1,
    fontSize: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
