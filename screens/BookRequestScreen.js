import React from "react";

import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TouchableHighlight,
  FlatList,
} from "react-native";

import db from "../config";

import firebase from "firebase";

import MyHeader from "../components/MyHeader";
//import { BookSearch } from "react-native-google-books";
import { BookSearch } from "react-native-google-books";
//import { FlatList } from "react-native-gesture-handler";

export default class BookRequestScreen extends React.Component {
  constructor() {
    super();

    this.state = {
      userId: firebase.auth().currentUser.email,

      bookName: "",

      reasonToRequest: "",

      IsBookRequestActive: "",

      bookStatus: "",

      requestId: "",

      userDocId: "",

      docId: "",

      imageLink: "",

      dataSource: "",

      showFlatList: false,
    };
  }

  createUniqueId() {
    return Math.random().toString(36).substring(7);
  }

  addRequest = async (bookName, reasonToRequest) => {
    var userId = this.state.userId;

    var randomRequestId = this.createUniqueId();

    var books = await BookSearch.searchbook(
      bookName,
      "AIzaSyD2iPo8NPuzRVpIK1T3o2jCdJJK84EzR3E"
    );
    db.collection("requested_books").add({
      user_id: userId,

      book_name: bookName,

      reason_to_request: reasonToRequest,

      request_id: randomRequestId,

      date: firebase.firestore.FieldValue.serverTimestamp,

      imageLink: books.data[0].volumeInfo.imageLinks.smallThumbnail,
    });

    await this.getBookRequest();

    db.collection("users")
      .where("email_id", "==", userId)
      .get()

      .then()

      .then((snapshot) => {
        snapshot.forEach((doc) => {
          db.collection("users").doc(doc.id).update({
            IsBookRequestActive: true,
          });
        });
      });

    this.setState({
      bookName: "",

      reasonToRequest: "",

      requestId: randomRequestId,
    });

    return Alert.alert("Book Requested Successfully");
  };

  receivedBooks = (bookName) => {
    var useId = this.state.userId;

    var requestId = this.state.requestId;

    db.collection("recevied_books").add({
      user_id: useId,

      Book_Name: bookName,

      request_id: requestId,

      bookstatus: "received",
    });
  };

  getIsBookRequestActive = () => {
    db.collection("users")

      .where("email_id", "==", this.state.userId)

      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.setState({
            IsBookRequestActive: doc.data().IsBookRequestActive,

            userDocId: doc.id,
          });
        });
      });
  };

  getBookRequest = () => {
    // getting the requested book

    var bookRequest = db
      .collection("requested_books")

      .where("user_id", "==", this.state.userId)

      .get()

      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.data().book_status !== "received") {
            this.setState({
              requestId: doc.data().request_id,

              requestedBookName: doc.data().book_name,

              bookStatus: doc.data().book_status,

              docId: doc.id,
            });
          }
        });
      });
  };

  sendNotification = () => {
    //to get the first name and last name

    db.collection("users")
      .where("email_id", "==", this.state.userId)
      .get()

      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var name = doc.data().first_name;

          var lastName = doc.data().last_name;

          // to get the donor id and book nam

          db.collection("AllNotifications")
            .where("requestId", "==", this.state.requestId)
            .get()

            .then((snapshot) => {
              snapshot.forEach((doc) => {
                var donorId = doc.data().DonorId;

                var bookName = doc.data().bookName;

                //targert user id is the donor id to send notification to the user

                db.collection("AllNotifications").add({
                  targeted_user_id: donorId,

                  message:
                    name + " " + lastName + " received the book " + bookName,

                  notification_status: "unread",

                  book_name: bookName,
                });
              });
            });
        });
      });
  };

  componentDidMount() {
    this.getBookRequest();

    this.getIsBookRequestActive();
  }

  updateBookRequestStatus = () => {
    //updating the book status after receiving the book

    db.collection("requested_books")
      .doc(this.state.docId)

      .update({
        book_status: "recieved",
      });

    //getting the  doc id to update the users doc

    db.collection("users")
      .where("email_id", "==", this.state.userId)
      .get()

      .then((snapshot) => {
        snapshot.forEach((doc) => {
          //updating the doc

          db.collection("users").doc(doc.id).update({
            IsBookRequestActive: false,
          });
        });
      });
  };

  getBookApi = async (bookName) => {
    this.setState({
      bookName: bookName,
    });

    if (bookName.lenght > 2) {
      var books = await BookSearch.searchbook(
        bookName,
        "AIzaSyD2iPo8NPuzRVpIK1T3o2jCdJJK84EzR3E"
      );
      this.setState({
        dataSource: books.data,
        showFlatList: true,
      });
    }
  };

  renderItem = ({ item, i }) => {
    let objects = {
      title: item.volumeInfo.title,
      selfLink: item.selfLink,
      buyLink: item.saleInfo.buyLink,
      imageLink: item.volumeInfo.imageLinks,
    };
    return (
      <View>
        <TouchableHighlight
          activeOpacity={0.85}
          underlayColor={"blue"}
          onPress={() => {
            this.setState({
              showFlatList: false,
              bookName: item.volumeInfo.title,
            });
          }}
          bottomDivider
          style={styles.touchableopacity}
        >
          <Text>{item.volumeInfo.title}</Text>
        </TouchableHighlight>
      </View>
    );
  };

  render() {
    if (this.state.IsBookRequestActive === true) {
      return (
        // Status screen

        <View style={{ flex: 1, justifyContent: "center" }}>
          <View
            style={{
              borderColor: "orange",
              borderWidth: 2,
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
              margin: 10,
            }}
          >
            <Text>Book Name</Text>

            <Text>{this.state.requestedBookName}</Text>
          </View>

          <View
            style={{
              borderColor: "orange",
              borderWidth: 2,
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
              margin: 10,
            }}
          >
            <Text> Book Status </Text>

            <Text>{this.state.bookStatus}</Text>
          </View>

          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: "orange",
              backgroundColor: "orange",
              width: 300,
              alignSelf: "center",
              alignItems: "center",
              height: 30,
              marginTop: 30,
            }}
            onPress={() => {
              this.sendNotification();

              this.updateBookRequestStatus();

              this.receivedBooks(this.state.requestedBookName);
            }}
          >
            <Text>I recieved the book </Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        // Form screen

        <View style={{ flex: 1 }}>
          <MyHeader title="Request Book" navigation={this.props.navigation} />

          <KeyboardAvoidingView style={styles.keyBoardStyle}>
            <TextInput
              style={styles.formTextInput}
              placeholder={"enter book name"}
              onChangeText={(text) => {
                this.getBookApi(text);
              }}
              onClear={(text) => {
                this.getBookApi("");
              }}
              value={this.state.bookName}
            />

            {this.state.showFlatList ? (
              <FlatList
                data={this.state.dataSource}
                renderItem={this.state.renderItem}
                keyExtractor={(item, index) => {
                  toString();
                }}
                enableEmptySections={true}
              />
            ) : (
              <View>
                <TextInput
                  style={[styles.formTextInput, { height: 300 }]}
                  multiline
                  numberOfLines={8}
                  placeholder={"Why do you need the book"}
                  onChangeText={(text) => {
                    this.setState({
                      reasonToRequest: text,
                    });
                  }}
                  value={this.state.reasonToRequest}
                />
              </View>
            )}

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.addRequest(
                  this.state.bookName,
                  this.state.reasonToRequest
                );
              }}
            >
              <Text>Request</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  keyBoardStyle: {
    flex: 1,

    alignItems: "center",

    justifyContent: "center",
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

  button: {
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
  touchableopacity: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
    width: "90%",
  },
});
