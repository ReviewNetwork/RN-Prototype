import React from 'react';
import { array, string, object } from 'prop-types';
import { View, Text, SafeAreaView, TouchableWithoutFeedback, StyleSheet, Image, StatusBar, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const styles = StyleSheet.create({

  tabActive: {
    borderWidth: 0.1,
    borderColor: 'white',
    flex: 0.5,
    backgroundColor: 'white',
    paddingLeft: 9,
    paddingRight: 9,
    paddingTop: 4.5,
    paddingBottom: 4.5,
  },

  tabActiveText: {
    color: 'black',
    textAlign: 'center',
    fontSize: 13,
  },

  tabPassive: {
    borderWidth: 0.1,
    borderColor: 'white',
    flex: 0.5,
    paddingLeft: 9,
    paddingRight: 9,
    paddingTop: 4.5,
    paddingBottom: 4.5,
  },

  tabPassiveText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 13,
  },

  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: 'white',
  },

  tabsContainer: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 4,
    flexDirection: 'row',
    marginTop: 20,
  },


});

const SwitchHeader = ({ navigation, title, gradient, left, right }) => {
  const { routeName } = navigation.state;
  return (
    <LinearGradient
      colors={gradient}
      start={{ x: 0.0, y: 0.25 }}
      end={{ x: 0.5, y: 1.0 }}
    >
      <SafeAreaView>
        <StatusBar barStyle="light-content" translucent backgroundColor="rgba(255, 255, 255, 0)" />
        <View style={{ padding: 10, marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight }}>
          <View style={{ flexDirection: 'row-reverse' }}>
            <TouchableWithoutFeedback onPress={() => navigation.navigate('Settings')}>
              <Image
                source={require('../assets/img/other/settings.png')}
                style={{ height: 24, width: 24, marginLeft: 10 }}
              />
            </TouchableWithoutFeedback>
          </View>
          <View style={{ marginTop: 10 }}>
            <Text style={styles.title}>{title}</Text>
          </View>

          <View style={styles.tabsContainer}>
            <TouchableWithoutFeedback onPress={() => navigation.replace(left.route)}>
              <View style={routeName === left.route ? styles.tabActive : styles.tabPassive}>
                <Text
                  style={routeName === left.route ? styles.tabActiveText : styles.tabPassiveText}
                >
                  {left.text}
                </Text>
              </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={() => navigation.replace(right.route)}>
              <View style={routeName === right.route ? styles.tabActive : styles.tabPassive}>
                <Text
                  style={routeName === right.route ? styles.tabActiveText : styles.tabPassiveText}
                >
                  {right.text}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

SwitchHeader.propTypes = {
  title: string.isRequired,
  gradient: array.isRequired,
  left: object.isRequired,
  right: object.isRequired,
};

export default SwitchHeader;
