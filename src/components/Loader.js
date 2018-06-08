import React from 'react';
import { bool } from 'prop-types';

import {
  StyleSheet,
  View,
  Modal,
  ActivityIndicator,
} from 'react-native';

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

const Loader = ({ loading }) => (
  <Modal
    transparent
    animationType="none"
    visible={loading}
  >
    <View style={styles.modalBackground}>
      <View style={styles.activityIndicatorWrapper}>
        <ActivityIndicator
          animating={loading}
        />
      </View>
    </View>
  </Modal>
);

Loader.propTypes = {
  loading: bool,
};

Loader.defaultProps = {
  loading: false,
};

export default Loader;
