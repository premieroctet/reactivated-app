import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Div, Text } from 'react-native-magnus';
import Row from '../components/Row';
import MainBackground from '../components/Ui/MainBackground';
import { AppStackParamList } from '../navigators/AppStack';
import { getData, storeData } from '../utils/AsyncStorage';

type SplashProps = {
  navigation: StackNavigationProp<AppStackParamList, 'Home'>;
};

const Splash: React.FC<SplashProps> = ({ navigation }) => {
  React.useEffect(() => {
    async function startup() {
      // await storeData('token', '');
      const token = await getData('token');

      setTimeout(() => {
        if (token) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Dashboard' }],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
        }
      }, 2000);
    }

    startup();
  }, []);

  return (
    <MainBackground>
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
    </MainBackground>
  );
};

export default Splash;
