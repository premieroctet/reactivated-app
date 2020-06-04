import React from 'react';
import { Div, Icon, Button } from 'react-native-magnus';
import MainBackground from '../components/Ui/MainBackground';
import { FlatList } from 'react-native';
import { useAuthContext } from '../contexts/AuthContext';

type DashboardProps = {
  children: React.ReactNode;
};

const Dashboard: React.FC<DashboardProps> = ({ children }) => {
  return (
    <MainBackground>
      <Div flex={1} bg="white" shadow="sm" w="80%" my="2xl" rounded="2xl">
        <FlatList data={null} renderItem={() => null} contentContainerStyle={{ flex: 1 }} />
      </Div>
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
