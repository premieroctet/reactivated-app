import React from 'react';
import { Text, Div, Image, Tag } from 'react-native-magnus';
import Row from '../Row';
import * as Progress from 'react-native-progress';
import FrameworkTag from './FrameworkTag';

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
    <Div h={90} p="sm" m="sm" justifyContent="center">
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

        <Div flex={1} flexDir="row-reverse" bg="yellow500">
          <FrameworkTag framework={repo.framework} />
        </Div>
      </Row>
    </Div>
  );
};

export default RepoItem;
