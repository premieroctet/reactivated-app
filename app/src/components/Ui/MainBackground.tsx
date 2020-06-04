import React from 'react';
import { Div } from 'react-native-magnus';

type MainBackgroundProps = {
  children: React.ReactNode;
};

const MainBackground: React.FC<MainBackgroundProps> = ({ children }) => {
  return (
    <Div flex={1} bg="mainBg" alignItems="center" justifyContent="center" p="xl">
      {children}
    </Div>
  );
};

export default MainBackground;
