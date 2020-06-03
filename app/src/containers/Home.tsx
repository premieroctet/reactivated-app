import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Div, Icon, Text } from 'react-native-magnus';
import MainBackground from '../components/Ui/MainBackground';

const Home = () => {
  return (
    <MainBackground>
      <Icon name="slack" color="yellow700" fontSize="title" />

      <Div flexDir="row" alignItems="center">
        <Text color="brand500">React</Text>
        <Text color="white">ivated</Text>
        <Div rounded="circle" bg="white" h={10} w={10} mx="sm" />
        <Text color="white">app</Text>
      </Div>

      <Button
        mt="md"
        py="lg"
        rounded="lg"
        bg="mainBackground"
        block
        color="brand500"
        prefix={<Icon fontSize="title" fontFamily="FontAwesome5" mr="md" name="plug" color="white" />}
      >
        Sign-in with Facebook
      </Button>
    </MainBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default Home;
