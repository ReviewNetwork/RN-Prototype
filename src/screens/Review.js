import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Image, StatusBar, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import EntypoIcon from 'react-native-vector-icons/dist/Entypo';
import Carousel from '../components/Carousel';


const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },

  headerBack: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  infoWrapper: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 10,
    marginTop: 10,
    justifyContent: 'space-between',
  },

  userInfoWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },

  image: {
    height: 30,
    width: 30,
    marginRight: 10,
  },

  mainText: {
    fontSize: 15,
    lineHeight: 30,
    textAlign: 'justify',
  },

  ratingWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

const Review = ({ navigation }) => {
  const { review } = navigation.state.params;
  return (
    <ScrollView>
      <Carousel images={review.images} />
      <View style={{ padding: 10 }}>
        <View style={styles.infoWrapper}>
          <View style={styles.userInfoWrapper}>
            <Image
              style={styles.image}
              source={{ uri: review.author.avatar }}
              resizeMode="stretch"
            />
            <Text style={{ fontSize: 20 }}>{review.author.username}</Text>
          </View>
          <View style={styles.ratingWrapper}>
            <Text style={{ fontSize: 24 }}>{review.rating.toFixed(1)}</Text>
          </View>
        </View>
        <Text style={styles.mainText}>{review.text}</Text>
      </View>
    </ScrollView>
  );
};

Review.navigationOptions = ({ navigation }) => (
  {
    header: (
      <LinearGradient
        colors={['#C719BD', '#9F3CBB', '#7B55BA']}
        start={{ x: 0.0, y: 0.25 }}
        end={{ x: 0.5, y: 1.0 }}
      >
        <SafeAreaView>
          <StatusBar barStyle="light-content" translucent backgroundColor="rgba(255, 255, 255, 0)" />
          <View style={[styles.headerContainer, { padding: 10, marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight }]}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <View style={styles.headerBack}>
                <EntypoIcon name="chevron-thin-left" size={17} color="white" />
                <Text style={{ color: 'white', fontSize: 17 }}>{navigation.state.params.parent}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    ),
  }
);

export default Review;
