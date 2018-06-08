import React from 'react';
import { Provider } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';

import Root from './config/router';
import store from './redux';


class App extends React.Component {
  componentDidMount() {
    SplashScreen.hide();
  }

  render() {
    return (
      <Provider store={store}>
        <Root />
      </Provider>
    );
  }
}

export default App;
