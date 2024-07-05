import React from 'react';
import { Provider } from 'react-redux';
import DataDictionary from './DataDictionary';
import store from '../../store';
import { createConfig } from './Config/nav.config';
import { ConfigContext } from './Config/ConfigContext';
import { ModelContext } from './Model/ModelContext';

export default function ModelNavigator({
  model,
  customConfig,
}) {
  const config = createConfig(customConfig);
  return (
    <Provider store={store}>
      <ConfigContext.Provider value={config}>
      <ModelContext.Provider value={model}>
        <DataDictionary />
      </ModelContext.Provider>
      </ConfigContext.Provider>
    </Provider>
  );
}



