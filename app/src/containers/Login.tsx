import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { Config } from '../config';
type LoginProps = {};

// Github login Webview
const Login: React.FC<LoginProps> = () => {
  return <WebView source={{ uri: Config.API_URL + '/auth/github' }} />;
};
export default Login;
