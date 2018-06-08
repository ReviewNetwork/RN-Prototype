import { combineReducers } from 'redux';

const DEFAULT_STATE = {
  categories: [],
  myBalance: 0,
  loading: false,
};

const rootReducer = combineReducers({
  state: (state = DEFAULT_STATE, action) => {
    switch (action.type) {
      case 'categories/LOAD_CATEGORIES':
        return {
          ...state,
          categories: action.payload,
        };
      case 'wallet/LOAD_MY_BALANCE':
        return {
          ...state,
          myBalance: action.payload,
        };
      case 'app/SET_LOADING':
        return {
          ...state,
          loading: action.payload,
        };
      case 'SET_ERROR':
        return {
          ...state,
          error: action.payload,
        };
      default:
        return state;
    }
  },
});

export default rootReducer;
