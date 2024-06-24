import { createSlice, createSelector } from '@reduxjs/toolkit';
import {compareTwoStrings} from 'string-similarity';
import _ from 'lodash';
import {
  getSearchSummary,
  calcMatchedStrings,
  storeSearchHistoryItem,
  retrieveSearchHistoryItems,
} from '../../components/ModelNavigator/DataDictionary/Search/DictionarySearcher/searchHelper';

import {
  selectHighlightingMatchedNodeID,
} from '../graph/graphSlice';

// matchedResult - getSearchResultItem

const initialState = {
  searchHistoryItems: retrieveSearchHistoryItems(),
  currentSearchKeyword: '',
  searchString: '',
  lastSearchError: '',
  searchResult: null,
  overlayPropertyHidden: true,
  matchedNodeIDs:[],
  matchedNodeIDsInNameAndDescription: [],
  matchedNodeIDsInProperties: [],
  searchData: null,
  suggestionList: [],
  clickedSuggestionItem: null,
  isSearchMode: false,
  isSearching: false,
};

// searchMode is set when SEARCH_RESULT_UPDATED - setSearchResult - mapped to onSearchResultUpdated
// searchMode is cleared when SEARCH_RESULT_CLEARED - clearSearchResult - mapped to onSearchResultCleared

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    searchResultCleared(state, action) {
      state.isSearchMode = false;
      state.searchResult = null;
    },
    searchStarted(state, action) {
      const searchString = action.payload;
      state.searchString = searchString;
      state.isSearching = true;
    },
    searchCompleted(state, action) {
      const {result, errorMsg, store} = action.payload;
      state.isSearching = false;
      state.searchString = "";
      if (!result || result.length === 0) {
        state.searchResult = null;
        state.lastSearchError = errorMsg || 'error';
        state.suggestionList = [];
      }
      else {
        const summary = getSearchSummary(result);
        state.searchResult = {
          matchedNodes: result,
          summary
        };
        state.lastSearchError = '';
        state.currentSearchKeyword = state.searchString;
        if (store) {
          state.searchHistoryItems = storeSearchHistoryItem({
            keywordStr: state.searchString,
            matchedCount: summary.generalMatcheNodeIDs.length
          });
        }
        const matchedStrings = calcMatchedStrings(result);
        state.suggestionList = Object.keys(matchedStrings)
          .sort( (str1, str2) =>
            compareTwoStrings(str2,state.searchString) -
              compareTwoStrings(str1,state.searchString) )
          .map( (s) => ({
            fullString: s,
            matchedPieceIndices: matchedStrings[s].matchedPieceIndices,
          }));
        state.isSearchMode = true;
      }
    },
    suggestionItemClicked(state, action) {
      const suggestionItem = action.payload;
      state.clickedSuggestionItem = suggestionItem;
    },
    suggestionItemReset(state, action) {
      state.clickedSuggestionItem = null;
    },
  },
});

export const {
  // reducer/actions
  searchResultCleared,
  searchStarted,
  searchCompleted,
  suggestionItemClicked,
  suggestionItemReset,
} = searchSlice.actions;

export default searchSlice.reducer;

// export Selectors

export const selectIsSearchMode = state => state.search.isSearchMode;
export const selectIsSearching = state => state.search.isSearching;
export const selectLastSearchError =  state => state.search.lastSearchError;
export const selectOverlayPropertyHidden = state => state.search.overlayPropertyHidden;
export const selectCurrentSearchKeyword = state => state.search.currentSearchKeyword;
export const selectSearchData = state => state.search.searchData;
export const selectSearchResult = state => state.search.searchResult;
export const selectSearchHistoryItems = state => state.search.searchHistoryItems;
export const selectClickedSuggestionItem = state => state.search.clickedSuggestionItem;
export const selectSuggestionList = state => state.search.suggestionList;
export const selectMatchedNodeIDs = state => state.search.matchedNodeIDs;
export const selectMatchedNodeIDsInProperties = state => state.search.matchedNodeIDsInProperties;
export const selectMatchedNodeIDsInNameAndDescription = state => state.search.matchedNodeIDsInNameAndDescription;
export const selectSearchIsFinished = state => !state.search.isSearching && !!state.search.searchResult;
                                                  

// note - to use the following, must get highlightingMatchedNodeID from graphSlice,
// then useSelector( (state, h...ID) => selectMatchedResult(state, highlightingMatchedNodeID) ) 
export const selectMatchedResult = createSelector(
  [selectSearchResult, (state, matchedNodeID) => matchedNodeID],
  (isSearchMode, searchResult, matchedNodeID) => {
    return searchResult && searchResult.find( (item) => item.id === matchedNodeID );
  });

// useSelector( (state, matchedNodeID) => selectSearchResultOfHighlighted(state, matchedNodeID) )
export const selectSearchResultOfHighlighted = createSelector(
  [selectSearchResult, (state, matchedNodeID) => matchedNodeID],
  (searchResult, matchedNodeID) => {
    return searchResult.find( item => item.id == matchedNodeID );
  });


export const selectMatchedNodes = createSelector(
  [
    selectMatchedNodeIDs,
    selectMatchedNodeIDsInProperties,
    selectMatchedNodeIDsInNameAndDescription,
  ], (
    matchedNodeIDs,
    matchedNodeIDsInProperties,
    matchedNodeIDsInNameAndDescription
  ) => (
    {matchedNodeIDs,
     matchedNodeIDsInNameAndDescription,
     matchedNodeIDsInProperties,
    }));
  
  
