import React from 'react';
import { bool, func } from 'prop-types';
import { Text, SafeAreaView, View, TouchableOpacity, StyleSheet, StatusBar, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import EntypoIcon from 'react-native-vector-icons/dist/Entypo';
import { sortBy } from 'lodash';
import { connect } from 'react-redux';

import Loader from '../components/Loader';
import reviewNetwork from '../services/contracts/review-network';
import { setLoadingAction } from '../redux/actions';
import wallet from '../services/wallet';
import web3 from '../services/web3';
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

  constructor(props) {
    super(props);
    this.state = {
      accounts: {
        '0xfBdc510dAfA85303180392e9D1D01eBA93C21fD8': '0x05ae87771b3cc9e00d80b4ad514051c2693bc9738ef7c164650c226912fc852e',
        '0x277DcD1BB06F70A4Cf98D3A346779ADc2A7b77AD': '0x632a8f3d7e494f99fecf86fe48cfaa97dac2f53b797d7e50711e54d436c78415',
      },
      selectedAccount: wallet.getMyAddress(),
    };
  }

  onChangeAccount(account) {
    this.setState({ selectedAccount: account });
    this.changeAccount(account);
    this.props.navigation.pop();
    this.props.navigation.navigate('Wallet');
  }

  changeAccount(address) {
    wallet.setPrivateKey(this.state.accounts[address]);
    const userWallet = web3.eth.accounts.privateKeyToAccount(this.state.accounts[address]);
    web3.eth.defaultAccount = userWallet.address;
    web3.eth.coinbase = userWallet.address;
  }

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

  renderAccountOptions() {
    return Object.keys(this.state.accounts).map(account => (
      <TouchableOpacity
        style={styles.accountWrapper}
        key={account}
        onPress={() => this.onChangeAccount(account)}
      >
        <Text
          ellipsizeMode="tail"
          numberOfLines={1}
          style={{ fontSize: 14, color: account === this.state.selectedAccount ? '#7B55BA' : 'black' }}
        >
          {account}
        </Text>
      </TouchableOpacity>
    ));
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
        <Text style={styles.accountsTitle}>Accounts</Text>
        {this.renderAccountOptions()}
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
