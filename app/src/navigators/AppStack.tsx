import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Home from '../containers/Home';
import Splash from '../containers/Splash';
import Login from '../containers/Login';
import Dashboard from '../containers/Dashboard';
import GithubRedirect from '../containers/GithubRedirect';

export type AppStackParamList = {
  Splash: undefined;
  Home: undefined;
  Login: undefined;
  Dashboard: undefined;
  redirect: { code: string };
};

const Stack = createStackNavigator<AppStackParamList>();

const AppStack = () => {
  return (
    <Stack.Navigator
    // headerMode="none"
    >
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="redirect" component={GithubRedirect} />
    </Stack.Navigator>
  );
};

export default AppStack;
