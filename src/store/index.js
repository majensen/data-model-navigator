import { configureStore } from '@reduxjs/toolkit';

// import { ddgraph, versionInfo } from '../components/ModelNavigator/DataDictionary/Store/reducers/graph';
// import { moduleReducers as submission } from '../components/ModelNavigator/DataDictionary/Store/reducers/filter';

import filterReducer from '../features/filter/filterSlice';
import graphReducer from '../features/graph/graphSlice';
import searchReducer from '../features/search/searchSlice';

const store = configureStore({
  reducer: {
    filter: filterReducer,
    graph: graphReducer,
    search: searchReducer,
  }
});

// store.injectReducer = (key, reducer) => {
//   reducers[key] = reducer;
//   store.replaceReducer(combineReducers(reducers));
// };

export default store;
