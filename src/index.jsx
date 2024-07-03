import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';
import store from './store';
import { MDFReader } from 'mdf-reader';
import ModelNavigator from  './components/ModelNavigator';

import {
  brandIconSrc,
  facetSections,
  facetFilters,
  tagAttributes,
  legendTag,
  annotationTags,
  mdfParseHooks,
} from './ICDCconfig.js';
import {
  createConfig,
  filterConfig,
  controlVocabConfig,
  graphViewConfig,
} from './components/ModelNavigator/Config/nav.config';
import loadMDFDictionary from './components/ModelNavigator/Model/loadMDF';
import { ConfigContext } from './components/ModelNavigator/Config/ConfigContext';
import { ModelContext } from './components/ModelNavigator/Model/ModelContext';
import './components/ModelNavigator/index.css';
const mdf_urls = ['https://raw.githubusercontent.com/CBIIT/icdc-model-tool/develop/model-desc/icdc-model.yml',
                  'https://raw.githubusercontent.com/CBIIT/icdc-model-tool/develop/model-desc/icdc-model-props.yml'];

function getModel() {
  return loadMDFDictionary(...mdf_urls)
    .then( (model) => model );
}
const config = createConfig({
  brandIconSrc,
  facetSections,
  facetFilters,
  tagAttributes,
  legendTag,
  annotationTags,
});
mdfParseHooks.forEach( (func) => {
  MDFReader.add_parse_hook( func );
});

const model = await getModel(); // eslint-disable-line no-undef

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ConfigContext.Provider value={config}>
      <ModelContext.Provider value={model}>
        <ModelNavigator />
      </ModelContext.Provider>
      </ConfigContext.Provider>
    </Provider>
  </React.StrictMode>
);
