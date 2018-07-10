import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Image, StatusBar, Platform, Dimensions } from 'react-native';
import { CachedImage } from 'react-native-cached-image';
import EntypoIcon from 'react-native-vector-icons/dist/Entypo';
import LinearGradient from 'react-native-linear-gradient';

import ReviewItem from '../components/ReviewItem';

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },

  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,

  },

  headText: {
    fontSize: 24,
    fontWeight: '300',
  },

  stars: {
    flexDirection: 'row',
  },

  star: {
    margin: 4,
    height: 20,
    width: 20,
  },

  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },

  headerBack: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  headerBackWrapper: {
    flex: 1,
    justifyContent: 'center',
  },

  titleWrapper: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerText: {
    color: 'white',
    fontSize: 17,
  },

  right: {
    flex: 1,
    alignItems: 'flex-end',
  },
});


class Reviews extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;

    return {
      title: params ? params.name : 'A Nested Details Screen',
      headerTintColor: 'white',
      header: (
        <LinearGradient colors={['#C719BD', '#9F3CBB', '#7B55BA']} start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }}>
          <SafeAreaView>
            <StatusBar barStyle="light-content" translucent backgroundColor="rgba(255, 255, 255, 0)" />
            <View style={[styles.headerContainer, { padding: 10, marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight }]}>
              <TouchableOpacity
                style={styles.headerBackWrapper}
                onPress={() => navigation.goBack()}
              >
                <View style={styles.headerBack}>
                  <EntypoIcon name="chevron-thin-left" size={17} color="white" />
                  <Text ellipsizeMode="tail" numberOfLines={1} style={styles.headerText}>{navigation.state.params.parent || 'Categories'}</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.titleWrapper}>
                <Text ellipsizeMode="tail" numberOfLines={1} style={styles.headerText}>{navigation.state.params.data.name}</Text>
              </View>
              <View style={styles.right}>
                <TouchableOpacity style={{ opacity: 0.3 }}>
                  <Image source={require('../assets/img/other/plus.png')} style={{ height: 24, width: 24 }} />
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>
      ),
    };
  };


  addStars() {
    const { totalRating } = this.props.navigation.state.params.data;
    const buffer = [];
    let tracker = totalRating;
    for (let i = 0; i < 5; i += 1) {
      if (tracker >= 1) {
        buffer.push(<Image key={Math.random()} source={require('../assets/img/other/full-star.png')} style={styles.star} />);
        tracker -= 1;
      } else if (tracker >= 0.5) {
        buffer.push(<Image key={Math.random()} source={require('../assets/img/other/half-star.png')} style={styles.star} />);
        tracker -= 0.5;
      } else {
        buffer.push(<Image key={Math.random()} source={require('../assets/img/other/empty-star.png')} style={styles.star} />);
      }
    }
    return buffer;
  }

  formatRating() {
    const { totalRating: rating } = this.props.navigation.state.params.data;
    switch (true) {
      case rating >= 4.5:
        return 'Excellent';
      case rating >= 4.0:
        return 'Very Good';
      case rating >= 3.5:
        return 'Good';
      case rating >= 3:
        return 'Okay';
      case rating >= 2:
        return 'Could be better';
      default:
        return 'Poor';
    }
  }

  renderItems() {
    const { reviews } = this.props.navigation.state.params.data;
    return reviews.map((review) => (
      <ReviewItem key={review} review={review} />
    ));
  }

  render() {
    const { data } = this.props.navigation.state.params;
    const { width } = Dimensions.get('window');
    const height = width * 0.8;
    return (
      <ScrollView>
        <CachedImage
          style={{
            height,
            width,
          }}
          source={{ uri: data.images[0] }}
        />
        <View style={styles.container}>
          <View style={styles.head}>
            <Text style={styles.headText}>{this.formatRating()}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[styles.headText, { fontWeight: '600', marginRight: 4 }]}>{data.totalRating.toFixed(1)}</Text>
              <View style={styles.stars}>
                {this.addStars()}
              </View>
            </View>
          </View>
          <View style={styles.items}>
            {this.renderItems()}
          </View>
        </View>
      </ScrollView>
    );
  }
}

export default Reviews;
