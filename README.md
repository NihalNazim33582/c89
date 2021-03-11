# book-santa-stage-3
Stage -3



import React from "react";
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import db from "../config";
import firebase from "firebase";
import MyHeader from "../components/MyHeader";

export default class BookRequestScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      bookName: "",
      reasonToRequest: "",
      isBookRequestActingOrNot: "",
      requestedBookName: "",
      request_id: "",
      userDocId: "",
      docId: "",
    };
  }

  createUniqueId() {
    return Math.random().toString(36).substring(7);
  }

  addRequest = async (bookName, reasonToRequest) => {
    var userId = this.state.userId;
    var randomRequestId = this.createUniqueId();
    db.collection("requested_books").add({
      user_id: userId,
      book_name: bookName,
      reason_to_request: reasonToRequest,
      request_id: randomRequestId,
      //bookStatus: "requested",
    //  date: firebase.firestore.FieldValue.serverTimestamp(),
    });

    await this.getBookRequest();
    db.collection("users")
      .where("emailId", "==", userId)
      .get()
      .then()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          db.collection("users").doc(doc.id).update({
            isBookRequestActingOrNot: true,
          });
        });
      });

    this.setState({
      bookName: "",
      reasonToRequest: "",
      request_Id: randomRequestId,
    });

    return Alert.alert("Book Requested Successfully");
  };

  reciveBooks = (bookName) => {
    var userId = this.state.userId;
    var requestId = this.state.request_id;
    db.collection("recivedBooks").add({
      user_id: userId,
      book_name: bookName,
      request_id: requestId,
      bookStatus: "recived",
    });
  };

  getIsBookActive = () => {
    db.collection("users")
      .where("emailId", "==", this.state.userId)
      .onSnapshot((querySnapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            isBookRequestActingOrNot: doc.data().isBookRequestActingOrNot,
            userDocId: doc.id,
          });
        });
      });
  };

  getBookRequest = () => {
    var getBookRequestData = db
      .collection("requested_books")
      .where("user_id", "==", this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.data().bookStatus !== "recived") {
            this.setState({
              request_id: doc.data().request_id,
              requestedBookName: doc.data().book_name,
              bookStatus: doc.data().bookStatus,
              docId: doc.id,
            });
          }
        });
      });
  };

  sendNotification = () => {
    db.collection("users")
      .where("email_id", "==", this.state.userId)
      .get()
      .then((snapshot) => {
        var Name = doc.data().first_name;
        var lastName = doc.data().last_name;
        db.collection("AllNotifications")
          .where("requestId", "==", this.state.request_id)
          .then((snapshot) => {
            var DonorsName = doc.data().DonorId;
            var bookName = doc.data().bookName;

            db.collection("AllNotifications").add({
              tragetedUserId: DonorsName,
              message: Name + "" + lastName + "Recived The Book" + bookName,
              notificcation: "Unread",
              bookName: bookName,
            });
          });
      });
  };

  componentDidMount = () => {
    this.getIsBookActive();
    this.getBookRequest();
  };

  updateBookRequestStatus = () => {
    db.collection("requested_books").doc(this.state.docId).update({
      bookStatus: "recived",
    });

    db.collection("users")
      .where("emailId", "==", this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          db.collection("users").doc(doc.id).update({
            isBookRequestActingOrNot: false,
          });
        });
      });
  };

  render() {
    if (this.state.isBookRequestActingOrNot === true) {
      return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <View>
            <Text> BooK Name</Text>
            <Text>{this.state.requestedBookName}</Text>
          </View>
          <View>
            ∏<Text>Book State</Text>
            <Text>{this.state.bookStatus}</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              this.sendNotification();
              this.updateBookRequestStatus();
              this.reciveBooks(this.state.requestedBookName);
            }}
          >
            <Text>I Reacived The Book.</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1 }}>
          <MyHeader title="Request Book" />
          <KeyboardAvoidingView style={styles.keyBoardStyle}>
            <TextInput
              style={styles.formTextInput}
              placeholder={"enter book name"}
              onChangeText={(text) => {
                this.setState({
                  bookName: text,
                });
              }}
              value={this.state.bookName}
            />
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
});



