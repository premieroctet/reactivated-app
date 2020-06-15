import React from 'react';
import { FlatList } from 'react-native';
import { Avatar, Button, Div, Icon, Text } from 'react-native-magnus';
import Header from '../components/Header';
import RepoItem from '../components/Repository/RepoItem';
import MainBackground from '../components/Ui/MainBackground';
import { useAxiosRequest } from '../hooks/useRequest';
import { getRepositories } from '../services/apiRepositories';
import { SafeAreaView } from 'react-native-safe-area-context';

type DashboardProps = {
  children: React.ReactNode;
};

const Dashboard: React.FC<DashboardProps> = ({ children }) => {
  const { data: repositories } = useAxiosRequest('/repositories', { fetcher: getRepositories });

  if (!repositories) {
    return null;
  }

  return (
    <MainBackground>
      <Header />
      <Div row alignItems="center">
        <Text color="white">My Reactivated Apps</Text>
        {repositories.length > 0 && (
          <Avatar bg="brand500" color="brand900" size={20} mx={4}>
            {repositories.length.toString()}
          </Avatar>
        )}
      </Div>

      <Div flex={1} bg="white" shadow="sm" w="95%" my="xl" rounded="2xl">
        {repositories.length > 0 ? (
          <FlatList
            data={repositories}
            renderItem={({ item }) => <RepoItem repo={item} key={item.id.toString()} />}
            contentContainerStyle={{ flex: 1 }}
          />
        ) : (
          <Text mb={5} textAlign="center" fontSize="2xl" color="gray.400">
            You have no reactivated app yet! Start now by adding yout from a GitHub repository
          </Text>
        )}
      </Div>
      <Div px="2xl">
        <Button
          mt="lg"
          py="lg"
          rounded="circle"
          bg="mainBackground"
          block
          borderWidth={1}
          borderColor="brand500"
          color="brand500"
          prefix={<Icon fontSize="title" fontFamily="FontAwesome5" mr="md" name="plus" color="brand500" />}
          onPress={() => {}}
        >
          Add a repository
        </Button>
      </Div>
    </MainBackground>
  );
};

export default Dashboard;
