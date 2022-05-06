# Bento UI Building Blocks

Bento UI Building Blocks is a NPM library in an attempt to reuse the shared UI components across NCI data commons frameworks.

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install Bento UI Building Blocks.

```bash
npm install model-explorer
```

## Usage

### redux configuration
``` store
import { createStore, applyMiddleware, combineReducers } from 'redux';
import ReduxThunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { modelReducers, ddgraph, versionInfo } from 'model-explorer';
import layout from '../components/Layout/LayoutState';
import stats from '../components/Stats/StatsState';
const storeKey = 'submission';
const initialState = {
  allActiveFilters: {},
  unfilteredDictionary: {},
  filteredDictionary: {},
  activeFilter: false,
  filtersCleared: false,
  filterGroup: '',
  filterHashMap: new Map(),
};
const reducers = {
  layout,
  stats,
  ddgraph,
  versionInfo,
};

const loggerMiddleware = createLogger();

const store = createStore(
  combineReducers(reducers),
  applyMiddleware(ReduxThunk, loggerMiddleware),
);

store.injectReducer = (key, reducer) => {
  reducers[key] = reducer;
  store.replaceReducer(combineReducers(reducers));
};

store.injectReducer(storeKey, (state = initialState, { type, payload }) => (
  modelReducers[type] ? modelReducers[type](state, payload) : state));

export default store;
```
### Create ModelExplorer component
```react
import React from 'react';
import { ReduxDataDictionary, getModelExploreData } from 'model-explorer';
import store from '../../store';

async function getData() {
  const response = await getModelExploreData();
  Promise.all(
    [
      store.dispatch({
        type: 'RECEIVE_DICTIONARY',
        payload: { data: response.data },
      }),
      store.dispatch({
        type: 'RECEIVE_VERSION_INFO',
        data: response.version,
      }),
    ],
  );
}

const ModelExplorer = () => {
  getData();
  return (
    <ReduxDataDictionary />
  );
};

export default ModelExplorer;
```

## Scripts Available

```
### `npm run storybook`

Runs the app in the development mode.
Open [http://localhost:9001](http://localhost:9001) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.
```
```
### `npm run storybook`

Builds the app for production to the `lib`  and  `es` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

Your app is ready to be deployed!

```
