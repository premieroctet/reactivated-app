import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Button, Div, Icon, Text } from 'react-native-magnus';
import Header from '../components/Header';
import MainBackground from '../components/Ui/MainBackground';
import { AppStackParamList } from '../navigators/AppStack';

type HomeProps = {
  navigation: StackNavigationProp<AppStackParamList, 'Login'>;
};

const Home: React.FC<HomeProps> = ({ navigation }) => {
  const onSignInGithub = () => {
    navigation.navigate('Login');
  };

  return (
    <MainBackground>
      <Div flex={1} justifyContent="space-between">
        <Header />

        <Text fontSize="4xl" color="white">
          Keep your JS app up to date
        </Text>
        <Div px="2xl">
          <Button
            mt="md"
            py="lg"
            rounded="circle"
            bg="mainBackground"
            block
            borderWidth={1}
            borderColor="brand500"
            color="brand500"
            prefix={<Icon fontSize="title" fontFamily="FontAwesome5" mr="md" name="github" color="brand500" />}
            onPress={onSignInGithub}
          >
            Sign-in with Github
          </Button>
        </Div>
      </Div>
    </MainBackground>
  );
};

export default Home;
