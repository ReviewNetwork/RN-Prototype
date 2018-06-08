import React from 'react';
import { object, string } from 'prop-types';
import { Text, View, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { withNavigation } from 'react-navigation';
import { CachedImage } from 'react-native-cached-image';


const styles = StyleSheet.create({
  item: {
    margin: 4,
    width: 128,
  },

  image: {
    alignSelf: 'center',
    height: 92,
    width: 128,
  },
});

const handleItemClick = (navigation, data, parent, image = 'https://image.jimcdn.com/app/cms/image/transf/none/path/s54a99219ff211d1b/image/ic2ce85f1c7dc0d70/version/1502012712/image.jpg') => {
  navigation.navigate('Reviews', { data, parent: navigation.state.params.name, image });
};

const SubcategoryItem = ({ item, navigation, data, parent }) => (
  <TouchableWithoutFeedback
    onPress={() => handleItemClick(navigation, data, parent, item.images[0])}
  >
    <View style={styles.item}>
      <CachedImage
        style={styles.image}
        source={{ uri: item.images[0] || 'https://image.jimcdn.com/app/cms/image/transf/none/path/s54a99219ff211d1b/image/ic2ce85f1c7dc0d70/version/1502012712/image.jpg' }}
        resizeMode="stretch"
      />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}>
        <Text style={{ fontSize: 14 }} numberOfLines={1}>{item.name}</Text>
      </View>
    </View>
  </TouchableWithoutFeedback>
);

SubcategoryItem.propTypes = {
  item: object.isRequired,
  data: object.isRequired,
  parent: string.isRequired,
};

export default withNavigation(SubcategoryItem);
