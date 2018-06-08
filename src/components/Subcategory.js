import React from 'react';
import { array, string } from 'prop-types';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { withNavigation } from 'react-navigation';


import Icon from 'react-native-vector-icons/dist/Entypo';

import SubcategoryItem from './SubcategoryItem';

const styles = StyleSheet.create({
  subCategoryHeader: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  sub: {
    display: 'flex',
    flexDirection: 'column',
  },

  items: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
  },
  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 10,
  },
});

class Subcategory extends React.Component {
  openCategory() {
    alert('In Development!');
  }

  renderItems() {
    const { items } = this.props;
    const { name: parentCategory } = this.props.navigation.state.params.data;
    return items.map((item) => (
      <SubcategoryItem
        key={item.name + Math.random()}
        item={item}
        data={item}
        parent={parentCategory}
      />
    ));
  }

  render() {
    return (
      <View style={styles.sub}>
        <TouchableOpacity>
          <View style={styles.head}>
            <Text style={styles.subCategoryHeader}>{this.props.name}</Text>
            <Icon style={{ opacity: 0.3 }} name="chevron-thin-right" size={21} color="#900" />
          </View>
        </TouchableOpacity>
        <ScrollView horizontal>
          <View style={styles.items}>
            {this.renderItems()}
          </View>
        </ScrollView>
      </View>
    );
  }
}

Subcategory.propTypes = {
  items: array.isRequired,
  name: string.isRequired,
};

export default withNavigation(Subcategory);
