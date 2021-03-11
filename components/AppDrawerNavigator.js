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

import db from "../config";
import firebase from "firebase";
import MyDonation from '../screens/MyDonationScreen'
import { AppTabNavigator } from "./AppTabNavigator";
import { createDrawerNavigator } from "react-navigation-drawer";
import CustomSideBar from "./CustomSideBarMenu";
import Settings from "../screens/Settings";
import Notification from '../screens/Notifcation';
import BooksRiceved from '../screens/MyRecivedBooks'

export const DrawerNavigator = createDrawerNavigator(
  {
    Home: { screen: AppTabNavigator },
    Settings: { screen: Settings },
    MyDonation:{screen: MyDonation},
    Notification:{screen: Notification},
    BooksRiceved:{screen: BooksRiceved},
  },
  { contentComponent: CustomSideBar },
  { initialRouteName: "Home" }
);
