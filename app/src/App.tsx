import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import 'react-native-gesture-handler';
import { ThemeProvider } from 'react-native-magnus';
import { AuthProvider } from './contexts/AuthContext';
import AuthStack from './navigators/AuthStack';
import { theme } from './theme';

const App = () => {
  return (
    <>
      <StatusBar translucent backgroundColor="#24294e" barStyle="light-content" />
      {/* <_StatusBar /> */}

      <ThemeProvider theme={theme}>
        <AuthProvider>
          <SafeAreaView style={{ flex: 1 }}>
            <NavigationContainer>
              <AuthStack />
            </NavigationContainer>
          </SafeAreaView>
        </AuthProvider>
      </ThemeProvider>
    </>
  );
};

export default App;
