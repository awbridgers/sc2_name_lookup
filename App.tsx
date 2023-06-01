
import {StatusBar} from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Image,
  Platform,
  SafeAreaView,
} from 'react-native';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import { RootStackParamsList } from './types';
import Home from './components/Home';
import { sampleData } from './sampleData';
import Results from './components/Results';

const Stack = createNativeStackNavigator<RootStackParamsList>()

const App = () =>{
  return <NavigationContainer theme={ DarkTheme }>
    <StatusBar style = 'light'/>
    <Stack.Navigator initialRouteName='Home'>
      <Stack.Screen name='Home' component={Home} options={{headerShown: false}}/>
      <Stack.Screen name = 'Results' component = {Results} />
    </Stack.Navigator>
  </NavigationContainer>
}

export default App