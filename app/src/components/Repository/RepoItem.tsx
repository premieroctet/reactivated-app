import React from 'react';
import { Text, Div, Image, Tag } from 'react-native-magnus';
import Row from '../Row';
import * as Progress from 'react-native-progress';
import FrameworkTag from './FrameworkTag';
import { View } from 'react-native-animatable';
import { StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

type RepoItemProps = {
  repo: Repository;
};

const RepoItem: React.FC<RepoItemProps> = ({ repo }) => {
  const getHealthBarColor = (score: number) => {
    let color = 'green';
    if (score < 25) {
      color = 'red';
    } else if (score < 75) {
      color = 'orange';
    }
    return color;
  };

  return (
    <Div h={75} p="sm" mx="sm" justifyContent="center">
      <TouchableOpacity>
        <Row>
          <Image
            h={45}
            w={45}
            m={4}
            rounded="sm"
            source={{
              uri: repo.repoImg,
            }}
          />

          <Div justifyContent="center">
            <Text textAlign="left" color="black" fontWeight="bold">
              {repo.name}
            </Text>

            <Progress.Bar progress={repo.score / 100} width={70} color={getHealthBarColor(repo.score)} />
          </Div>

          <Div flex={1} flexDir="row-reverse">
            <Div justifyContent="center">
              <View style={styles.arrow} />
            </Div>
            <Div justifyContent="center" mx="sm">
              <FrameworkTag framework={repo.framework} />
            </Div>
          </Div>
        </Row>
      </TouchableOpacity>
    </Div>
  );
};

const styles = StyleSheet.create({
  arrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderBottomWidth: 14,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'black',
    transform: [{ rotate: '90deg' }],
  },
});

export default RepoItem;
