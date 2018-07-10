import React from 'react';
import { bool, func } from 'prop-types';
import { Text, SafeAreaView, View, TouchableOpacity, StyleSheet, StatusBar, Platform, AsyncStorage } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import EntypoIcon from 'react-native-vector-icons/dist/Entypo';
import { sortBy } from 'lodash';
import { connect } from 'react-redux';

import Loader from '../components/Loader';
import reviewNetwork from '../services/contracts/review-network';
import { setLoadingAction } from '../redux/actions';
import wallet from '../services/wallet';
import surveyApi from '../services/surveys';

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },

  headerBack: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  settingsTitle: {
    fontSize: 30,
    marginTop: 20,
    marginBottom: 20,
  },

  button: {
    backgroundColor: '#7A56B8',
    padding: 12,
    borderRadius: 40,
  },

  buttonText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },

  accountsTitle: {
    fontSize: 22,
    marginTop: 20,
    marginBottom: 20,
  },

  accountWrapper: {
    marginTop: 10,
    padding: 5,
    backgroundColor: 'white',
    borderRadius: 5,
  },

});

class Settings extends React.Component {
  static navigationOptions = ({ navigation }) => (
    {
      header: (
        <LinearGradient colors={['#C719BD', '#9F3CBB', '#7B55BA']} start={{ x: 0, y: 0 }} end={{ y: 0, x: 1 }}>
          <SafeAreaView>
            <StatusBar barStyle="light-content" translucent backgroundColor="rgba(255, 255, 255, 0)" />
            <View style={[styles.headerContainer, { padding: 10, marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight }]}>
              <TouchableOpacity style={{ flex: 1 }} onPress={() => navigation.goBack()}>
                <View style={styles.headerBack}>
                  <EntypoIcon name="chevron-thin-left" size={20} color="white" />
                </View>
              </TouchableOpacity>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text ellipsizeMode="tail" numberOfLines={1} style={{ color: 'white', fontSize: 17 }}>Settings</Text>
              </View>
              <View style={{ flex: 1 }} />
              <View />
            </View>
          </SafeAreaView>
        </LinearGradient>
      ),
    }
  );

  async loadSurveys(cb) {
    const { setLoadingAction: doSetLoadingAction } = this.props;
    doSetLoadingAction(true);
    const reviewNetworkContract = await reviewNetwork.contract;

    reviewNetworkContract.getPastEvents('SurveyStarted', { fromBlock: 0 }, async (error, events) => {
      if (error) {
        console.log(error);
        return;
      }

      const surveys = await Promise
        .all(events
          .map(e => e.returnValues)
          .map(s => reviewNetworkContract
            .methods
            .isSurveyAnsweredBy(s.surveyJsonHash, wallet.getMyAddress())
            .call()
            .then(notAnswered => ({
              answered: !notAnswered,
              ...s,
            }))));

      doSetLoadingAction(false);
      this.setState({ surveys: sortBy(surveys, 'answered') });
      cb(surveys);
    });
  }

  async resetSurveys() {
    const address = wallet.getMyAddress();
    const { setLoadingAction: doSetLoadingAction } = this.props;

    this.loadSurveys(async surveys => {
      doSetLoadingAction(true);
      await surveys
        .reduce((p, s) => p.then(() => surveyApi
          .resetSurvey(s.surveyJsonHash, address)), Promise.resolve(1));
      doSetLoadingAction(false);
    });
  }

  async signOut() {
    await AsyncStorage.removeItem('savedAccount');
    this.props.navigation.navigate('Auth');
  }

  render() {
    return (
      <View style={{ flexDirection: 'column', padding: 10 }}>
        <Loader loading={this.props.loading} />
        <Text style={styles.settingsTitle}>Settings</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => this.resetSurveys()}
        >
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: 'red', marginTop: 30 }]}
          onPress={() => this.signOut()}
        >
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = ({ state: { loading } }) => ({
  loading,
});

const mapDispatchToProps = {
  setLoadingAction,
};

Settings.propTypes = {
  loading: bool,
  setLoadingAction: func.isRequired,
};

Settings.defaultProps = {
  loading: false,
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
