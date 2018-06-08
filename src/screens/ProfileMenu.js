import React from 'react';
import { View, Button } from 'react-native';


export default ({ navigation }) => (
  <View>
    <Button onPress={() => navigation.navigate('Wallet')} title="Wallet" />
    <Button onPress={() => navigation.navigate('MyReviews')} title="My Reviews" />
  </View>
);
