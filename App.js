import React, { Component } from 'react';
import { ScrollView, TouchableOpacity, StyleSheet, Button, Text, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DrawerScreen from './DrawerScreen.js';

class App extends Component {
  render () {
    return (
        <DrawerScreen />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    color: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


export default App;
