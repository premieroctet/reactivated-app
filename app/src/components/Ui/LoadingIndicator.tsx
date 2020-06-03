import React from 'react';
import { ActivityIndicator } from 'react-native';
import { Overlay, Text } from 'react-native-magnus';

type LoadingIndicatorProps = {
  loading: boolean;
};

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ loading }) => {
  return (
    <Overlay visible={loading} p="xl" alignItems="center">
      <ActivityIndicator />
      <Text mt="md">Loading...</Text>
    </Overlay>
  );
};

export default LoadingIndicator;
