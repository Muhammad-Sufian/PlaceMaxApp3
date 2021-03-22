/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import React from 'react';
import {name as appName} from './app.json';

import {Provider} from 'react-redux'; 
import configureStore from './Store/configurationStore'

const store = configureStore()

class RNRedux extends React.Component{
    render(){
      return(
        <Provider store={store}>
          <App/>
        </Provider>
      )
    }
  }

AppRegistry.registerComponent(appName, () => RNRedux);




// /**
//  * @format
//  */

// import {AppRegistry} from 'react-native';
// import App from './App';
// import {name as appName} from './app.json';

// AppRegistry.registerComponent(appName, () => App);
