import categories from '../../services/categories';
import wallet from '../../services/wallet';
import surveys from '../../services/surveys';

/**
 * App
 */
export const setLoadingAction = payload => ({
  type: 'app/SET_LOADING',
  payload,
});

export const setError = (payload) => ({
  type: 'SET_ERROR',
  payload,
});

/**
 * Categories
 */
export const loadCategoriesAction = payload => ({
  type: 'categories/LOAD_CATEGORIES',
  payload,
});

export const loadCategories = () =>
  dispatch =>
    categories
      .loadCategories()
      .then(categoriesJson => dispatch(loadCategoriesAction(categoriesJson)))
      .catch((err) => {
        alert('Something went wrong!');
        dispatch({ type: 'SET_ERROR', payload: err });
      });

/**
 * Wallet
 */
export const loadMyBalanceAction = payload => ({
  type: 'wallet/LOAD_MY_BALANCE',
  payload,
});

export const loadMyBalance = () =>
  dispatch =>
    wallet
      .getMyBalance()
      .then(balance => dispatch(loadMyBalanceAction(balance)))
      .catch((err) => {
        alert('Something went wrong!');
        dispatch({ type: 'SET_ERROR', payload: err });
      });

/**
 * Survey
 */
export const submitAnswersDone = payload => ({
  type: 'survey/SUBMIT_ANSWERS_DONE',
  payload,
});

export const submitAnswers = (surveyHash, answers) =>
  dispatch =>
    surveys
      .submitAnswers(surveyHash, answers)
      .then(() => dispatch(submitAnswersDone(null)))
      .catch((err) => {
        alert('Something went wrong!');
        dispatch({ type: 'SET_ERROR', payload: err });
      });
