import React from 'react';
import ReactDOM from 'react-dom/client';
import { MDFReader } from 'mdf-reader';
import ModelNavigator, { loadMDF } from  './components/ModelNavigator';

import {
  brandIconSrc,
  facetSections,
  facetFilters,
  tagAttributes,
  legendTag,
  annotationTags,
  mdfParseHooks,
} from './ICDCconfig.js';

const config = {
  brandIconSrc,
  facetSections,
  facetFilters,
  tagAttributes,
  legendTag,
  annotationTags,
  mdfParseHooks,
};

const mdf_urls = ['https://raw.githubusercontent.com/CBIIT/gdc-model/main/model-desc/gdc-model.yaml',
                  'https://raw.githubusercontent.com/CBIIT/gdc-model/main/model-desc/gdc-model-props.yaml',
                 'https://raw.githubusercontent.com/CBIIT/gdc-model/main/model-desc/gdc-model-terms.yaml']

function getModel() {
  return loadMDF(...mdf_urls)
    .then( (model) => model );
}

mdfParseHooks.forEach( (func) => {
  MDFReader.add_parse_hook( func );
});

const model = await getModel(); // eslint-disable-line no-undef

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ModelNavigator
      model={model}
      // customConfig={config}
    />
  </React.StrictMode>
);
