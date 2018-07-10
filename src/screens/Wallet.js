import React from 'react';
import { bool, object, func, number } from 'prop-types';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import Web3 from '../services/web3';

import EmptyState from '../components/EmptyState';

import { loadMyBalance, setLoadingAction } from '../redux/actions';
import Loader from '../components/Loader';
import reviewNetwork from '../services/contracts/review-network';
import wallet from '../services/wallet';

const styles = StyleSheet.create({
  surveyWrapper: {
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  surveyRewardWrapper: {
    flex: 1,
    alignItems: 'flex-end',
  },

  surveyReward: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#555555',
  },

  surveyInfo: {
    flex: 1,
    justifyContent: 'center',
  },

  profileInfoWrapper: {
    maxHeight: 250,
    padding: 20,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  logo: {
    height: 100,
    width: 130,
    marginBottom: 20,
  },

  reloadButton: {
    backgroundColor: '#7A56B8',
    padding: 12,
    borderRadius: 40,
    marginBottom: 40,
  },

  buttonText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },

  ether: {
    color: 'grey',
    fontWeight: 'bold',
  },

  etherEmpty: {
    color: 'red',
    fontWeight: 'bold',
  },


});

class WalletScreen extends React.Component {
  constructor() {
    super();

    this.state = {
      surveys: [],
      ether: 0,
    };
  }

  async componentDidMount() {
    const { setLoadingAction: doSetLoadingAction } = this.props;

    this.doLoadMyBalance();

    doSetLoadingAction(true);
    const reviewNetworkContract = await reviewNetwork.contract;

    reviewNetworkContract.getPastEvents('SurveyAnswered', {
      fromBlock: 0,
      filter: {
        user: wallet.getMyAddress(),
      },
    }, async (error, events) => {
      if (error) {
        console.log(error);
        return;
      }

      const surveys = events.map(e => e.returnValues).filter((event) => (
        event[0] === wallet.getMyAddress()
      )).reverse();

      doSetLoadingAction(false);
      this.setState({ surveys });
    });

    this.setState({ether: await this.getEtherAmount()});
  }

  getEtherAmount = async () => {
    const amount = await Web3.utils.fromWei(await Web3.eth.getBalance(wallet.getMyAddress()));
    return amount;
  }

  async doLoadMyBalance() {
    const { loadMyBalance: doLoadMyBalance, setLoadingAction: doSetLoadingAction } = this.props;
    doSetLoadingAction(true);
    await doLoadMyBalance();
    doSetLoadingAction(false);
  }

  renderEvent(survey, i) {
    return (
      <View style={styles.surveyWrapper} key={`${survey.title}-${i}`}>
        <View style={styles.surveyInfo}>
          <Text style={{ fontSize: 12 }}>Answered Survey {survey.title}</Text>
        </View>
        <View style={styles.surveyRewardWrapper}>
          <Text style={styles.surveyReward}>+{survey.rewardPerSurvey} REW</Text>
        </View>
      </View>
    );
  }

  renderEvents() {
    return (
      this.state.surveys.length ?
        <View>
          {this.state.surveys.map((s, i) => this.renderEvent(s, i))}
        </View>
        :
        <EmptyState message="No surveys right now!" />
    );
  }

  render() {
    const { loadMyBalance: doLoadMyBalance, myBalance, loading, error } = this.props;

    return (
      <ScrollView>
        <Loader loading={loading && !error} />
        <View style={styles.profileInfoWrapper}>
          <Image
            style={styles.logo}
            source={require('../assets/logo.png')}
          />
          <Text style={{ fontSize: 13 }}>{wallet.getMyAddress()}</Text>
          <Text style={{ fontSize: 25 }}>{myBalance} REW</Text>
          <Text style={this.state.ether > 0 ? styles.ether : styles.etherEmpty}>+ {this.state.ether} ETH</Text>
        </View>
        <View style={{ padding: 20 }}>
          <TouchableOpacity
            style={styles.reloadButton}
            onPress={() => doLoadMyBalance()}
          >
            <Text style={styles.buttonText}>Reload</Text>
          </TouchableOpacity>
          {
            this.renderEvents()
          }
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = ({ state: { myBalance, loading, error } }) => ({
  myBalance,
  loading,
  error,
});

const mapDispatchToProps = {
  loadMyBalance,
  setLoadingAction,
};

WalletScreen.propTypes = {
  error: object,
  loading: bool,
  myBalance: number.isRequired,
  loadMyBalance: func.isRequired,
  setLoadingAction: func.isRequired,
};

WalletScreen.defaultProps = {
  error: null,
  loading: false,
};

export default connect(mapStateToProps, mapDispatchToProps)(WalletScreen);
