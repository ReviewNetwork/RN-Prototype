import React from 'react';
import { object } from 'prop-types';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { withNavigation } from 'react-navigation';


const style = {
  lineStyle: {
    borderWidth: 0.5,
    borderColor: '#afb5bf',
    marginTop: 10,
    marginBottom: 10,
  },

  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  author: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  authorName: {
    fontSize: 16,
    marginLeft: 20,
  },

  rating: {
    fontSize: 24,
  },

  foot: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  likes: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  likesText: {
    fontSize: 14,
    margin: 5,
  },

  container: {
    padding: 10,
  },

  textColor: {
    color: 'black',
  },
  wrapper: {
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  primeImg: {
    height: 10,
    width: 10,
    marginRight: 4,
  },


};

const primeStyle = {
  ...style,

  lineStyle: {
    ...style.lineStyle,
    borderColor: 'white',
  },

  authorName: {
    ...style.authorName,
    color: 'white',
  },

  rating: {
    ...style.rating,
    color: 'white',
  },

  likesText: {
    ...style.likesText,
    color: 'white',
  },

  textColor: {
    color: 'white',
  },

  primeWrapper: {
    marginLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },

  likeButton: {
    height: 20,
    width: 20,
  },

};

const ReviewItem = ({ review, navigation }) => {
  const { text, author, rating, likes, dislikes, isPrime } = review;

  const styles = isPrime ? StyleSheet.create(primeStyle) : StyleSheet.create(style);

  return (
    <TouchableOpacity onPress={() => navigation.navigate('Review', { review, parent: navigation.state.params.data.name })} style={styles.wrapper}>
      <LinearGradient colors={isPrime ? ['#FF9738', '#F86443', '#EE3B55'] : ['#ffffff', '#ffffff', '#ffffff']} start={{ x: 0, y: 0 }} end={{ y: 0, x: 1 }}>
        <View style={styles.container}>
          <View style={styles.head}>
            <View style={styles.author}>
              <Image
                style={{
                  height: 40,
                  width: 40,
                }}
                source={{ uri: author.avatar }}
                resizeMode="stretch"
              />
              <View>
                <Text style={styles.authorName}>{author.username}</Text>
                {isPrime && (
                  <View style={styles.primeWrapper}>
                    <Image source={require('../assets/img/other/important.png')} style={styles.primeImg} />
                    <Text style={{ color: 'white', fontSize: 12 }}>PRIME REVIEW</Text>
                  </View>
                )}
              </View>
            </View>
            <Text style={styles.rating}>{rating.toFixed(1)}</Text>
          </View>
          <Text numberOfLines={5} style={[styles.textColor, { fontSize: 12 }]}>{text}</Text>
          <View style={styles.lineStyle} />
          <View style={styles.foot}>
            <View style={styles.likes}>
              <TouchableOpacity>
                <Image source={isPrime ? require('../assets/img/other/like-light.png') : require('../assets/img/other/like.png')} style={styles.likeButton} />
              </TouchableOpacity>
              <Text style={styles.likesText}>{likes}</Text>
              <TouchableOpacity>
                <Image source={isPrime ? require('../assets/img/other/dislike-light.png') : require('../assets/img/other/dislike.png')} style={styles.likeButton} />
              </TouchableOpacity>
              <Text style={styles.likesText}>{dislikes}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

ReviewItem.propTypes = {
  review: object.isRequired,
};

export default withNavigation(ReviewItem);
