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
 // FlatList,
} from "react-native";

import { Header, Card, Icon, ListItem } from "react-native-elements";
import BookDonateScreen from "../screens/BookDonateScreen";
import RecieverDeatils from "../screens/RecieverDetailsScreen";
import MyHeader from "../components/MyHeader";
import db from "../config";
import firebase from "firebase";
import { FlatList } from "react-native-gesture-handler";

export default class BooksRiceved extends React.Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      recivedBooks: [],
    };
    this.recivedRef = null;
  }

  getRecivedBookList = () => {
    this.recivedRef = db
      .collection("requested_books")
      .where("user_id", "==", this.state.userId)
      .where("book_status", "==", "recieved")
      .onSnapshot((snapshot) => {
        var recivedBookList = snapshot.docs.map((doc) => doc.data());
        //         var list=doc.data();
        this.setState({
          recivedBooks: recivedBookList,
        });
      });
  };

  componentDidMount = () => {
    this.getRecivedBookList();
  };

 componentWillUnmount=()=>{
     this.recivedRef();
 }

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, i }) => {
    return (
      <ListItem
        key={i}
        title={item.book_name}
        subtitle={item.book_status}
        titleStyle={{ color: "black", fontWeight: "bold" }}
        bottomDivider
      />
    );
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MyHeader
          title="Recived Book List"
          navigation={this.props.navigation}
        />
        <View style={{ flex: 1 }}>
          {this.state.recivedBooks.length === 0 ? (
            <View /*style={styles}*/>
              <Text>Unfortunatly You Have Not Recived Any Books</Text>
            </View>
          ) : (
            <FlatList
              keyExtractor={this.keyExtractor}
              renderItem={this.renderItem}
              data={this.state.recivedBooks}
            />
          )}
        </View>
      </View>
    );
  }
}
