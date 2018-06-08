import reviewNetwork from './contracts/review-network';
import ipfs from './ipfs';

class SurveysApi {
  async submitAnswers(surveyJsonHash, answers) {
    try {
      const rn = await reviewNetwork.contract;
      const hash = await ipfs.store(answers);
      return reviewNetwork.sendSigned(rn.methods.answerSurvey(surveyJsonHash, hash))
        .then(x => console.log('then', x))
        .catch(x => console.log('catch', x));
    } catch (error) {
      console.log('damnnnn', error);
      return Promise.reject();
    }
  }

  async resetSurvey(surveyJsonHash, address) {
    try {
      const rn = await reviewNetwork.contract;
      return reviewNetwork.sendSigned(rn.methods.resetSurveyAnswer(surveyJsonHash, address))
        .then(x => console.log('then', x))
        .catch(x => console.log('catch', x));
    } catch (error) {
      console.log('damnnnn', error);
      return Promise.reject();
    }
  }
}

export default new SurveysApi();
