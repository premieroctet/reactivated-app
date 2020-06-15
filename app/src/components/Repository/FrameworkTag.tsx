import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Tag } from 'react-native-magnus';

type FrameworkTagProps = {
  framework: FrameworkTag;
};

const FrameworkTag: React.FC<FrameworkTagProps> = ({ framework }) => {
  const getFrameworkColor = (framework: FrameworkTag) => {
    switch (framework) {
      case 'react':
      case 'react native':
        return 'blue';

      case 'vue':
        return 'green';

      case 'angular':
      case 'nest.js':
        return 'red';

      default:
        return 'black';
    }
  };

  const color = getFrameworkColor(framework);

  return (
    <Tag color={color + '700'} bg={color + '100'}>
      {framework}
    </Tag>
  );
};

export default FrameworkTag;
