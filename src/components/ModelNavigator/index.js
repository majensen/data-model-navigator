import React from 'react';
import _ from 'lodash';
import ReduxDataDictionary from './DataDictionary/ReduxDataDictionary';
import getModelExploreData from './DataDictionary/Service/Dictionary';
import store from '../../store';
import {
  filterConfig,
  controlVocabConfig,
  graphViewConfig,
} from './bento/dataDictionaryData';
// import env from '../../env';

// should take a glob of yaml files.
// const DATA_MODEL = env.REACT_APP_DATA_MODEL;
// const DATA_MODEL_PROPS = env.REACT_APP_DATA_MODEL_PROPS;
const DATA_MODEL = 'https://raw.githubusercontent.com/CBIIT/icdc-model-tool/develop/model-desc/icdc-model.yml';
const DATA_MODEL_PROPS = 'https://raw.githubusercontent.com/CBIIT/icdc-model-tool/develop/model-desc/icdc-model-props.yml';

async function getData() {
  const response = await getModelExploreData(DATA_MODEL, DATA_MODEL_PROPS);
  Promise.all(
    [
      store.dispatch({
        type: 'REACT_FLOW_GRAPH_DICTIONARY',
        dictionary: response.data,
        graphViewConfig,
      }),
      store.dispatch({
        type: 'RECEIVE_DICTIONARY',
        payload: {
          data: response.data,
          facetfilterConfig: filterConfig,
          ctrlVocabConfig: controlVocabConfig,
          graphViewConfig,
        },
      }),
      store.dispatch({
        type: 'RECEIVE_VERSION_INFO',
        data: response.version,
      }),
    ],
  );
}

const ModelNavigator = () => {
  getData();
  return (
    <ReduxDataDictionary />
  );
};

export default ModelNavigator;
