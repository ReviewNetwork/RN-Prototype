import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { bool, string } from 'prop-types';

import tabImages from '../assets/img/tabs';

const styles = StyleSheet.create({
  image: {
    height: 24,
    width: 20,
  },
});

const Tab = ({ focused, name }) => (
  focused ?
    <Image
      source={tabImages[`${name}Active`]}
      style={styles.image}
    /> :
    <Image
      style={styles.image}
      source={tabImages[name]}
    />
);

Tab.propTypes = {
  focused: bool,
  name: string.isRequired,
};

Tab.defaultProps = {
  focused: false,
};

export default Tab;
