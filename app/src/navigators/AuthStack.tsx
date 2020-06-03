import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Home from '../containers/Home';
import Splash from '../containers/Splash';

export type AuthStackParamList = {
  Splash: undefined;
  Home: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

const AuthStack = () => {
  return (
    <Stack.Navigator
    // headerMode="none"
    >
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  );
};

export default AuthStack;
