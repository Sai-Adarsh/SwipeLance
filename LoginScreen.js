import React, { Component } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, View, TouchableOpacity, Linking } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TextInput } from 'react-native-paper';
import * as firebase from "firebase";
import { LinearGradient } from 'expo-linear-gradient';

class LoginScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: '',
      text: '',
      password: ''
    };
  }

  componentDidMount() {
    const user = firebase.auth();
    firebase.auth().onAuthStateChanged(user => {
      this.props.navigation.navigate(user ? 'Drawer' : 'Login')
    })
  }

  onPressLogin = () => {
    console.log('Inside Login Auth');
    this.state.user = firebase.auth()
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.text, this.state.password)
      .then(() => this.props.navigation.navigate('Drawer'))
      .catch(error => {Alert.alert(
        'Alert',
        error.message,
          [
              {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
              },
              {text: 'OK', onPress: () => console.log('OK Pressed')},
          ]
      )})
  }

  render () {
    return (
      <View style={styles.container}>
        <Image
          style={{height: 100, width: 100}}
          source = {require('./assets/burger.jpg')}
        />
        <Text
          style={{
            fontSize: 25,
            fontWeight: 'bold',
          }}
        >{"\n"}Login{"\n"}</Text>
        <TextInput
          style = {{width: 300, height: 50 }}
          label='Email'
          mode='outlined'
          theme={{
            colors: {
              primary: '#FD297B',
            }
          }}
          selectionColor='#ff9900'
          underlineColor='#ff9900'
          value={this.state.text}
          onChangeText={text => this.setState({ text })}
        />
        <TextInput
          style = {{width: 300, height: 50 }}
          label='Password'
          mode='outlined'
          theme={{
            colors: {
              primary: '#FD297B',
            }
          }}
          secureTextEntry={true}
          selectionColor='#ff9900'
          underlineColor='#ff9900'
          value={this.state.password}
          onChangeText={password => this.setState({ password })}
        />
        <Text style={{color: '#FD297B', textDecorationLine: 'underline'}}
          onPress={() => this.props.navigation.navigate('Signup')}>
          {"\n"}Signup{"\n"}
        </Text>
        <TouchableOpacity
         style = {{
           shadowColor: "#000",
           width: 200,
           shadowOffset: {
             width: 0,
             height: 2,
           },
           shadowOpacity: 0.23,
           shadowRadius: 2.62,
           elevation: 4,
           borderRadius:30,
           backgroundColor:'#ff5576',
         }}
         onPress = {this.onPressLogin}
        >
          <LinearGradient colors={['#FD297B', '#FF655B']} style={styles.button} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }}>
            <Text style={styles.buttonText}> Login </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
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
  postContainer: {
    flex: 1,
    backgroundColor: '#fff',
    height: 650,
    color: '#000',
    alignItems: 'center',
  },
  refreshButton: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    alignItems: 'center',
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    padding: 15,
    borderRadius: 30,
  },
  button: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    alignItems: 'center',
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    padding: 15,
    borderRadius: 30,
    backgroundColor:'#ff5864',
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#fff',
  },
  carouselStretch: {
    height: 150,
    width: 150,
    alignSelf: 'center',
  },
  carouselButton: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    alignItems: 'center',
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    bottom: 50,
    padding: 15,
    borderRadius:30,
    backgroundColor:'#ff5576',
  },
  carouselContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LoginScreen;
