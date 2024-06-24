// isolate DataDictionary
/* eslint-disable no-undef */
import React, { useState } from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';
import {
  filterConfig,
  controlVocabConfig,
  graphViewConfig,
} from './components/ModelNavigator/config/nav.config';
import loadMDFModel from './components/ModelNavigator/Model/loadMDF';
import store from './store';
import CanvasController from "./components/ModelNavigator/DataDictionary/ReactFlowGraph/Canvas/CanvasController";

import './components/ModelNavigator/index.css';

const mdf_urls = ['https://raw.githubusercontent.com/CBIIT/icdc-model-tool/develop/model-desc/icdc-model.yml',
                  'https://raw.githubusercontent.com/CBIIT/icdc-model-tool/develop/model-desc/icdc-model-props.yml'];

function getModel() {
  return loadMDFModel(...mdf_urls)
    .then( (model) => model);
}

globalThis.model = await getModel();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <CanvasController model={model}
                        tabViewWidth={200}
                        graphViewConfig={{
                          legend: {
                          },
                          canvas: {
                            fit: {
                              x: 0,
                              y: 20,
                              zoom: 0.7,
                              minZoom: 0.1,
                              maxZoom: 2,
                            },
                          },
                        }} />
    </Provider>
  </React.StrictMode>
);
