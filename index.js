/**
 * @format
 */
import 'react-native-reanimated';
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './app/tabs/App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
