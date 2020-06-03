import React from 'react';
import { Button, Div, Icon, Text } from 'react-native-magnus';
import LoadingIndicator from '../components/Ui/LoadingIndicator';
import MainBackground from '../components/Ui/MainBackground';

const Home = () => {
  const [loading, setLoading] = React.useState(false);
  const onSignInGithub = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return (
    <MainBackground>
      <Div flex={1} justifyContent="space-between" p="xl">
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

        <Text color="white">Keep your JS app up to date</Text>
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

      <LoadingIndicator loading={loading} />
    </MainBackground>
  );
};

export default Home;
