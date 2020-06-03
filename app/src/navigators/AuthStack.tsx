import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Home from '../containers/Home';
import Splash from '../containers/Splash';
import Login from '../containers/Login';

export type AuthStackParamList = {
  Splash: undefined;
  Home: undefined;
  Login: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

const AuthStack = () => {
  return (
    <Stack.Navigator
    // headerMode="none"
    >
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Login" component={Login} />
    </Stack.Navigator>
  );
};

export default AuthStack;
