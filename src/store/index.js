import { configureStore } from '@reduxjs/toolkit';

import filterReducer from '../features/filter/filterSlice';
import graphReducer from '../features/graph/graphSlice';
import searchReducer from '../features/search/searchSlice';

const store = configureStore({
  reducer: { // order below matters
    search: searchReducer, 
    filter: filterReducer,
    graph: graphReducer,
  },
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: {
      ignoredActionPaths: ['payload'],
    }
  }),
});

export default store;
