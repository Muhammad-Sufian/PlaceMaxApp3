import React from 'react';
import {LogBox, ActivityIndicator, Modal,ScrollView,Animated, Keyboard,Dimensions, KeyboardAvoidingView,TouchableWithoutFeedback, Platform, View,Text, StyleSheet, TextInput, TouchableHighlight, FlatList, Button, Image, TouchableOpacity, ImageBackground } from 'react-native';

export default class tokenStore extends React.Component{
    state={
        token:'3'
    }
    render(){
        {this.props.getToken(this.state.token)}
        
    }
}