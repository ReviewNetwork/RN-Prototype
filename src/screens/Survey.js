import React from 'react';
import { bool, func } from 'prop-types';
import { View, ScrollView, SafeAreaView, StatusBar, TouchableOpacity, Text, Platform, Alert, StyleSheet, Slider } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import EntypoIcon from 'react-native-vector-icons/dist/Entypo';

import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button';

import ipfs from '../services/ipfs';
import wallet from '../services/wallet';
import rewToken from '../services/contracts/rew-token';
import Loader from '../components/Loader';

import { submitAnswers, setLoadingAction } from '../redux/actions';

const capitalize = ([first, ...rest]) => first.toUpperCase() + rest.join('').toLowerCase();

const styles = StyleSheet.create({
  survey: {
    margin: 15,
  },
  question: {
    padding: 10,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    backgroundColor: '#FFFFFF',
    marginBottom: 5,
  },
  questionText: {
    fontSize: 16,
    marginBottom: 5,
    lineHeight: 30,
  },
  optionText: {
    fontSize: 14,
  },
  surveyDescription: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 15,
  },
  submitButton: {
    marginTop: 5,
    marginBottom: 15,
    marginLeft: 15,
    marginRight: 15,
    backgroundColor: '#7A56B8',
    padding: 12,
    borderRadius: 40,
  },

  buttonText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },

  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },

  headerBack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

class SurveyScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { title } = navigation.state.params.data;
    return {
      header: (
        <LinearGradient
          colors={['#4280DA', '#1B98E0', '#00B6E9']}
          start={{ x: 0.0, y: 0.25 }}
          end={{ x: 0.5, y: 1.0 }}
        >
          <SafeAreaView>
            <StatusBar barStyle="light-content" translucent backgroundColor="rgba(255, 255, 255, 0)" />
            <View style={[styles.headerContainer, { padding: 10, marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight }]}>
              <TouchableOpacity style={{ flex: 1 }} onPress={() => navigation.goBack()}>
                <View style={styles.headerBack}>
                  <EntypoIcon name="chevron-thin-left" size={20} color="white" />
                </View>
              </TouchableOpacity>
              <View style={{ flex: 2, alignItems: 'center' }}>
                <Text style={{ color: 'white', fontSize: 17 }}>{title}</Text>
              </View>
              <View style={{ flex: 1 }} />
              <View />
            </View>
          </SafeAreaView>
        </LinearGradient>
      ),
    };
  }

  state = {
    survey: {},
    answers: {},
  };

  async componentDidMount() {
    const { setLoadingAction: doSetLoadingAction } = this.props;
    doSetLoadingAction(true);

    const { surveyJsonHash } = this.props.navigation.state.params.data;
    ipfs
      .get(surveyJsonHash)
      .then(survey => {
        this.setState({ survey });
        doSetLoadingAction(false);
        return survey;
      })
      .then(json => console.log(json));

    const rewTokenContract = await rewToken.contract;

    rewTokenContract
      .events
      .Transfer({
        from: 0,
        to: 'latest',
        filter: { from: rewToken.contractAddress, to: wallet.getMyAddress() },
      })
      .on('data', event => console.log('data', event));
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.answers !== nextState.answers) {
      return false;
    }
    return true;
  }

  onSelect(question, value) {
    this.setState((prevState) => (
      {
        answers: {
          ...prevState.answers,
          [question.text]: value,
        },
      }
    ));
  }

  doSubmitAnswers(surveyJsonHash, answers) {
    if (Object.values(this.state.answers).length !== this.state.survey.questions.length) {
      alert('Survey Incomplete!');
      return false;
    }
    const {
      navigation,
      submitAnswers: doSubmitAnswers,
      setLoadingAction: doSetLoadingAction,
    } = this.props;

    const { rewardPerSurvey } = navigation.state.params.data;

    const notification = text => {
      doSetLoadingAction(false);
      setTimeout(() => {
        navigation.pop();
        navigation.navigate('Wallet');
        Alert.alert(text);
      });
    };

    doSetLoadingAction(true);
    doSubmitAnswers(surveyJsonHash, answers)
      .then(() => {
        notification(`Congrats! You earned ${rewardPerSurvey} REW.`);
      })
      .catch(() => notification('Sorry, something went wrong.'));
  }

  renderOptionsRange(question) {
    this.onSelect(question, question.from);
    return (
      <View>
        <Slider
          style={{ flex: 1 }}
          step={1}
          thumbImage={require('../assets/img/other/indicator.png')}
          trackImage={require('../assets/img/other/bar.png')}
          thumbTintColor="#7A56B8"
          minimumTrackTintColor="#7A56B8"
          minimumValue={question.from}
          maximumValue={question.to}
          value={question.from}
          onSlidingComplete={val => this.onSelect(question, val)}
        />

        <View style={{ flex: 1, padding: Platform.OS === 'ios' ? 5 : 15, flexDirection: 'row', justifyContent: 'space-between' }}>
          {
            Array(question.to - (question.from - 1)).fill().map((_, i) => question.from + i)
              .map(option => (
                <Text style={styles.optionText} key={option}>{option}</Text>
              ))
          }
        </View>
      </View>
    );
  }

  renderOptionsYesno(question) {
    return (
      <RadioGroup
        onSelect={(_, value) => this.onSelect(question, value)}
        color="#7A56B8"
        activeColor="#7A56B8"
      >
        <RadioButton key="yes" value="yes">
          <Text style={styles.optionText}>Yes</Text>
        </RadioButton>

        <RadioButton key="no" value="no">
          <Text style={styles.optionText}>No</Text>
        </RadioButton>
      </RadioGroup>
    );
  }

  renderOptionsChoice(question) {
    return (
      <RadioGroup
        onSelect={(_, value) => this.onSelect(question, value)}
        color="#7A56B8"
        activeColor="#7A56B8"
      >
        {
          question.choices
            .map(option => (
              <RadioButton key={option} value={option}>
                <Text style={styles.optionText}>{option}</Text>
              </RadioButton>
            ))
        }
      </RadioGroup>
    );
  }

  renderQuestion(question) {
    const options = this[`renderOptions${capitalize(question.type)}`](question);
    return (
      <View style={styles.question} key={question.text}>
        <Text style={styles.questionText}>{question.text}</Text>
        {options}
      </View>
    );
  }

  renderSurvey(survey) {
    return (
      <View style={styles.survey}>
        <Text style={styles.surveyDescription}>{survey.description}</Text>
        <View>
          {survey.questions && survey.questions.map(q => this.renderQuestion(q))}
        </View>
      </View>
    );
  }

  render() {
    const { survey, answers } = this.state;
    const { loading } = this.props;
    const { surveyJsonHash } = this.props.navigation.state.params.data;
    return (
      <ScrollView>
        <Loader loading={loading} />
        {
          survey && this.renderSurvey(survey)
        }
        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => this.doSubmitAnswers(surveyJsonHash, answers)}
        >
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

const mapStateToProps = ({ state: { loading } }) => ({ loading });

const mapDispatchToProps = {
  submitAnswers,
  setLoadingAction,
};

SurveyScreen.propTypes = {
  loading: bool,
  submitAnswers: func.isRequired,
  setLoadingAction: func.isRequired,
};

SurveyScreen.defaultProps = {
  loading: false,
};

export default connect(mapStateToProps, mapDispatchToProps)(SurveyScreen);
