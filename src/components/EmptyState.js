import React from 'react';
import { string } from 'prop-types';


import { View, Image, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  outerWrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },

  innerWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
  },

  message: {
    fontSize: 22,
    textAlign: 'center',
    marginTop: 20,
    opacity: 0.6,
  },
});

const Empty = ({ message }) => (
  <View style={styles.outerWrapper}>
    <View style={styles.innerWrapper}>
      <Image
        style={{
          height: 100,
          width: 100,
          opacity: 0.2,
        }}
        source={require('../assets/magnifying-glass.png')}
      />
      <Text style={styles.message}>{message}</Text>
    </View>
  </View>
);

Empty.propTypes = {
  message: string.isRequired,
};

export default Empty;
