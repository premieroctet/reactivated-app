import React from 'react'
import { SafeAreaView, StatusBar, Image, Button } from 'react-native'
import { ThemeProvider, Text, Div, Icon } from 'react-native-magnus'
import { theme } from './theme'

const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <ThemeProvider theme={theme}>
        <SafeAreaView style={{ flex: 1 }}>
          <Div flex={1} bg="brand50">
            <Text>OKOSKD</Text>
          </Div>
        </SafeAreaView>
      </ThemeProvider>
    </>
  )
}

export default App
