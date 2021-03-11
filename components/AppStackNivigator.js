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
import { createStackNavigator } from "react-navigation-stack";
import BookDonateScreen from "../screens/BookDonateScreen";
import RecieverDeatils from "../screens/RecieverDetailsScreen";
import MyHeader from "../components/MyHeader";
import db from "../config";
import firebase from "firebase";

export const AppStackNavigator = createStackNavigator({
  BookDonateList: {
    screen: BookDonateScreen,
    navigationOptions: {
      headerShown: false,
    },
  },
  RecieverDetails: {
    screen: RecieverDeatils,
    navigationOptions: {
      headerShown: false,
    },
  },
});
