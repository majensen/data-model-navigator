import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { ddgraph, versionInfo } from '../components/ModelNavigator/DataDictionary/Store/reducers/graph';

import { moduleReducers as submission } from '../components/ModelNavigator/DataDictionary/Store/reducers/filter';

const reducers = {
  ddgraph,
  versionInfo,
  submission,
};

const loggerMiddleware = createLogger();

const store = createStore(
  combineReducers(reducers),
  applyMiddleware(thunk, loggerMiddleware),
);

store.injectReducer = (key, reducer) => {
  reducers[key] = reducer;
  store.replaceReducer(combineReducers(reducers));
};

export default store;
