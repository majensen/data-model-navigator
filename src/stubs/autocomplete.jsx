// isolate AutoComplete
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import loadMDFDictionary from './components/ModelNavigator/loadMDF';
import AutoComplete from './components/ModelNavigator/DataDictionary/Search/AutoComplete/AutoCompleteView';
import {
  prepareSearchData
} from './components/ModelNavigator/DataDictionary/Search/DictionarySearcher/searchHelper';
import {
  SearchDataContext,
  SearchHistoryContext,
} from './components/ModelNavigator/DataDictionary/Search/SearchContext';

import './components/ModelNavigator/index.css';

const mdf_urls = ['https://raw.githubusercontent.com/CBIIT/icdc-model-tool/develop/model-desc/icdc-model.yml',
                  'https://raw.githubusercontent.com/CBIIT/icdc-model-tool/develop/model-desc/icdc-model-props.yml'];

function getSearchData() {
  return loadMDFDictionary(...mdf_urls)
    .then( (model) => prepareSearchData(model) );
}
const sdata = await getSearchData();

function AutoCompleteWrapper() {
  const [searchData, setSearchData] = useState(sdata);
  const [searchHistoryItems, setSearchHistoryItems] = useState([])
  return (
    <SearchHistoryContext.Provider value={{searchHistoryItems, setSearchHistoryItems}}>
      <SearchDataContext.Provider value={searchData}>
        <AutoComplete
          inputPlaceHolderText="input"
          inputTitle="Input"
        />
      </SearchDataContext.Provider>
    </SearchHistoryContext.Provider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <AutoCompleteWrapper />
    </React.StrictMode>
);
