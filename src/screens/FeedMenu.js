import React from 'react';
import { array, func } from 'prop-types';

import { Text, View, Image, StyleSheet, ScrollView, TouchableWithoutFeedback, TouchableOpacity, SafeAreaView, StatusBar, Linking, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';

import ipfs from '../services/ipfs';

import { loadCategories } from '../redux/actions';

import { categoriesImages } from '../assets/img';

import a from '../services/contracts/review-network';

a.contract; // eslint-disable-line

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  item: {
    width: '30%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 6,
    marginTop: 20,
  },

  headerIcon: {
    height: 24,
    width: 24,
  },

  headerTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: 'white',
  },

  icon: {
    alignSelf: 'center',
    height: 60,
    width: 60,
    marginBottom: 12,
  },
});


const handleItemClick = (navigation, category) => {
  if (category.categories) {
    navigation.navigate('Categories', { data: category.categories, name: category.name, parent: 'Categories' });
  }
};

class FeedMenu extends React.Component {
  componentDidMount() {
    const { loadCategories: doLoadCategories } = this.props;

    if (Platform.OS === 'android') {
      Linking.getInitialURL().then(async (url) => {
        if (url) {
          const route = url.replace(/.*?:\/\//g, '');
          const id = route.match(/\/([^\/]+)\/?$/)[1]; // eslint-disable-line
          const routeName = route.split('/')[1];
          this.extractDataAndOpen(routeName, id);
        }
      });
    }

    doLoadCategories();

    Linking.addEventListener('url', this.handleOpenURL);
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this.handleOpenURL);
  }

  extractDataAndOpen = async (routeName, id) => {
    const data = await ipfs.get('QmTWLADbvsYSiLg4FCgDVWm32GJm4ZUe9bF5jUqswq6xhx');
    const reviewsData = data.filter(item => item.categories)
      .reduce((total, current) => {
        total.push(current);
        return total;
      }, [])
      .map(item => item.categories)
      .reduce((total, current) => {
        total.push(...current);
        return total;
      }, [])
      .map(item => item.subcategories)
      .map(item => item[0])
      .map(item => item.products)
      .reduce((total, current) => {
        total.push(...current);
        return total;
      }, [])
      .find(item => item.id == id); // eslint-disable-line

    if (routeName.toLowerCase() === 'reviews') {
      if (reviewsData) {
        this.props.navigation.navigate('Reviews', { data: reviewsData });
      } else {
        alert('This item does not exist!');
      }
    } else {
      alert('This route does not exist!');
    }
  }

  handleOpenURL = ({ url }) => {
    const route = url.replace(/.*?:\/\//g, '');
    const id = route.match(/\/([^\/]+)\/?$/)[1]; // eslint-disable-line
    const routeName = route.split('/')[0];
    this.extractDataAndOpen(routeName, id);
  }

  renderCategories = (navigation) => {
    const { categories } = this.props;

    if (!categories) {
      return <Text>Loading...</Text>;
    }

    return categories.map((category) => (
      <TouchableWithoutFeedback
        key={category.name}
        onPress={() => handleItemClick(navigation, category)}
      >
        <View style={styles.item}>
          <Image
            style={[styles.icon, { opacity: category.categories ? 1 : 0.3 }]}
            source={categoriesImages[category.name]}
            resizeMode="stretch"
          />
          <Text style={{ fontSize: 12 }}>{category.name}</Text>
        </View>
      </TouchableWithoutFeedback>
    ));
  }

  render() {
    const { navigation } = this.props;
    return (
      <ScrollView>
        <View style={styles.container}>
          {this.renderCategories(navigation)}
        </View>
      </ScrollView>
    );
  }
}

FeedMenu.navigationOptions = ({ navigation }) => (
  {
    header: (
      <LinearGradient colors={['#C719BD', '#9F3CBB', '#7B55BA']} start={{ x: 0, y: 0 }} end={{ y: 0, x: 1 }}>
        <SafeAreaView>
          <StatusBar barStyle="light-content" translucent backgroundColor="rgba(255, 255, 255, 0)" />
          <View style={{ padding: 10, marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight }}>
            <StatusBar barStyle="light-content" />
            <View style={{ flexDirection: 'row-reverse' }}>
              <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                <Image source={require('../assets/img/other/settings.png')} style={[styles.headerIcon, { marginLeft: 10 }]} />
              </TouchableOpacity>
              <TouchableOpacity style={{ opacity: 0.3 }}>
                <Image source={require('../assets/img/other/plus.png')} style={[styles.headerIcon, { marginRight: 10 }]} />
              </TouchableOpacity>
            </View>
            <View style={{ marginTop: 10 }}>
              <Text style={styles.headerTitle}>Categories</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    ),
  }
);

const mapStateToProps = ({ state: { categories } }) => ({
  categories,
});

const mapDispatchToProps = {
  loadCategories,
};

FeedMenu.propTypes = {
  categories: array.isRequired, // eslint-disable-line react/forbid-prop-types
  loadCategories: func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(FeedMenu);
