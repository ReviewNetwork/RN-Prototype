import React from 'react';
import { bool, object, func } from 'prop-types';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { connect } from 'react-redux';
import { sortBy } from 'lodash';

import Loader from '../components/Loader';
import reviewNetwork from '../services/contracts/review-network';
import { setLoadingAction, setError } from '../redux/actions';
import wallet from '../services/wallet';

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  survey: {
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
  surveyActive: {
    opacity: 1,
  },
  surveyInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  surveyInfo: {
    alignContent: 'flex-start',
  },
  surveyReward: {
    width: 160,
  },
  surveyInfoText: {
    textAlign: 'left',
    fontSize: 14,
    marginLeft: 10,
  },
  surveyRewardText: {
    textAlign: 'right',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 5,
    color: '#555555',
  },
});

class SurveysScreen extends React.Component {
  constructor() {
    super();

    this.state = {
      surveys: [],
    };
  }

  async componentDidMount() {
    this.loadSurveys();
  }

  onNavigateBack() {
    this.loadSurveys();
  }

  async loadSurveys() {
    const { setLoadingAction: doSetLoadingAction, setError } = this.props;
    doSetLoadingAction(true);
    let reviewNetworkContract;
    try {
      reviewNetworkContract = await reviewNetwork.contract;
    } catch (err) {
      alert('Something went wrong!');
      setError(err);
    }


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

      console.log(surveys);

      doSetLoadingAction(false);
      this.setState({ surveys: sortBy(surveys, 'answered') });
    });
  }

  goToSurvey(survey) {
    const { navigation } = this.props;
    navigation.navigate('Survey', { data: survey, name: survey.description, onNavigateBack: () => this.onNavigateBack() });
  }

  renderSurvey(survey) {
    return (
      <View key={survey.title}>
        <TouchableOpacity
          style={styles.survey}
          onPress={() => this.goToSurvey(survey)}
        >
          <View style={styles.surveyInfoContainer}>
            <View style={styles.surveyInfo}>
              <Image source={require('../assets/img/other/survey-icon.png')} style={{ height: 30, width: 30 }} />
            </View>
            <View style={styles.surveyInfo}>
              <Text style={styles.surveyInfoText}>{survey.title}</Text>
            </View>
          </View>
          <View style={styles.surveyReward}>
            <Text style={styles.surveyRewardText}>{survey.rewardPerSurvey} REW</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const { surveys = [] } = this.state;
    const { loading, error } = this.props;

    return (
      <View style={styles.container}>
        <Loader loading={loading && !error} />
        <Text style={styles.title}>Surveys</Text>
        {surveys.map(s => this.renderSurvey(s))}
      </View>
    );
  }
}

const mapStateToProps = ({ state: { loading, error } }) => ({
  loading,
  error,
});

const mapDispatchToProps = {
  setLoadingAction,
  setError,
};

SurveysScreen.propTypes = {
  loading: bool,
  error: object,
  setLoadingAction: func.isRequired,
  setError: func.isRequired,
};

SurveysScreen.defaultProps = {
  loading: false,
  error: null,
};

export default connect(mapStateToProps, mapDispatchToProps)(SurveysScreen);
