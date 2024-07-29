import React from 'react';
import { Provider } from 'react-redux';
import _ from 'lodash';
import DataDictionary from './DataDictionary';
import store from '../../store';
import { createConfig, defaultConfig } from './Config/nav.config';
import { ConfigContext } from './Config/ConfigContext';
import { ModelContext } from './Model/ModelContext';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import loadMDF from './Model/loadMDF';
import './index.css';

export { loadMDF };

const defaultTheme = createTheme();

export default function ModelNavigator({
  model,
  customConfig,
}) {
  const config = createConfig(customConfig || defaultConfig);
  // create default checkboxes from Category values
  // if not already specified
  if (config.facetFilters
      && !config.facetFilters.checkboxItems) {
    config.facetFilters.forEach( (filt) => {
      if (filt.tag === 'Category') {
        filt.checkboxItems = model.tag_kvs('Category')
          .flatMap( ([tag, value]) =>
            ({ name: _.capitalize(value), tag: 'Category',
               value, isChecked: false, group: 'category' }));
      }
    });
  }

  return (
    <Provider store={store}>
    <ThemeProvider theme={defaultTheme}>
      <ConfigContext.Provider value={config}>
      <ModelContext.Provider value={model}>
        <DataDictionary />
      </ModelContext.Provider>
      </ConfigContext.Provider>
    </ThemeProvider>
    </Provider>
  );
}



