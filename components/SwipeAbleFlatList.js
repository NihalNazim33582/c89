import React, { Component } from "react";
import { Header, Icon, Badge, ListItem } from "react-native-elements";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Dimensions,
  Animated,
} from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import firebase from "firebase";
import db from "../config";

export default class SwipeAbleFlatList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      AllNotifications: this.props.AllNotifications,
    };
  }

  onSwipeValueChange = swipeData => {
    var AllNotifications = this.state.AllNotifications;
    const { key, value } = swipeData;
    if (value < -Dimensions.get("window").width) {
      const newData = [...AllNotifications];
      this.UpdateReadNotifications(Notification[key]);
      newData.splice(key, 1);
      this.setState({
        AllNotifications: newData,
      });
    }
  };

  UpdateReadNotifications = (Notification) => {
    db.collection("AllNotifications").doc(Notification.doc_id).update({
      Notification: "Read",
    });
  };

  renderItem = (data) => {
    <Animated.View>
    <ListItem
      leftElement={<Icon name={"book"} type={"font-awesome"} />}
      title={data.item.bookName}
      titleStyle={{ color: "black", fontWeight: "bold" }}
      subtitle={data.item.message}
      bottomDivider
    />;
    </Animated.View>
  };

  renderHiddenItem = () => {
    <View style={styles.rowBack}>
      <View style={[styles.backRightBtn, styles.backRightBtnRight]}>
        <Text style={styles.backTextWhite}>Mark As Read</Text>
      </View>
    </View>;
  };

  render() {
    return (
      <View style={styles.container}>
        <SwipeListView
          disableRightSwipe
          data={this.state.AllNotifications}
          renderHiddenItem={this.renderHiddenItem}
          renderItem={this.renderItem}
          rightOpenValue={-Dimensions.get("window").width}
          previewRowKey={"0"}
          previewOpenValue={-40}
          previewOpenDelay={3000}
          onSwipeValueChange={this.onSwipeValueChange}
          keyExtractor={(item,index)=>index.toString()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { backgroundColor: "white", flex: 1 },
  backTextWhite: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 15,
    textAlign: "center",
    alignSelf: "flex-start",
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: "#29b6f6",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: 100,
  },
  backRightBtnRight: { backgroundColor: "#29b6f6", right: 0 },
});
