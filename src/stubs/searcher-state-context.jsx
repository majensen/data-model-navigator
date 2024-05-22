// isolate DictionarySearcher - no Redux
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import {
  filterConfig,
  controlVocabConfig,
  graphViewConfig,
} from './components/ModelNavigator/config/nav.config';
import loadMDFDictionary from './components/ModelNavigator/loadMDF';
import DictionarySearcher from './components/ModelNavigator/DataDictionary/Search/DictionarySearcher/DictionarySearcher';
import { SearchHistoryContext,
         SearchDataContext,
         SuggestionContext,
         SearchResultContext } from './components/ModelNavigator/DataDictionary/Search/SearchContext';

import './components/ModelNavigator/index.css';
const mdf_urls = ['https://raw.githubusercontent.com/CBIIT/icdc-model-tool/develop/model-desc/icdc-model.yml',
                  'https://raw.githubusercontent.com/CBIIT/icdc-model-tool/develop/model-desc/icdc-model-props.yml'];

function getModel() {
  return loadMDFDictionary(...mdf_urls)
    .then( (model) => model );
}

const model = await getModel();


function DictionarySearcherWrapper({ model }) {

  const [searchData, setSearchData] = useState();
  const [searchHistoryItems, setSearchHistoryItems] = useState([]);
  
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchFinished, setIsSearchFinished] = useState(false);
  const [currentSearchKeyword, setCurrentSearchKeyword] = useState("");
  const [searchResult, setSearchResult] = useState(
    {
      matchedNodes: [],
      summary: {},
    });
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [suggestionList, setSuggestionList] = useState([]);
  const [clickedSuggestionItem, setClickedSuggestionItem] = useState([])

  
  return (
    <SearchHistoryContext.Provider value={{searchHistoryItems, setSearchHistoryItems}}>
      <SearchDataContext.Provider value={{searchData, setSearchData}}>
        <SuggestionContext.Provider value={{
                                      suggestionList,
                                      setSuggestionList,
                                      clickedSuggestionItem,
                                      setClickedSuggestionItem,
                                    }}>
          <SearchResultContext.Provider value={{
                                          isSearching, setIsSearching,
                                          isSearchFinished, setIsSearchFinished,
                                          searchResult, setSearchResult,
                                          hasError, setHasError,
                                          errorMsg, setErrorMsg,
                                          currentSearchKeyword, setCurrentSearchKeyword,
                                        }}>
            
            <DictionarySearcher model={model} />
          </SearchResultContext.Provider>
        </SuggestionContext.Provider>
      </SearchDataContext.Provider>
    </SearchHistoryContext.Provider>
  )}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <DictionarySearcherWrapper model={model} />
  </React.StrictMode>
);
