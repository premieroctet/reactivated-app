import { NavigationProp, RouteProp } from '@react-navigation/native';
import React from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { AppStackParamList } from '../navigators/AppStack';
import apiAuth from '../services/apiAuth';
import { storeData } from '../utils/AsyncStorage';
import LoadingIndicator from '../components/Ui/LoadingIndicator';

type GithubRedirectProps = {
  route: RouteProp<AppStackParamList, 'redirect'>;
  navigation: NavigationProp<AppStackParamList, 'Dashboard' | 'Home'>;
};

const GithubRedirect: React.FC<GithubRedirectProps> = ({ route, navigation }) => {
  const { getCurrentToken: getToken, token } = useAuthContext();

  React.useEffect(() => {
    async function connectGithub() {
      await getToken();

      if (!token) {
        const { data } = await apiAuth.getGithubCallback(route.params.code);
        await storeData('token', data.token);
      }
      navigation.reset({ index: 0, routes: [{ name: 'Dashboard' }] });
    }

    connectGithub();
  }, []);

  return <LoadingIndicator loading={true} />;
};

export default GithubRedirect;
