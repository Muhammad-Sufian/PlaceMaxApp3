import 'react-native-gesture-handler';
import React,  { useState } from 'react';
import {LogBox, ActivityIndicator, Modal,ScrollView,Animated, Keyboard,Dimensions, KeyboardAvoidingView,TouchableWithoutFeedback, Platform, View,Text, StyleSheet, TextInput, TouchableHighlight, FlatList, Button, Image, TouchableOpacity, ImageBackground, AsyncStorage  } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import MapView from 'react-native-maps';
import ImagePicker from 'react-native-image-picker'

import {addToken} from './Store/action'
import {connect} from 'react-redux'


LogBox.ignoreLogs(['Warning: ...']);
//import Icon from 'react-native-vector-icons/MaterialIcons';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
    

const CustomScreenOptions ={
  headerStyle: {
    backgroundColor: '#fff',
  },
  headerTintColor: 'black',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
  headerLeft: () => (
    <TouchableOpacity onPress={() => this.props.navigation.openDrawer() }>
      <Icon name="reorder" style={{color: 'black', padding: 10, marginLeft:10, fontSize: 30}}/>
    </TouchableOpacity>
  )
}

const CustomDrawerOptions ={
  title: 'Signout',              
  drawerIcon: ({ focused, size }) => (
    <Image
      source={require('./login.png')}
      height={20}
      width={20}
    />
  ),
}



class App extends React.Component{
  render(){
    return (
      <NavigationContainer>
      <Stack.Navigator /*initialRouteName={Login}*/>
      
        <Stack.Screen name="Splash" component={Splash}  
          options={{/*CustomScreenOptions*/  
              headerShown: false
          }}
        />
        <Stack.Screen name="Start" component={Start}  
          options={{/*CustomScreenOptions*/  
              headerShown: false
          }}
        />
      </Stack.Navigator>
      </NavigationContainer>
    )
  }
}


export class Splash extends React.Component{
  state={
    stopanim:false,
    number:0,
    opacity:0,
  }

  anim1=()=>{
    setTimeout(() => {
      this.setState({opacity:this.state.opacity+0.05,number:this.state.number+1})
      if(this.state.number<20){
        this.anim1()}
      else{
        this.anim2()
      }
      }, 50);
      
  }
  anim2=()=>{
    setTimeout(() => {
      this.setState({opacity:this.state.opacity-0.05,number:this.state.number+1})
      if(this.state.opacity>0){
        this.anim2()
      }
      else{
        this.props.navigation.navigate('Start')
      }
      }, 50);
      
  }
  

  componentWillMount=()=>{
    this.anim1()
    
  }
  render(){
    return(
      <>
      <ImageBackground source={require('./splash.jpg')} style={{width:'100%', height: '100%', justifyContent: 'center',alignItems: 'center' }}>
          <View style={{opacity:this.state.opacity,backgroundColor:'purple', alignSelf:'center', borderRadius:30, padding:10}}><Text style={{fontSize:this.state.number,fontWeight:'bold'}}>Add n Search Places</Text></View>
      </ImageBackground>
      </>
    )
  }
}

class Start extends React.Component{
  render(){
    return (
      <>
          <Drawer.Navigator >
            <Drawer.Screen screenOptions={{ gestureEnabled: false }} name="Login" component={Login} options={CustomDrawerOptions}/>
            <Drawer.Screen name="Home" component={Home}/>
          </Drawer.Navigator>
        {/* <DrawerNav/> */}
      </>
    );
  }
}  

const mapStateToProps2 = state => {
  return{
      token: state.token.authToken
  }
}
connect(mapStateToProps2)(App);

export class Login extends React.Component{
  state={
    email:'',
    pw:'',
    confirm_pw:'',
    PwValidationFlag:"false",
    EmailValidationFlag:"false",
    signup_option:true,

    fetchedTok:'',
    mode:'random'
  }

  getTokenFunc=(token)=>{
    this.setState({fetchedTok,token})
  }

  onchangeEmail=(text)=>{
    this.setState({email:text})
    this.EmailValidation(text)
  }
  onchangePw=(text)=>{
    this.setState({pw:text})
    this.PwValidation(text)//because this.state.pw was showing previous state, it will get updated after this method ends.
  }
  onchangeConfirmPW=(text)=>{
    this.setState({confirm_pw:text})
    this.ConfirmPwValidation(text)//because this.state.confirm_pw was showing previous state, it will get updated after this method ends.
    
  }
  EmailValidation=(text)=>{
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text) === false) {
      this.setState({EmailValidationFlag:'false'})
    }
    else {
      this.setState({EmailValidationFlag:'true'})
    }
  }

  ConfirmPwValidation=(pw_to_be_validated)=>{
    if(pw_to_be_validated.length >6)
    {
      if (pw_to_be_validated === this.state.pw)
      {
        this.setState({PwValidationFlag: "true"})
      }
      else{
        this.setState({PwValidationFlag: "false"})
      }
    }
    else{
      this.setState({PwValidationFlag: "false"})
    }
  }
  PwValidation=(pw_to_be_validated)=>{
    if(pw_to_be_validated.length>6)
    {
      if (pw_to_be_validated === this.state.confirm_pw)
      {
         this.setState({PwValidationFlag: "true"})
      }
      else{
        this.setState({PwValidationFlag: "false"})
      }
    }
    else{
       this.setState({PwValidationFlag: "false"})
    }
    
  }
  accessGranted =()=>{
    this.PwValidation(this.state.pw)
    this.ConfirmPwValidation(this.state.confirm_pw)
    if(this.state.PwValidationFlag==="true"){
      if(this.state.EmailValidationFlag==='true')
      {
        this.authSignup()
      }
      else{
        alert('Access Denied: Email not valid')
      }
    }
    else{
     alert('Access Denied: Password not valid')
    }
  }

  authSignup=()=>{
    fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBLkVvsDOHPmrPMiq_7z9E0YvFzr37ghVI',{
    //fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=AIzaSyBLkVvsDOHPmrPMiq_7z9E0YvFzr37ghVI',{
        method:"POST",
        body:JSON.stringify({
          email:this.state.email,
          password:this.state.pw,
          returnSecureToken:true
        }),
        headers:{
          "Content-Type":"application/json"
        }
    })
    .catch(err=>{
      console.log(err);
      alert("Auth failed")
    })
    .then (res=>res.json())
    .then(parsedRes=>{
      console.log(parsedRes);
      this.props.navigation.navigate('Home')
    })
  }

  authLogin=()=>{
    fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBLkVvsDOHPmrPMiq_7z9E0YvFzr37ghVI',{
    //fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=AIzaSyBLkVvsDOHPmrPMiq_7z9E0YvFzr37ghVI',{
        method:"POST",
        body:JSON.stringify({
          email:this.state.email,
          password:this.state.pw,
          returnSecureToken:true
        }),
        headers:{
          "Content-Type":"application/json"
        }
    })
    .catch(err=>{
      console.log(err);
      alert("Auth failed")
    })
    .then (res=>res.json())
    .then(parsedRes=>{
      if(parsedRes.error!=undefined)
      {
        console.log('Error400: '+parsedRes);
        console.log('code: '+parsedRes.error.code)
        console.log('msg: '+parsedRes.error.message)
        console.log('error: '+parsedRes.error.error)
        // Object.keys(parsedRes).map(key=>
        //   Object.keys(parsedRes[key]).map(key2=>{
        //     console.log(key2)
        //   })
        //   )
      }
      else{
        console.log('Success: '+parsedRes);
        console.log('idToken: '+parsedRes.idToken);
        this._storeData(parsedRes.idToken)
        console.log('email: '+parsedRes.email);
        console.log('name: '+parsedRes.displayName)
        // Object.keys(parsedRes).map(key=>{
        //   console.log('key:'+key)
        //   // Object.keys(parsedRes[key]).map(key2=>{
        //   //   console.log('key2:'+key2)
        //   // })
        // })
        this.props.navigation.navigate('Home')
      }
      
    })
  }

  _storeData = async (token) => {
    try {
      await AsyncStorage.setItem(
        'Token',
         token
      );
    } catch (error) {
      // Error saving data
    }
  };

  

  render(){
    
    return (
      <>
          <ImageBackground source={require('./background.jpg')} style={styles.bgimg}>
             <View style={{backgroundColor:'transparent',flex:1, justifyContent:'center', alignContent:'center'}}>
              {(this.state.signup_option)?
              (
                <>
                <Text style={{backgroundColor:'white',fontSize: 20, width:300, alignSelf:'center'}}>Signup:</Text>
                <TextInput keyboardType="email-address" onChangeText={(text)=>{this.onchangeEmail(text)}} placeholder="Email Address" style={{backgroundColor:'white', fontSize: 20, width:300,  alignSelf:'center', marginTop:10}}></TextInput>
                <TextInput  secureTextEntry={true}  onChangeText={(text)=>{this.onchangePw(text)}} placeholder="Password" style={{backgroundColor:'white',fontSize: 20, width:300,  alignSelf:'center', marginTop:10}}></TextInput>
                <TextInput secureTextEntry={true}  onChangeText={(text)=>{this.onchangeConfirmPW(text)}} placeholder="Confirm your password" style={{backgroundColor:'white',fontSize: 20, width:300,  alignSelf:'center', marginTop:10}}></TextInput>
                <View style={{width: 300, alignSelf:'center', marginTop:10}}><Button onPress={this.accessGranted} title="Signup" color="#4d5c0b"> </Button></View>
                </>
              ):
              (
                <>
                  <Text style={{backgroundColor:'white',fontSize: 20, width:300, alignSelf:'center'}}>Login:</Text>
                  <TextInput keyboardType="email-address" onChangeText={(text)=>{this.onchangeEmail(text)}} placeholder="Email Address" style={{backgroundColor:'white', fontSize: 20, width:300,  alignSelf:'center', marginTop:10}}></TextInput>
                  <TextInput  secureTextEntry={true}  onChangeText={(text)=>{this.onchangePw(text)}} placeholder="Password" style={{backgroundColor:'white',fontSize: 20, width:300,  alignSelf:'center', marginTop:10}}></TextInput>
                  <View style={{width: 300, alignSelf:'center', marginTop:10}}><Button onPress={()=>this.authLogin()} title="Login" color="#4d5c0b"> </Button></View>
                </>
              )
              }
              {(this.state.signup_option)?(<View style={{width: 300, alignSelf:'center', marginTop:10}}><Button onPress={()=>this.setState({signup_option:false})} title="Already registered?" color="blue"> </Button></View>):(<View style={{width: 300, alignSelf:'center', marginTop:10}}><Button onPress={()=>this.setState({signup_option:true})} title="Make an account" color="blue"> </Button></View>)}
              <View style={{width: 300, alignSelf:'center', marginTop:10}}><Button onPress={()=>this.props.navigation.navigate('Home')} title="Break In Hack!" color="purple"> </Button></View>
              {/* <Text style={{fontSize:40}}>Here: {this.props.token}</Text> */}
              
            </View>
          </ImageBackground>
        
      </>
    );
  }
}

const mapStateToProps = state => {
  return{
      token: state.token.authToken
  }
}
connect(mapStateToProps)(Login);



export class Home extends React.Component{
  render(){
    return (
      <>
          <Stack.Navigator /*initialRouteName={Login}*/>
          
            <Stack.Screen name="TabPlace" component={TabPlace}  
            options={{/*CustomScreenOptions*/  
              headerStyle: {
                    backgroundColor: '#fff',
                  },
                  headerTintColor: 'black',
                  headerTitleStyle: {
                    fontWeight: 'bold',
                  },
                  headerLeft: () => (
                    <TouchableOpacity onPress={() => this.props.navigation.openDrawer() }>
                      {/* <Icon name="reorder" style={{color: 'black', padding: 10, marginLeft:10, fontSize: 30}}/> */}
                    </TouchableOpacity>
                  )}}
            
            />
          </Stack.Navigator>
          
      </>
    );
  }
}



export class TabPlace extends React.Component{
  state={
    typed:'',
    list:[],
    id2:0,
    img:'',
    del_id:-1,
    FindPlacesInitiate:0,
    pickedImage:null,
    pickedImageBase64:null,
    pickedImageArray:[],
    latitude: 33.69490881078251,
    longitude: 73.013649878756,
    authToken:'',
    keys_store:[]
  }

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('Token');
      if (value !== null) {
        // We have data!!
        this.setState({authToken:value})
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  fetchDataFromDB=()=>{
    console.log('fetch')
    var objTemp2=[];
    var objTemp1=[];
    var largest_id=0;
    // console.log('before fetch auth=',this.state.authToken)
    // for(let i;i<)
    // if(this.state.authToken)
    //   {
      try{
        fetch("https://places-785e2.firebaseio.com/places.json")
        // fetch("https://places-785e2.firebaseio.com/places.json?auth="+this.state.authToken)
        //.catch(err=>console.log(err))
        .then(res=>res.json())
        .then(parsedRes=>{
          keys=[]
          Object.keys(parsedRes).map(key => {
            objTemp2=[]
            keys=[...keys,{'key':key,'id':parsedRes[key]['id']}]
            Object.keys(parsedRes[key]).map(key2=>{
              
              objTemp2={...objTemp2, [key2]:parsedRes[key][key2]}
              // console.log('key2:'+key2)
            })
            objTemp1=[...objTemp1,objTemp2]
           // console.log('objTmp1_1: ',objTemp1)

            if(largest_id<parsedRes[key].id)
            {
              largest_id=parsedRes[key].id
            }
            
          })
        //console.log('objTmp1_2: ', objTemp1)
        this.setState({list:[...this.state.list,...objTemp1], id2:largest_id+1,keys_store:keys})
        //console.log('fetchdata list:', this.state.list)
        console.log('largest_id: ',largest_id)
        //console.log('keys: ');keys.map(item=>console.log(item))
        })
      }catch(error){
        console.log('catched: ',error)
      }
    // }
    // else{
    //   console.log('dont exists')
    //   this._retrieveData
    // }
    
  }

  deleteDataAPICall=(delete_id)=>{
    let delete_key=this.state.keys_store.filter((item)=>{return item.id == delete_id })
    console.log('deletekey: ',delete_key[0].key)
    fetch("https://places-785e2.firebaseio.com/places/"+delete_key[0].key+".json", {
            method: "DELETE"
        })
        .catch(err => {
            alert("Something went wrong, sorry :/");
            console.log(err);
        })
        .then(res => res.json())
        .then(parsedRes => {
            console.log("Done!");
        });
    this.setState({keys_store:this.state.keys_store.filter((item)=>{return item.id != delete_id })})
  }

  getData=()=>{
      var objTemp2=[];
      fetch("https://places-785e2.firebaseio.com/places.json")
      .catch(err=>{
        alert("Something went wrong")
      })
      .then(res=>res.json())
      .then(parsedRes=>{
        Object.keys(parsedRes).map(key => {objTemp2.push(parsedRes[key]); console.log('key:'+key)})
        }
      )
  }

  getLocFromChild=(long,lati)=>{
    this.setState({longitude:long, latitude:lati})
    console.log("getLocFromChild: long="+long+ ", lati="+lati)
  }
  onChangehandler=(text)=>{
    this.setState({typed:text})
  }
  pickImageHandler=()=>{
    ImagePicker.showImagePicker({title:"Pick an Image", maxWidth:600, maxHeight:400},res=>{
      if(res.didCancel){
        console.log("User cancelled!");
      }
      else if (res.error){
        console.log("Error", res.error)
      }
      else{
        this.setState({
          pickedImage:{uri: res.uri}, pickedImageBase64:{base64:res.data}
        })
        
      }
    })
  }

  onSubmithandler=()=>{
    
    var objTemp3= {id: this.state.id2, name: this.state.typed, img:this.state.pickedImageBase64, latitude:this.state.latitude, longitude:this.state.longitude}
    this.setState({list:[...this.state.list,objTemp3], id2:this.state.id2+1, typed:'',pickedImage:''})
    
    fetch("https://places-785e2.firebaseio.com/places.json",{
      method: "POST",
      body: JSON.stringify(objTemp3)
    })
    .catch(err=>console.log(err))
    .then(res=>res.json())
    .then(parsedRes=>{
      this.setState({keys_store:[...this.state.keys_store,{'id':this.state.id2-1,'key':parsedRes.name}]})
    })

  }

  onDeleteHandler = (id_delete)=>{
    this.setState({list: this.state.list.filter(
            (CheckItem)=>{
            return CheckItem.id !== id_delete
          })
        })

    this.deleteDataAPICall(id_delete)
  }

  FindPlacesInitiateChange = ()=>{
    this.setState({FindPlacesInitiate: 1})
    
    //this.fetchDataFromDB()
  }

  componentDidMount=()=>{
    console.log('Home')
    this._retrieveData()
    this.fetchDataFromDB() 
  }
  
  render(){
    return (
      <>
        <Tab.Navigator
          screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
              // let iconName;
              // if (route.name === 'PlacesShare') {
              //   iconName = focused ? 'add': 'add';
              // } else if (route.name === 'FindPlaces') {
              //   iconName = focused ? 'share' : 'share';
              // }
              // // You can return any component that you like here!
              // return <Icon name={iconName}  size={40} color={"#500"} />;
           }, 
         })}
          tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
          showIcon: true
       }}>
        
          <Tab.Screen name="PlaceShare" 
              screenOptions={({ route }) => ({
                // tabBarIcon: () => {
                //     return <Text><Icon name={'share'}  size={40} color={"#500"} /></Text>;
                //  }, 
               })}
          > 
            {()=><PlacesShare typed={this.state.typed} getLocFromChild={this.getLocFromChild} pickImageHandler={this.pickImageHandler} pickedImage={this.state.pickedImage} onSubmithandler={this.onSubmithandler} onChangehandler={this.onChangehandler}/>}
          </Tab.Screen> 
          <Tab.Screen name="FindPlaces"> 
              {()=><FindPlaces pickedImage={this.state.pickedImage} FindPlacesInitiate={this.state.FindPlacesInitiate} FindPlacesInitiateChange={this.FindPlacesInitiateChange} list={this.state.list} onDeleteHandler={this.onDeleteHandler}/>}
          </Tab.Screen> 
        </Tab.Navigator>
        
      </>
    );
  }
}

const height = Dimensions.get("window").height;
class PlacesShare extends React.Component{
  state={
    stateheight: height,
    focusedLocation: {
      latitude: 33.69490881078251,
      longitude: 73.013649878756,
      latitudeDelta: 0.0122,
      longitudeDelta: Dimensions.get('window').width / Dimensions.get('window').height * 0.0122
    },
    locationChosen: false,
  }
 

  onChange = ({ window}) => {
    this.setState({ stateheight:  window.height});
  };

  componentDidMount() {
    Dimensions.addEventListener("change", this.onChange);
  }

  componentWillUnmount() {
    Dimensions.removeEventListener("change", this.onChange);
  }

  pickLocationHandler = event =>{
    const coords=event.nativeEvent.coordinate;
    this.map.animateToRegion({...this.state.focusedLocation, latitude: coords.latitude, longitude: coords.longitude });
    this.setState(prevState=>{
      return{
        focusedLocation:{
          ...prevState.focusedLocation,
          latitude: coords.latitude,
          longitude: coords.longitude
        },
        locationChosen: true
      }
    })
    this.props.getLocFromChild(coords.longitude,coords.latitude)
  }
   
  getLocationHandler = ()=>{
    navigator.geolocation.getCurrentPosition(pos=>{
      const coordsEvent = {
        nativeEvent:  {
          coordinate:{
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          }
        }
      };
      this.pickLocationHandler(coordsEvent);
    },
    err=>{
      console.log(err);
      alert("Fetching the position failed, please pick manually!");
    }
    )
  }
   

  render(){
    console.log('this one : '+ this.props.typed)
    let marker = null;
    if(this.state.locationChosen){
      marker = <MapView.Marker coordinate={this.state.focusedLocation}/>
    }
    if(this.state.stateheight>500){
    return(
      <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      style={{flex: 1}}
      >
     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.PlaceShareContainer1} >
        <View style={styles.PlaceShareContainer3} >
          <Text style={{fontSize:30, alignSelf:'center'}}>Share Places With Us!</Text>

          <Image source={this.props.pickedImage} style={{width:'80%', height: 120, alignSelf:'center'}}></Image>
          <View style={{width:150, alignSelf:'center'}}>
            <Button onPress={this.props.pickImageHandler} title="Upload Picture" style={{alignSelf:'center'}}></Button>
          </View>
        </View>

        <View style={styles.PlaceShareContainer4} >
          <MapView onPress={this.pickLocationHandler} initialRegion={this.state.focusedLocation} /* region={this.state.focusedLocation} we dont need this anymore, we will animate it*/ ref={ref=>this.map = ref} style={styles.map}>
          {marker}
          </MapView>
          {/* <Text style={{fontSize:30, alignSelf:'center'}}>Map</Text>
          <View  style={{width:'80%', height: 120, alignSelf:'center', backgroundColor:'gray'}}></View> */}
          <View style={{width:180, alignSelf:'center'}}>
            <Button onPress={this.getLocationHandler} title="Select destination" style={{alignSelf:'center'}}></Button>
          </View>
        </View>
        
        <View style={styles.PlaceShareContainer2} >
          <TextInput value= {this.props.typed} style={styles.TextIn} placeholder="Enter name" onChangeText={(text)=>{this.props.onChangehandler(text)}}></TextInput>
          <TouchableHighlight style={styles.bttn} onPress={this.props.onSubmithandler} underlayColor="#35872A">
            <Text style={{color: 'white', fontSize: 20}}>Send</Text>
          </TouchableHighlight>
          
        </View>
        
      </View>
      </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );}
    else {
      return(
        <View style={styles.PlaceShareContainer1} >
          
          <View style={styles.PlaceShareContainer5}>
            <View style={styles.PlaceShareContainer3} >
              <View style={{width:150, alignSelf:'center'}}>
                <Button onPress={this.props.pickImageHandler} title="Upload Picture" style={{alignSelf:'center'}}></Button>
              </View>
              <Image source={this.props.pickedImage} style={{width:'80%', height: 120, alignSelf:'center'}}></Image>
              
            </View>
              
        

            <View style={styles.PlaceShareContainer4} >
              <View style={{width:180, alignSelf:'center'}}>
                <Button onPress={this.getLocationHandler} title="Select destination" style={{alignSelf:'center'}}></Button>
              </View>
              <MapView onPress={this.pickLocationHandler} initialRegion={this.state.focusedLocation} /* region={this.state.focusedLocation} we dont need this anymore, we will animate it*/ ref={ref=>this.map = ref} style={styles.map2}>
                  {marker}
              </MapView>
              {/* <Text style={{fontSize:30, alignSelf:'center'}}>Map</Text>
                <View  style={{width:'80%', height: 120, alignSelf:'center', backgroundColor:'purple'}}></View> */}
              
            </View>
          </View>
          <View style={styles.PlaceShareContainer2} >
            <TextInput value= {this.props.typed} style={styles.TextIn} placeholder="Enter name" onChangeText={(text)=>{this.props.onChangehandler(text)}}></TextInput>
            <TouchableHighlight style={styles.bttn} onPress={this.props.onSubmithandler} underlayColor="#35872A">
              <Text style={{color: 'white', fontSize: 20}}>Send</Text>
            </TouchableHighlight>
          </View>

        </View>
      );}
  }
};


class FindPlaces extends React.Component{
  state={
    removeAnim: new Animated.Value(1),
    id_for_modal:0,
    name_for_modal:'',
    image_for_modal:'',
    modalVisible: false
  }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }

  placesSearchHandler = () => {
    Animated.timing(this.state.removeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true
    }).start(() => {
      this.setState({
        placesLoaded: true
      });
      console.log('anime2: ');
      this.props.FindPlacesInitiateChange()
    });
  };

  showModelHandler=(selected_id, selected_name, selected_img)=>{
    this.setState({id_for_modal:selected_id, name_for_modal:selected_name, image_for_modal: selected_img})
    // alert('selected: '+ selected_id)
    // this.props.onDeleteHandler(selected_id);
  }

  render(){
    if(this.props.FindPlacesInitiate===0){
      return (
        <View  style={{fontSize:25, top:150, justifyContent:'center', alignContent:'center', alignItems:'center'}}>
        <Animated.View
        style={{
          opacity: this.state.removeAnim,
          transform: [
            { 
              scale: this.state.removeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [10, 1]
              })
            }
          ]
        }}>
        
          <TouchableOpacity onPress ={this.placesSearchHandler} style={styles.FindPlacesInitiateBttn}>
            <Text style={{fontSize:25, alignSelf:'center', top:25}}>Find Places</Text>
          </TouchableOpacity>
        
        </Animated.View>
        </View>
      )
    }
    else{
      return (
      <View style={styles.listContainer}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
        >
            <View style={{width:"100%", height:"100%",backgroundColor: "white" }}>
              <TouchableHighlight
                style={{ width:40, height: 40, backgroundColor: "black" }}
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}
              >
                <Text style={{fontSize:20, alignSelf:'center', justifyContent:'center', color:'white'}}>x</Text>
                
              </TouchableHighlight>
              {/* <Image source={this.state.image_for_modal} style={{ resizeMode: 'cover', width: "80%", height: 150, alignSelf:'center' }}/>  */}
              <Image source={{uri: 'data:image/png;base64,'+this.state.image_for_modal.base64}} style={{ resizeMode: 'cover', width: "80%", height: 150, alignSelf:'center' }}/>
              <Text style={{ fontSize:40, alignSelf:'center',color:'white' }}>{this.state.name_for_modal}</Text>
            </View>
        </Modal>
        <FlatList
            data={this.props.list}
            renderItem={({item}) => { 
              return(
              <View>
                <View style={styles.listContainer2}>
                  <TouchableHighlight onPress={() => { this.showModelHandler(item.id, item.name, item.img); this.setModalVisible(!this.state.modalVisible);}}> 
                    {/* <Image source={(item.img.uri)} style={{ resizeMode: 'cover', width: 50, height: 50 }}/>  */}
                    <Image source={{uri: 'data:image/png;base64,'+item.img.base64}} style={{ resizeMode: 'cover', width: 50, height: 50 }}/> 
                  </TouchableHighlight>
                  <Text style={styles.list}>{item.name}</Text>
                  <TouchableHighlight style={styles.bttnDelete} onPress={()=>{this.props.onDeleteHandler(item.id); }} underlayColor="#710404">
                        <Text style={{color: 'white', fontSize: 20}}>Delete</Text>
                  </TouchableHighlight>
                </View>
              </View>
              
            );
            }} 
        />
      </View>
      );
    }
  }
}



export default App


var styles= StyleSheet.create({
  PlaceShareContainer1:{
    flex:1,
    flexDirection:'column',
    top: 40
  },
  PlaceShareContainer2:{
    flex:1,
    flexDirection:'row'
  },
  PlaceShareContainer3:{
    flex:2,
    flexDirection:'column'
  },
  PlaceShareContainer4:{
    flex:2,
    flexDirection:'column'
  },
  map:{
    width:'100%',
    height:200
  },
  map2:{
    width:'90%',
    height:150
  },
  PlaceShareContainer5:{
    flex:2,
    flexDirection:'row'
  },

  TextIn:{
    fontSize: 20,
    borderColor: 'black',
    borderWidth: 1,
    borderColor: 'blue',
    width: '80%',
    height: 50,
    justifyContent:'center',
    alignContent:'center'
  },
  bttn:{
    width: 80,
    height: 50,
    backgroundColor:'#46A239',
    alignItems:'center',
    justifyContent:'center'
  },
  FindPlacesInitiateBttn:{
    width: 150,
    height:80,
    backgroundColor:'yellow',
    fontSize: 40,
    borderRadius:50
  },
  listContainer:{
    flexDirection: 'row',
    margin:10,
    backgroundColor:'#BFD9D6'
  },
  listContainer2:{
    flexDirection: 'row',
    margin:10,
    backgroundColor:'#BFD9D6'
  },
  list:{
    
    flex:4,
    fontSize:20,
    justifyContent: 'center',
    alignContent:'center',
    marginLeft:15,
    marginTop:5
  },
  bttnDelete:{
    width: 80,
    height: 50,
    backgroundColor:'#EE0404',
    alignItems:'center',
    justifyContent:'center',
    flex:2
  },
  bttn1Container:{
    width: 80,
    height: 50,
    backgroundColor:'red',
  },
  tinyLogo: {
    width: 50,
    height: 50,
    position:'relative'

  },
  bgimg:{
    width: "100%",
    height: "100%"
  }
})


