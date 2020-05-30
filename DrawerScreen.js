import React, { Component } from 'react';
import { Dimensions, Modal, ToastAndroid, Linking, ScrollView, Image, TouchableOpacity, StyleSheet, Button, Text, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Icon } from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as firebase from "firebase";
import { TextInput } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import Carousel from 'react-native-snap-carousel';
import _ from 'lodash';
import { Overlay } from 'react-native-elements';
import RNPickerSelect from 'react-native-picker-select';
import  SignupScreen from './SignupScreen.js';
import LoginScreen from './LoginScreen.js';
import { SimpleCard } from "@paraboly/react-native-card";

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};
const SLIDER_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);
const ITEM_HEIGHT = Math.round(ITEM_WIDTH * 3 / 4);

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

class StackScreen extends Component {
  render () {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen
          options={{
            headerShown: false,
            headerStyle: {
              backgroundColor: '#00AA13',
              shadowColor: 'transparent',
              elevation: 0,
            },
            headerTintColor: '#fff',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              //paddingBottom: 10
            },
            headerLeft: () => (
            <TouchableOpacity
                onPress={() => this.props.navigation.openDrawer()}
             >
             <MaterialCommunityIcons name="text-short" style={{/*paddingBottom: 50, */paddingLeft: 30, color: '#fff'}} size={40} />
            </TouchableOpacity>

            ),
          }}
          name="Welcome"
          component={WelcomeScreen}
        />
      </Stack.Navigator>
    );
  }
}

class WelcomeScreen extends Component {
  constructor(props) {
    super(props)
    this.refreshListings = this.refreshListings.bind(this);
    this.state = {
      activeIndex:0,
      isVisible: false,
      arrData: [],
      filterName: '',
    };
  }

  _renderItem({item, index}){
       return (
         <View style={{
             backgroundColor:'floralwhite',
             borderRadius: 10,
             height: 500,
             shadowColor: "#000",
             shadowOffset: {
               width: 0,
               height: 6,
             },
             shadowOpacity: 0.39,
             shadowRadius: 8.30,
             elevation: 13,
             backgroundColor: '#fff',
             padding: 50,
             marginLeft: 25,
             marginRight: 25 }}>
           <Text style={{fontSize: 25, fontWeight: 'bold', alignSelf: 'center', textAlign: 'center', textAlign: 'center'}}>{item.name}</Text>
           <Text style={{fontSize: 14, fontWeight: 'bold', alignSelf: 'center', textAlign: 'center'}}>{item.text}</Text>
           <Text style={{fontSize: 25, fontWeight: 'bold', alignSelf: 'center', color: '#00AA13', textAlign: 'center'}}>₹ {item.price}</Text>
           <Text style={{fontSize: 14, fontWeight: 'bold', alignSelf: 'center', textAlign: 'center'}}>per hour</Text>
           <Text>{"\n"}</Text>
           <Image
                style={styles.carouselStretch}
                source={require('./assets/programmer.png')}
            />
           <Text>{"\n"}</Text>
           <TouchableOpacity
            style = {{
              shadowColor: "#000",
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
            onPress = { () => {
              Linking.openURL(`tel:${item.mobilenumber}`)
              }
            }
           >
             <LinearGradient colors={['#FD297B', '#FF655B']} style={styles.button} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }}>
               <MaterialCommunityIcons name="phone" style={{color: '#fff'}} size={20}/>
             </LinearGradient>
           </TouchableOpacity>
         </View>
       )
   }

  refreshListings() {
     firebase.database().ref('sampleData').once('value', snapshot => {
           var items = [];
           snapshot.forEach((child) => {
             items.push({
                email: firebase.auth().currentUser.email,
                name: child.val().name,
                text: child.val().text,
                price: child.val().price,
                mobilenumber: child.val().mobilenumber,
             });
          this.setState({ arrData: items});
        });
      });
    }

  componentDidMount() {
    this.refreshListings();
  }

  displayModal(show){
    this.setState({isVisible: show})
  }

  render () {
    let filterName = this.state.filterName;
    let returnDefault = this.state.arrData;
    let filteredItems = _.filter(this.state.arrData, function(o) {
        return o.text.toLowerCase().includes(filterName.toLowerCase());
    });
    return  (
      <View style={styles.carouselContainer}>
          <Text>{"\n"}</Text>
          <Modal
            style = {{
              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            swipeDirection='left'
            swipeThreshold={90}
            onSwipeComplete={() => this.displayModal(!this.state.isVisible)}
            animationType = {"slide"}
            transparent={false}
            visible={this.state.isVisible}
            onRequestClose={() => {
                this.displayModal(!this.state.isVisible);
            }}>
              <TouchableOpacity
               style = {{
                 shadowColor: "#000",
                 top: 10,
                 left: -160,
                 alignSelf: 'center',
                 borderRadius:30,
               }}
               onPress = { () => {
                 this.displayModal(!this.state.isVisible);
                 }
               }
              >
                <LinearGradient colors={['#FFF', '#FFF']} style={styles.refreshButton} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }}>
                  <MaterialCommunityIcons name="close" style={{color: '#000'}} size={20} />
                </LinearGradient>
              </TouchableOpacity>
              <Text>{"\n\n\n\n\n\n"}</Text>
              <Image
                source={require('./assets/programmer.png')}
                style = { styles.carouselStretch }/>
              <Text
                style={{
                  alignSelf: 'center'
                }}
              >{"\n"}Filter based on skills</Text>
              <TextInput
                style = {{width: 350, height: 50, textAlignVertical: "top", alignSelf: 'center'}}
                mode='outlined'
                label='Skills'
                multiline={true}
                type='outlined'
                theme={{
                  colors: {
                    primary: '#FD297B',
                  }
                }}
                selectionColor='#ff9900'
                underlineColor='#ff9900'
                value={this.state.filterName}
                onChangeText={filterName => this.setState({ filterName })}
                />
              <Text>{"\n"}</Text>
              <TouchableOpacity
               style = {{
                 shadowColor: "#000",
                 alignSelf: 'center',
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
               onPress = { () => {
                 ToastAndroid.show("Updating...", ToastAndroid.SHORT);
                 this.displayModal(!this.state.isVisible);
                 }
               }
              >
                <LinearGradient colors={['#FD297B', '#FF655B']} style={styles.button} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }}>
                  <Text style={styles.buttonText}> Apply filter </Text>
                </LinearGradient>
              </TouchableOpacity>
          </Modal>
          <TouchableOpacity
           style = {{
             top: 0, bottom: 0, left: -150, right: 0,
             shadowColor: "#000",
             shadowOffset: {
               width: 0,
               height: 2,
             },
             shadowOpacity: 0.23,
             shadowRadius: 2.62,
             elevation: 4,
             borderRadius:30,
           }}
           onPress={() => this.props.navigation.openDrawer()}
          >
            <LinearGradient colors={['#FFF', '#FFF']} style={styles.refreshButton} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }}>
              <MaterialCommunityIcons name="menu" style={{color: '#000'}} size={20} />
            </LinearGradient>
          </TouchableOpacity>
          <Text>{"\n"}</Text>
          <Carousel
            loop={true}
            layout={"stack"}
            ref={ref => this.carousel = ref}
            data={filteredItems}
            sliderWidth={350}
            itemWidth={350}
            renderItem={this._renderItem}
            onSnapToItem = { index => this.setState({ activeIndex:index }) }
          />
          <View style = {{
            flex: 1,
            top: -20,
            bottom: 0,
            left: 0,
            right: 0,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <View style= {{padding: 3}}>
              <TouchableOpacity
               style = {{
                 shadowColor: "#000",
                 shadowOffset: {
                   width: 0,
                   height: 2,
                 },
                 shadowOpacity: 0.23,
                 shadowRadius: 2.62,
                 elevation: 4,
                 borderRadius:30,
               }}
               onPress = { () => {
                  ToastAndroid.show("Refreshing...", ToastAndroid.SHORT);
                  this.refreshListings;
                }
               }
              >
                <LinearGradient colors={['#FFF', '#FFF']} style={styles.refreshButton} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }}>
                  <MaterialCommunityIcons name="refresh" style={{color: '#000'}} size={20}/>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            <View style= {{padding: 3}}>
              <TouchableOpacity
               style = {{
                 shadowColor: "#000",
                 shadowOffset: {
                   width: 0,
                   height: 2,
                 },
                 shadowOpacity: 0.23,
                 shadowRadius: 2.62,
                 elevation: 4,
                 borderRadius:30,
               }}
               onPress = {() => {
                 this.displayModal(true);
               }}
              >
                <LinearGradient colors={['#FFF', '#FFF']} style={styles.refreshButton} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }}>
                  <MaterialCommunityIcons name="filter" style={{color: '#7F00FF'}} size={20}/>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
      </View>
    );
  }
}

class IceCreamStackScreen extends Component {
  render () {
    return (
      <Stack.Navigator
      >
        <Stack.Screen
          options={{
            headerShown: true,
            headerStyle: {
              backgroundColor: '#00AA13',
            },
            headerTintColor: '#fff',
            headerLeft: () => (
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack(null)}
            >
             <MaterialCommunityIcons name="arrow-left" size={26} style={{paddingLeft: 25, color: '#FFF'}}/>
            </TouchableOpacity>

            ),
          }}
          name="Profile"
          component={IceCreamScreen}
        />
      </Stack.Navigator>
    );
  }
}

class IceCreamScreen extends Component {

  constructor(props) {
    super(props)
    this.refreshListings = this.refreshListings.bind(this);
    this.state = {
      activeIndex:0,
      isVisible: false,
      arrData: [],
      filterName: '',
    };
  }

  _renderItem({item, index}){
       return (
         <View style={{
             flex: 1,
             width: ITEM_WIDTH,
             height: ITEM_HEIGHT,
             alignItems: 'center',
             justifyContent: 'center',
             backgroundColor:'#000',
             borderRadius: 10,
             shadowColor: "#000",
             shadowOffset: {
               width: 0,
               height: 6,
             },
             shadowOpacity: 0.39,
             shadowRadius: 8.30,
             elevation: 13,
           }}>
           <LinearGradient colors={['#000', '#000']} style={{
             flex: 1,
             width: ITEM_WIDTH,
             height: ITEM_HEIGHT,
             alignItems: 'center',
             justifyContent: 'center',
             borderRadius: 10,
             shadowColor: "#000",
             shadowOffset: {
               width: 0,
               height: 6,
             },
             shadowOpacity: 0.39,
             shadowRadius: 8.30,
             elevation: 13,
           }} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }}>
           <Text style={{color: '#FFF', fontSize: 25, fontWeight: 'bold', alignSelf: 'center', textAlign: 'center'}}>{item.name}</Text>
           <Text style={{color: '#FFF', fontWeight: 'bold', fontSize: 14, alignSelf: 'center', textAlign: 'center'}}>{item.text}</Text>
           <Text style={{fontSize: 25, fontWeight: 'bold', alignSelf: 'center', color: '#edc295', textAlign: 'center'}}>₹ {item.price}</Text>
           <Text style={{color: '#FFF', fontSize: 14, fontWeight: 'bold', alignSelf: 'center', textAlign: 'center'}}>per hour</Text>
           <Text>{"\n"}</Text>
           <Image
                style={{
                  height: 100,
                  width: 100,
                  alignSelf: 'center',
                }}
                source={require('./assets/programmer.png')}
            />
           <Text>{"\n"}</Text>
           <TouchableOpacity
            style = {{
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.23,
              shadowRadius: 2.62,
              elevation: 4,
              borderRadius:30,
            }}
            onPress = { () => {
              let userRef = firebase.database().ref('sampleData/' + item.key);
              userRef.remove();
            }}
           >
             <LinearGradient colors={['#e2a868', '#ecc397']} style={styles.refreshButton} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }}>
               <MaterialCommunityIcons name="delete" style={{color: '#000'}} size={20}/>
             </LinearGradient>
           </TouchableOpacity>
           </LinearGradient>
         </View>
       )
   }

  refreshListings() {
     firebase.database().ref('sampleData').once('value', snapshot => {
           var items = [];
           snapshot.forEach((child) => {
             items.push({
                key: child.key,
                email: child.val().email,
                name: child.val().name,
                text: child.val().text,
                price: child.val().price,
                mobilenumber: child.val().mobilenumber,
             });
          this.setState({ arrData: items});
        });
      });
    }

  componentDidMount() {
    this.refreshListings();
  }

  onPressLogout = () => {
    ToastAndroid.show("Logging out...", ToastAndroid.SHORT);
    setTimeout(
      function() {
        try {
          firebase.auth().signOut();
          this.props.navigation.navigate('Login');
        } catch (e) {
          console.log(e);
        }
      }, 2000);
  }

  render () {
    let filteredItems = _.filter(this.state.arrData, function(o) {
        return o.email == firebase.auth().currentUser.email;
    });
    return  (
      <ScrollView>
      <View style={styles.container}>
        <Text>{"\n"}</Text>
        <TouchableOpacity>
          <Image
               style={{
                 width: 100,
                 height: 100,
               }}
               source={require('./assets/avatar.png')}
           />
         </TouchableOpacity>
         <Text>{"\n"}</Text>
         <Text style = {{
           fontWeight: 'bold',
           fontSize: 20,
           color: '#3d3d3d',
         }}>{firebase.auth().currentUser.email}
         </Text>
         <Text style={{fontWeight: 'bold', color: '#3d3d3d'}}>{"\n"}My listings{"\n"}</Text>
         <TouchableOpacity
          style = {{
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.23,
            shadowRadius: 2.62,
            elevation: 4,
            borderRadius:30,
          }}
          onPress = { () => {
            ToastAndroid.show("Refreshing...", ToastAndroid.SHORT);
            this.refreshListings;
            }
          }

         >
           <LinearGradient colors={['#FFF', '#FFF']} style={styles.refreshButton} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }}>
             <MaterialCommunityIcons name="refresh" style={{color: '#000'}} size={20}/>
           </LinearGradient>
         </TouchableOpacity>
        <View
          style={{
            padding: 20,
            height: 400,
          }}>
        <Carousel
          loop={false}
          layout={"default"}
          ref={ref => this.carousel = ref}
          data={filteredItems}
          renderItem={this._renderItem}
          sliderWidth={SLIDER_WIDTH}
          itemWidth={ITEM_WIDTH}
          renderItem={this._renderItem}
          onSnapToItem = { index => this.setState({ activeIndex:index }) }
        />
        </View>
        <Text>{"\n"}</Text>
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
         onPress={this.onPressLogout}
        >
          <LinearGradient colors={['#FD297B', '#FF655B']} style={styles.button} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }}>
            <Text style={styles.buttonText}> Logout </Text>
          </LinearGradient>
        </TouchableOpacity>
      <Text>{"\n\n"}</Text>
      </View>
      </ScrollView>
    );
  }
}

class PostStackScreen extends Component {
  render () {
    return (
      <Stack.Navigator
      >
        <Stack.Screen
          options={{
            headerShown: true,
            headerStyle: {
              backgroundColor: '#00AA13',
            },
            headerTintColor: '#fff',
            headerLeft: () => (
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack(null)}
            >
             <MaterialCommunityIcons name="arrow-left" size={26} style={{paddingLeft: 25, color: '#FFF'}}/>
            </TouchableOpacity>

            ),
          }}
          name="Post a listing"
          component={PostScreen}
        />
      </Stack.Navigator>
    );
  }
}

class PostScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      text: '',
      price: '',
      mobilenumber: '',
    };
  }

  componentDidMount() {
    this.setState({name: '', text: '', price: '', mobilenumber: ''});
  }

  pushSampleData () {
    ToastAndroid.show("Updating...", ToastAndroid.SHORT);
    const data = {
      'email': firebase.auth().currentUser.email,
      'name': this.state.name,
      'text': this.state.text,
      'price': this.state.price,
      'mobilenumber': this.state.mobilenumber
    };
    const db = firebase.database().ref().child("sampleData").push(data);
    this.setState({name: '', text: '', price: '', mobilenumber: ''});
    const navigateToStack = this.props.navigation.navigate('Stack');
  }
  render () {
    return (
      <ScrollView
        keyboardShouldPersistTaps='always'
      >
      <View style={styles.postContainer}>
        <Text>{"\n\n"}</Text>
        <Image
             style={{
               width: 100,
               height: 100,
             }}
             source={require('./assets/icecream.png')}
         />
        <Text>{"\n"}{"\n"}</Text>
        <Text
          style = {{
            alignSelf: 'center'
          }}
        >Write about yourself</Text>
        <TextInput
          style = {{width: 350, height: 50, textAlignVertical: "top"}}
          mode='outlined'
          label='Full Name'
          multiline={false}
          type='outlined'
          theme={{
            colors: {
              primary: '#FD297B',
            }
          }}
          selectionColor='#ff9900'
          underlineColor='#ff9900'
          value={this.state.name}
          onChangeText={name => this.setState({ name })}
        />
        <TextInput
          style = {{width: 350, height: 50, textAlignVertical: "top"}}
          mode='outlined'
          label='Skills'
          placeholder='Top 3 skills...'
          multiline={false}
          type='outlined'
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
          keyboardType = 'numeric'
          style = {{width: 350, height: 50, textAlignVertical: "top"}}
          mode='outlined'
          multiline={false}
          label='Price per hour'
          theme={{
            colors: {
              primary: '#FD297B',
            }
          }}
          selectionColor='#ff9900'
          underlineColor='#ff9900'
          value={this.state.price}
          onChangeText={price => this.setState({ price })}
        />
        <TextInput
          keyboardType = 'numeric'
          style = {{width: 350, height: 50, textAlignVertical: "top"}}
          mode='outlined'
          multiline={false}
          label='Mobile number'
          theme={{
            colors: {
              primary: '#FD297B',
            }
          }}
          selectionColor='#ff9900'
          underlineColor='#ff9900'
          value={this.state.mobilenumber}
          onChangeText={mobilenumber => this.setState({ mobilenumber })}
        />
        <Text>{"\n"}</Text>
        <TouchableOpacity
                  style = {{
                    shadowColor: "#000",
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
                  onPress={() => this.pushSampleData()}
               >
          <LinearGradient colors={['#FD297B', '#FF655B']} style={styles.refreshButton} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }}>
            <Text style={styles.buttonText}> Post a listing </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      </ScrollView>
    );
  }
}

class InviteStackScreen extends Component {
  render () {
    return (
      <Stack.Navigator
      >
        <Stack.Screen
          options={{
            headerShown: true,
            headerStyle: {
              backgroundColor: '#00AA13',
            },
            headerTintColor: '#fff',
            headerLeft: () => (
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack(null)}
            >
             <MaterialCommunityIcons name="arrow-left" size={26} style={{paddingLeft: 25, color: '#FFF'}}/>
            </TouchableOpacity>

            ),
          }}
          name="Invite"
          component={InviteScreen}
        />
      </Stack.Navigator>
    );
  }
}

class InviteScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msg: 'Facing issues while doing intern tasks? Install SwipeLance to find available fellow students to help you complete microtasks. Referral Code: ' + firebase.auth().currentUser.email,
    };
  }

  sendOnWhatsApp=() => {
    let msg = this.state.msg;
    if(msg){
      let url = 'whatsapp://send?text=' + this.state.msg;
      Linking.openURL(url).then((data) => {
        console.log('WhatsApp Opened');
      });
    }
  }

  render () {
    return  (
      <View style={styles.container}>
        <Text style = {{fontSize: 14, color: '#3d3d3d', alignSelf: 'center', fontWeight: 'bold'}}>Friends stranded with intern tasks?</Text>
        <Text style = {{fontSize: 20, alignSelf: 'center', fontWeight: 'bold', color: '#ff1100'}}>Help your friends & get rewarded!{"\n"}</Text>
        <Image
             style={{
               width: 400,
               height: 264,
             }}
             source={require('./assets/referal.jpg')}
         />
        <Text>{"\n"}</Text>
        <TouchableOpacity
                  style = {{
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    width: 200,
                    shadowOpacity: 0.23,
                    shadowRadius: 2.62,
                    elevation: 4,
                    borderRadius:30,
                    backgroundColor:'#ff5576',
                  }}
                  onPress = {this.sendOnWhatsApp}
               >
          <LinearGradient colors={['#17b850', '#19b749']} style={styles.button} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }}>
            <Text style={styles.buttonText}> Invite and earn </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }
}

class HomeScreen extends Component {
  render () {
    return (
      <Tab.Navigator
        initialRouteName="Stack"
        tabBarOptions={{
          activeTintColor: '#FD297B',
        }}
      >
        <Tab.Screen name="Stack" component={StackScreen}
          options= {{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen name="Post" component={PostStackScreen}
          options= {{
            tabBarLabel: 'Post',
            tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="grease-pencil" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen name="Invite" component={InviteStackScreen}
          options= {{
            tabBarLabel: 'Invite',
            tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="card-bulleted" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen name="Dash" component={IceCreamStackScreen}
          options= {{
            tabBarLabel: 'Profile',
            tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="account" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }
}

class DeveloperStackScreen extends Component {
  render () {
    return (
      <Stack.Navigator
      >
        <Stack.Screen
          options={{
            headerShown: true,
            headerStyle: {
              backgroundColor: '#00AA13',
            },
            headerTintColor: '#fff',
            headerLeft: () => (
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack(null)}
            >
             <MaterialCommunityIcons name="arrow-left" size={26} style={{paddingLeft: 25, color: '#FFF'}}/>
            </TouchableOpacity>

            ),
          }}
          name="Developer"
          component={DeveloperScreen}
        />
      </Stack.Navigator>
    );
  }
}

class DeveloperScreen extends Component {

  sendOnMail=() => {
    let subject = "I'd like to contribute"
    let body = "Hey developer, I'd like contribute to the project. Contact me at: " + firebase.auth().currentUser.email;
    let url ='mailto:saiadarshsivakumar@gmail.com?subject=' + subject + '&body=' + body;
    Linking.openURL(url).then((data) => {
      console.log('Mail opened');
    });
  }

  render () {
    return  (
      <View style={styles.container}>
      <TouchableOpacity>
        <Image
             style={{
               borderRadius: 200,
               width: 150,
               height: 150,
             }}
             source={require('./assets/developer.png')}
         />
      </TouchableOpacity>
      <Text>{"\n"}</Text>
      <View style={{ marginTop: 16 }}>
        <SimpleCard titleTextColor="#000" title="This app was developed by Sai Adarsh S from M.Sc Software Systems. Source code copyrights © 2020 FOSSCIT."/>
      </View>
      <Text>{"\n"}</Text>
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
       onPress={this.sendOnMail}
      >
        <LinearGradient colors={['#FD297B', '#FF655B']} style={styles.button} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }}>
          <Text style={styles.buttonText}> Help us scale our servers</Text>
        </LinearGradient>
      </TouchableOpacity>
      </View>
    );
  }
}

class DrawerScreen extends Component {
  constructor(props) {
    super(props);
  }
  render () {
    return (
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen
          name="Home"
          component={HomeScreen}
          options={{
            drawerIcon: ({focused, size}) => (
              <LinearGradient colors={['#17b850', '#19b749']} style={styles.refreshButton} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }}>
                <MaterialCommunityIcons name="home" style={{color: '#FFF'}} size={20}/>
              </LinearGradient>
            ),
          }} />
        <Drawer.Screen
          name="Profile"
          options={{
            drawerIcon: ({focused, size}) => (
            <LinearGradient colors={['#EF4136', '#FBB040']} style={styles.refreshButton} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }}>
              <MaterialCommunityIcons name="account" style={{color: '#FFF'}} size={20}/>
            </LinearGradient>
            ),
          }}>
          { () => (
            <Tab.Navigator
              initialRouteName="Dash"
              tabBarOptions={{
                activeTintColor: '#FD297B',
              }}
            >
              <Tab.Screen name="Stack" component={StackScreen}
                options= {{
                  tabBarLabel: 'Home',
                  tabBarIcon: ({ color, size }) => (
                      <MaterialCommunityIcons name="home" color={color} size={size} />
                  ),
                }}
              />
              <Tab.Screen name="Post" component={PostStackScreen}
                options= {{
                  tabBarLabel: 'Post',
                  tabBarIcon: ({ color, size }) => (
                      <MaterialCommunityIcons name="grease-pencil" color={color} size={size} />
                  ),
                }}
              />
              <Tab.Screen name="Invite" component={InviteStackScreen}
                options= {{
                  tabBarLabel: 'Invite',
                  tabBarIcon: ({ color, size }) => (
                      <MaterialCommunityIcons name="card-bulleted" color={color} size={size} />
                  ),
                }}
              />
              <Tab.Screen name="Dash" component={IceCreamStackScreen}
                options= {{
                  tabBarLabel: 'Profile',
                  tabBarIcon: ({ color, size }) => (
                      <MaterialCommunityIcons name="account" color={color} size={size} />
                  ),
                }}
              />
            </Tab.Navigator>
          )}
        </Drawer.Screen>
        <Drawer.Screen
          name="Invite & Earn"
          options={{
            drawerIcon: ({focused, size}) => (
            <LinearGradient colors={['#7F00FF', '#E100FF']} style={styles.refreshButton} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }}>
              <MaterialCommunityIcons name="card-bulleted" style={{color: '#FFF'}} size={20}/>
            </LinearGradient>
            ),
          }}>
          { () => (
            <Tab.Navigator
              initialRouteName="Invite"
              tabBarOptions={{
                activeTintColor: '#FD297B',
              }}
            >
              <Tab.Screen name="Stack" component={StackScreen}
                options= {{
                  tabBarLabel: 'Home',
                  tabBarIcon: ({ color, size }) => (
                      <MaterialCommunityIcons name="home" color={color} size={size} />
                  ),
                }}
              />
              <Tab.Screen name="Post" component={PostStackScreen}
                options= {{
                  tabBarLabel: 'Post',
                  tabBarIcon: ({ color, size }) => (
                      <MaterialCommunityIcons name="grease-pencil" color={color} size={size} />
                  ),
                }}
              />
              <Tab.Screen name="Invite" component={InviteStackScreen}
                options= {{
                  tabBarLabel: 'Invite',
                  tabBarIcon: ({ color, size }) => (
                      <MaterialCommunityIcons name="card-bulleted" color={color} size={size} />
                  ),
                }}
              />
              <Tab.Screen name="Dash" component={IceCreamStackScreen}
                options= {{
                  tabBarLabel: 'Profile',
                  tabBarIcon: ({ color, size }) => (
                      <MaterialCommunityIcons name="account" color={color} size={size} />
                  ),
                }}
              />
            </Tab.Navigator>
          )}
        </Drawer.Screen>
        <Drawer.Screen
          name="Developer"
          component={DeveloperStackScreen}
          options={{
            drawerIcon: ({focused, size}) => (
              <LinearGradient colors={['#000', '#000']} style={styles.refreshButton} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }}>
                <MaterialCommunityIcons name="github-circle" style={{color: '#FFF'}} size={20}/>
              </LinearGradient>
            ),
          }} />
      </Drawer.Navigator>
    );
  }
}

class LoginDrawerStackScreen extends Component {
  constructor(props) {
    super(props);
  }
  render () {
    return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false
          }}
          >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="Drawer" component={DrawerScreen} />
        </Stack.Navigator>
      </NavigationContainer>
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
    backgroundColor: '#29FF7A',
  },
});

export default LoginDrawerStackScreen;
