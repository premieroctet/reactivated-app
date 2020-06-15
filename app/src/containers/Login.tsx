import React from 'react';
import { WebView } from 'react-native-webview';
import { Config } from '../config';

type LoginProps = {};

// Github login Webview
const Login: React.FC<LoginProps> = () => {
  return <WebView source={{ uri: Config.API_URL + '/app/auth/github' }} />;
};
export default Login;
