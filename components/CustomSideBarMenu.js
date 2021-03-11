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

import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import { DrawerItems } from "react-navigation-drawer";
import { Avatar } from "react-native-elements";
import db from "../config";
import firebase from "firebase";

export default class CustomSideBar extends React.Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      proflieName: "",
      docId: "",
      image: "#",
    };
  }

  getUserProflieName = () => {
    db.collection("users")
      .where("email_id", "==", this.state.userId)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.setState({
            proflieName: doc.data().first_name + doc.data().last_name,
            docId: doc.id,
            image: doc.data().image,
          });
        });
      });
  };

  selectAPicture = async () => {
    const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!cancelled) {
      this.uploadAnImage(uri, this.state.userId);
    }
  };

  /*selectAPicture = async () => {
    const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypesOptions.All,
      allowsEditing: true,
      aspect: [250, 250],
      quality: 1,
    });
    if (!cancelled) {
      this.uplaodAnImage(uri, this.state.userId);
    }
  };*/

  uploadAnImage = async (uri, imageName) => {
    var Image = await fetch(uri);
    var blob = await Image.blob();
    var AddingImageFeild = firebase
      .storage()
      .ref()
      .child("UserProflieImage/" + imageName);
    return AddingImageFeild.put(blob).then((Response) => {
      this.fetchImage(imageName);
    });
  };

  fetchImage = (imageName) => {
    var data = firebase
      .storage()
      .ref()
      .child("UserProflieImage/"+ imageName);
    data.getDownloadURL().then((uri) => {
      this.setState({
        image: uri,
      });
    });
  };

  componentDidMount = () => {
    this.getUserProflieName();
  };

  render() {
    return (
      <View style={styles.container}>
        <DrawerItems {...this.props} /*style={styles.DrawerItemsContainer}*/ />
        <View
          style={{ flex: 0.5, alignItems: "center", backgroundColor: "orange" }}
        >
          <Avatar
            rounded
            size={"large"}
            source={{
              uri: this.state.image,
            }}
            showEditButton
            onPress={() => {
              this.selectAPicture();
            }}
            containerStyle={styles.imageContainer}
          ></Avatar>
          <Text style={{ fontWeight: "100", fontSize: 20, paddingTop: 10 }}>
            {this.state.name}
          </Text>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate("WelcomeScreen");
              firebase.auth().signOut();
            }}
            style={styles.logOutButton}
          >
            <Text style={styles.logOutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  DrawerItemsContainer: { flex: 0.8 },
  logOutButton: {
    height: 30,
    width: "100%",
    justifyContent: "center",
    padding: 10,
    marginTop: 300,
  },
  logOutText: { fontSize: 25, fontWeight: "bold" },
  imageContainer: {
    flex: 0.75,
    width: "40%",
    height: "20%",
    marginLeft: 20,
    marginTop: 30,
    borderRadius: 40,
  },
});
