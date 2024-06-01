import { configureStore } from '@reduxjs/toolkit';

import { ddgraph, versionInfo } from '../components/ModelNavigator/DataDictionary/Store/reducers/graph';
import { moduleReducers as submission } from '../components/ModelNavigator/DataDictionary/Store/reducers/filter';

const store = configureStore({
  reducer: {
    ddgraph,
    submission,
    versionInfo,
  }
});

// store.injectReducer = (key, reducer) => {
//   reducers[key] = reducer;
//   store.replaceReducer(combineReducers(reducers));
// };

export default store;
