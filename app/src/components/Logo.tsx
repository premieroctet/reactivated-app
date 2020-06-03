import React from 'react';
import { Div, Text } from 'react-native-magnus';
import Row from './Row';

type LogoProps = {
  children: React.ReactNode;
};

const Logo: React.FC<LogoProps> = ({ children }) => {
  return (
    <>
      <Row>
        <Text color="brand500" fontSize="6xl">
          React
        </Text>
        <Text color="white" fontSize="6xl">
          ivated
        </Text>
      </Row>

      <Div flexDir="row" alignItems="center">
        <Div rounded="circle" bg="white" h={20} w={20} mx="lg" />
        <Text color="white" fontSize="6xl">
          app
        </Text>
      </Div>
    </>
  );
};

export default Logo;
