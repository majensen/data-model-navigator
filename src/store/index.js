import { configureStore } from '@reduxjs/toolkit';

// import { ddgraph, versionInfo } from '../components/ModelNavigator/DataDictionary/Store/reducers/graph';
// import { moduleReducers as submission } from '../components/ModelNavigator/DataDictionary/Store/reducers/filter';

import filterReducer from '../features/filter/filterSlice';

const store = configureStore({
  reducer: {
    filter: filterReducer,
  }
});

// store.injectReducer = (key, reducer) => {
//   reducers[key] = reducer;
//   store.replaceReducer(combineReducers(reducers));
// };

export default store;
