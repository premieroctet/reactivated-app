import React from 'react';
import { Div, Icon, Text } from 'react-native-magnus';

type HeaderProps = {};

const Header: React.FC<HeaderProps> = () => {
  return (
    <Div flexDir="row" alignItems="center">
      <Icon name="plug" fontFamily="FontAwesome5" color="brand500" px="sm" />
      <Text fontSize="3xl" color="brand500">
        React
      </Text>
      <Text fontSize="3xl" color="white">
        ivated
      </Text>
      <Div rounded="circle" bg="white" h={10} w={10} mx="sm" />
      <Text fontSize="3xl" color="white">
        app
      </Text>
    </Div>
  );
};

export default Header;
