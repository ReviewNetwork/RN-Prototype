import React from 'react';
import { array } from 'prop-types';

import { View, ScrollView, Image, StyleSheet, Dimensions } from 'react-native';
import { CachedImage } from 'react-native-cached-image';

const { width } = Dimensions.get('window');
const height = width * 0.8;

const styles = StyleSheet.create({
  scrollContainer: {
    height,
  },
  image: {
    width,
    height,
  },
});

const Carousel = ({ images }) => {
  const carouselImages = images && images.length ? images : ['https://mindovermunch.com/wp-content/uploads/2016/12/placeholder-1000x400.png'];
  return (
    <View
      style={styles.scrollContainer}
    >
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
      >
        {carouselImages.map(image => (
          <CachedImage style={styles.image} key={image} source={{ uri: image }} />
        ))}
      </ScrollView>
    </View>
  );
};

Carousel.propTypes = {
  images: array.isRequired,
};

export default Carousel;
