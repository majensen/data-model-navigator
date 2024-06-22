// isolate DataDictionary
import React, { useState } from 'react';
import { Provider, useSelector } from 'react-redux';
import ReactDOM from 'react-dom/client';
import {
  filterConfig,
  controlVocabConfig,
  graphViewConfig,
} from './components/ModelNavigator/config/nav.config';
import loadMDFModel from './components/ModelNavigator/loadMDF';
import store from './store';
import { modelReceived,
         configsLoaded,
         selectModel,
         selectDisplayedTagMatrix,
         selectConfigs,
       } from './features/filter/filterSlice';
import ReduxFacetFiltersView from './components/ModelNavigator/DataDictionary/Search/Filter/ReduxFacetFiltersView';

const mdf_urls = ['https://raw.githubusercontent.com/CBIIT/icdc-model-tool/develop/model-desc/icdc-model.yml',
                  'https://raw.githubusercontent.com/CBIIT/icdc-model-tool/develop/model-desc/icdc-model-props.yml'];

function getModel() {
  loadMDFModel(...mdf_urls)
    .then( (model) => model)
    .then( (model) => {
      store.dispatch( configsLoaded({configs: { filterConfig }}) );
      return model;
    })
    .then( (model) => {
      store.dispatch( modelReceived({model}) );
    })
}

await getModel();

// 

const Table = () => {
  const configs = useSelector( selectConfigs );
  const nc = useSelector( selectDisplayedTagMatrix );
  const rows  = Object.keys(nc)
        .map( (key) => 
          Object.keys(nc[key])
            .map( (val) => {
              return (
                <tr>
                  <td>{key}</td>
                  <td>{val}</td>
                  <td>{nc[key][val].nodes.join()}</td>
                  <td>{nc[key][val].count}</td>
                </tr>
              );
            })
        );
  return (
    <div>
      <table>
        {rows}
      </table>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      {/* <Table /> */}
      <ReduxFacetFiltersView />
    </Provider>
  </React.StrictMode>
);
