// isolate DataDictionary
import React, { useState } from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';
import {
  filterConfig,
  controlVocabConfig,
  graphViewConfig,
} from './components/ModelNavigator/config/nav.config';
import loadMDFDictionary from './components/ModelNavigator/loadMDF';
import store from './store';
import ReduxDataDictionary from './components/ModelNavigator/DataDictionary/ReduxDataDictionary';

import './components/ModelNavigator/index.css';

const mdf_urls = ['https://raw.githubusercontent.com/CBIIT/icdc-model-tool/develop/model-desc/icdc-model.yml',
                  'https://raw.githubusercontent.com/CBIIT/icdc-model-tool/develop/model-desc/icdc-model-props.yml'];

function getModel() {
  return loadMDFDictionary(...mdf_urls)
    .then( (model) => { 
      return Promise.all(
        [
          store.dispatch({
            type: 'REACT_FLOW_GRAPH_DICTIONARY',
            model: model,
            graphViewConfig,
          }),
          store.dispatch({
            type: 'RECEIVE_DICTIONARY',
            payload: {
              model: model,
              facetfilterConfig: filterConfig,
              ctrlVocabConfig: controlVocabConfig,
              graphViewConfig,
            },
          }),
          store.dispatch({
            type: 'RECEIVE_VERSION_INFO',
            data: {model: model.version || 'test'},
          }),
        ]
      );
    });
}

const p = await getModel();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ReduxDataDictionary />
    </Provider>
  </React.StrictMode>
);
