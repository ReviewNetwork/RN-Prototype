import React from 'react';
import { string } from 'prop-types';
import { Text, View, Image, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import EntypoIcon from 'react-native-vector-icons/dist/Entypo';


const styles = StyleSheet.create({
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: 'white',
  },

  upperWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backText: {
    color: 'white',
    fontSize: 17,
  },

});

const CategoriesHeader = ({ navigation, title, parent }) => (
  <LinearGradient
    colors={['#C719BD', '#9F3CBB', '#7B55BA']}
    start={{ x: 0.0, y: 0.25 }}
    end={{ x: 0.5, y: 1.0 }}
  >
    <SafeAreaView>
      <StatusBar barStyle="light-content" translucent backgroundColor="rgba(255, 255, 255, 0)" />
      <View style={{ padding: 10, marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight }}>
        <View style={styles.upperWrapper}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <EntypoIcon name="chevron-thin-left" size={17} color="white" />
              <Text style={styles.backText}>{parent}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={{ opacity: 0.3 }}>
            <Image source={require('../assets/img/other/plus.png')} style={{ height: 24, width: 24 }} />
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 10 }}>
          <Text style={styles.title}>{title}</Text>
        </View>
      </View>
    </SafeAreaView>
  </LinearGradient>
);

CategoriesHeader.propTypes = {
  title: string.isRequired,
  parent: string.isRequired,
};


export default CategoriesHeader;
