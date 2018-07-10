import { AppRegistry } from 'react-native';
import './shim';
import App from './App';

console.disableYellowBox = true;

AppRegistry.registerComponent('reviewNetworkMobile', () => App);
