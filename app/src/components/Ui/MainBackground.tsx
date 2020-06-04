import React from 'react';
import { Div } from 'react-native-magnus';
import { SafeAreaView } from 'react-native-safe-area-context';

type MainBackgroundProps = {
  children: React.ReactNode;
};

const MainBackground: React.FC<MainBackgroundProps> = ({ children }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Div flex={1} bg="mainBg" alignItems="center" justifyContent="center" p="xl">
        {children}
      </Div>
    </SafeAreaView>
  );
};

export default MainBackground;
