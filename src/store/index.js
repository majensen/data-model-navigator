import { configureStore } from '@reduxjs/toolkit';

// import { ddgraph, versionInfo } from '../components/ModelNavigator/DataDictionary/Store/reducers/graph';
// import { moduleReducers as submission } from '../components/ModelNavigator/DataDictionary/Store/reducers/filter';

import filterReducer from '../features/filter/filterSlice';
import graphReducer from '../features/graph/graphSlice';
import searchReducer from '../features/search/searchSlice';

const store = configureStore({
  reducer: { // order below matters
    search: searchReducer, 
    filter: filterReducer,
    graph: graphReducer,
  }
});

export default store;
