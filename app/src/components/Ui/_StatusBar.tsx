import React from 'react';
import { Platform, StatusBar, StyleSheet } from 'react-native';
import { View } from 'react-native-animatable';
import { SafeAreaView } from 'react-native-safe-area-context';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 40 : StatusBar.currentHeight;

const _StatusBar: React.FC = () => {
  return (
    <View style={styles.statusBar}>
      <StatusBar translucent backgroundColor="#24294e" barStyle="light-content" />
    </View>
  );
};

const styles = StyleSheet.create({
  statusBar: {
    height: STATUSBAR_HEIGHT,
    backgroundColor: '#24294e',
  },
});

export default _StatusBar;
