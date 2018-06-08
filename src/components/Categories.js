import React from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import shuffle from 'lodash/shuffle';

import CategoriesHeader from '../components/CategoriesHeader';
import Subcategory from './Subcategory';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    justifyContent: 'space-between',
    padding: 10,
  },
});

class Categories extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      header: <CategoriesHeader
        navigation={navigation}
        title={params.name}
        parent={params.parent}
      />,
    };
  }

  renderItems() {
    const { params: { data } } = this.props.navigation.state;

    // Placeholders will prevent inconsistent data to cause crash of the application:
    const placeholders = [
      {
        name: 'Placeholder',
        totalRating: 1,
        images: ['https://via.placeholder.com/350x150'],
        reviews: [],
      },
      {
        name: 'Placeholder',
        totalRating: 1,
        images: ['https://via.placeholder.com/350x150'],
        reviews: [],
      },
      {
        name: 'Placeholder',
        totalRating: 1,
        images: ['https://via.placeholder.com/350x150'],
        reviews: [],
      },
    ];

    if (data[0] && data[0].subcategories) {
      return data.map((item) => {
        const subcategories = item.subcategories.map((subcategory) => {
          if (subcategory.products) {
            return subcategory.products.reduce((total, current) => {
              total.push(current);
              return total;
            }, []);
          }
          return [...placeholders];
        });
        const subcategoryItems = [].concat(...subcategories);
        return (
          <Subcategory
            key={item.name}
            name={item.name}
            data={item}
            items={shuffle(subcategoryItems) || []}
          />
        );
      });
    }
    return <Text>In Development!</Text>;
  }
  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          {this.renderItems()}
        </View>
      </ScrollView>
    );
  }
}

export default Categories;
