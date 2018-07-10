/* eslint-disable no-alert, no-console, global-require, import/no-unresolved */

import React from 'react';
import { StackNavigator, TabNavigator, SwitchNavigator } from 'react-navigation';

import Categories from '../components/Categories';
import Wallet from '../screens/Wallet';
import MyReviews from '../screens/MyReviews';
import Surveys from '../screens/Surveys';
import Survey from '../screens/Survey';
import Notifications from '../screens/Notifications';
import Reviews from '../screens/Reviews';
import FeedMenu from '../screens/FeedMenu';
import Review from '../screens/Review';
import Settings from '../screens/Settings';
import SwitchHeader from '../components/SwitchHeader';
import Tab from '../components/Tab';
import Authentication from '../screens/Authentication';

const ProfileStack = StackNavigator({

  Wallet: {
    screen: Wallet,
    navigationOptions: {
      title: 'Wallet',
    },
  },
  MyReviews: {
    screen: MyReviews,
    navigationOptions: {
      title: 'My Reviews',
    },
  },
  Settings: {
    screen: Settings,
  },
}, {
  navigationOptions: ({ navigation }) => ({
    header: (
      <SwitchHeader
        navigation={navigation}
        title="Profile"
        gradient={['#7659BB', '#6566C7', '#5375D4']}
        left={{ text: 'Wallet', route: 'Wallet' }}
        right={{ text: 'My Reviews', route: 'MyReviews' }}
      />
    ),
  }),
});

const AlertsStack = StackNavigator({

  Notifications: {
    screen: Notifications,
    navigationOptions: {
      title: 'Notifications',
    },
  },
  Surveys: {
    screen: Surveys,
    navigationOptions: {
      title: 'Surveys',
    },
  },
  Survey: {
    screen: Survey,
    navigationOptions: {
      title: 'Survey',
    },
  },
  Settings: {
    screen: Settings,
  },
}, {
  navigationOptions: ({ navigation }) => ({
    header: (
      <SwitchHeader
        navigation={navigation}
        title="Alerts"
        gradient={['#4280DA', '#1B98E0', '#00B6E9']}
        left={{ text: 'Notifications', route: 'Notifications' }}
        right={{ text: 'Surveys', route: 'Surveys' }}
      />
    ),
  }),
});

const FeedStack = StackNavigator({
  FeedMenu: {
    screen: FeedMenu,
  },
  Categories: {
    screen: Categories,
  },
  Reviews: {
    screen: Reviews,
  },
  Review: {
    screen: Review,
  },
  Settings: {
    screen: Settings,
  },
});


const Tabs = TabNavigator(
  {
    Feed: {
      screen: FeedStack,
      navigationOptions: () => (
        {
          tabBarLabel: 'Feed',
          tabBarIcon: ({ focused }) => <Tab focused={focused} name="feed" />, // eslint-disable-line react/prop-types
        }
      ),
    },
    Profile: {
      screen: ProfileStack,
      navigationOptions: () => (
        {
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused }) => <Tab focused={focused} name="profile" />, // eslint-disable-line react/prop-types
        }
      ),
    },
    Alerts: {
      screen: AlertsStack,
      navigationOptions: () => (
        {
          tabBarLabel: 'Alerts',
          tabBarIcon: ({ focused }) => <Tab focused={focused} name="alerts" />, // eslint-disable-line react/prop-types
        }
      ),
    },
  },
  {
    tabBarPosition: 'bottom',
    tabBarOptions: {
      activeTintColor: 'white',
      inactiveTintColor: 'white',
      style: {
        backgroundColor: '#3D4455',
      },
      labelStyle: {
        fontSize: 10,
      },
    },
  },
);

const Root = SwitchNavigator({
  Auth: {
    screen: Authentication,
  },
  App: {
    screen: Tabs,
  },
}, {
  headerMode: 'none',
});


export default Root;
