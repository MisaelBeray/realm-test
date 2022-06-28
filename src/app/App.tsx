import React, { Component } from "react";
import AccuraryTestModal from './pages/AccuraryTestModal'
import DrawPointModal from './pages/DrawPointModal'
import {
  AppRegistry,
  StyleSheet,
  View,
  LogBox
} from 'react-native';

LogBox.ignoreLogs([
  'Require cycle:'
])

import { VictoryBar } from "victory-native";

class App extends Component {
  render() {
    return (
      <DrawPointModal />
    );
  }
}

export default App;