import React from 'react';
import axios from 'axios';
import _ from 'lodash';
import ReduxDataDictionary from './DataDictionary/ReduxDataDictionary';
import loadMDFDictionary from './loadMDF';
import store from '../../store';
import {
  filterConfig,
  controlVocabConfig,
  graphViewConfig,
} from './config/nav.config';

// import env from '../../env';
// should take a glob of yaml files.

const mdf_urls = ['https://raw.githubusercontent.com/CBIIT/icdc-model-tool/develop/model-desc/icdc-model.yml',
                  'https://raw.githubusercontent.com/CBIIT/icdc-model-tool/develop/model-desc/icdc-model-props.yml'];

function getData() {
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

const ModelNavigator = async () => {
  await getData();
  return (
    <ReduxDataDictionary />
  );
};

export default ModelNavigator;
