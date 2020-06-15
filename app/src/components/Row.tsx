import React from 'react';
import { Div } from 'react-native-magnus';

type RowProps = {
  children: React.ReactNode;
};

const Row: React.FC<RowProps> = ({ children }) => {
  return <Div flexDir="row">{children}</Div>;
};

export default Row;
