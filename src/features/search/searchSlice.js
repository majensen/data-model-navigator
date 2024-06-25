import { createSlice, createSelector } from '@reduxjs/toolkit';
import {compareTwoStrings} from 'string-similarity';
import _ from 'lodash';
import {
  getSearchSummary,
  calcMatchedStrings,
  storeSearchHistoryItem,
  retrieveSearchHistoryItems,
  clearSearchHistoryItems,
} from '../../components/ModelNavigator/DataDictionary/Search/DictionarySearcher/searchHelper';

import {
  selectHighlightingMatchedNodeID,
} from '../graph/graphSlice';

// matchedResult - getSearchResultItem

const initialState = {
  acCloseIconHidden: true,
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
  clickedHistoryItem: null,
  isSearchMode: false,
  isSearching: false,
};

// searchMode is set when SEARCH_RESULT_UPDATED - setSearchResult - mapped to onSearchResultUpdated
// searchMode is cleared when SEARCH_RESULT_CLEARED - clearSearchResult - mapped to onSearchResultCleared

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    changedVisAcCloseIcon(state, action) {
      const vis = action.payload;
      state.acCloseIconHidden = vis == 'hide' ? true : false;
    },
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
        state.matchedNodeIDs = summary.generalMatchedNodeIDs;
        state.matchedNodeIDsInNameAndDescription = summary.matchedNodeIDsInNameAndDescription;
        state.matchedNodeIDsInProperties = summary.matchedNodeIDsInProperties;
          
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
    suggestionsCleared(state, action) {
      state.clickedSuggestionItem = null;
      state.suggestionList = [];
    },
    historyItemClicked(state, action) {
      const historyItem = action.payload;
      state.clickedHistoryItem = historyItem;
    },
    clearedHistory(state, action) {
      state.searchHistoryItems = clearSearchHistoryItems();
    },
    historyItemReset(state, action) {
      state.clickedHistoryItem = null;
    },
  },
});

export const {
  // reducer/actions
  changedVisAcCloseIcon,
  searchResultCleared,
  searchStarted,
  searchCompleted,
  suggestionItemClicked,
  suggestionItemReset,
  suggestionsCleared,
  historyItemClicked,
  historyItemReset,
  clearedHistory,
} = searchSlice.actions;

export default searchSlice.reducer;

// export Selectors

export const selectAcCloseIconHidden = state => state.search.acCloseIconHidden;
export const selectIsSearchMode = state => state.search.isSearchMode;
export const selectIsSearching = state => state.search.isSearching;
export const selectLastSearchError =  state => state.search.lastSearchError;
export const selectOverlayPropertyHidden = state => state.search.overlayPropertyHidden;
export const selectCurrentSearchKeyword = state => state.search.currentSearchKeyword;
export const selectSearchData = state => state.search.searchData;
export const selectSearchResult = state => state.search.searchResult;
export const selectSearchHistoryItems = state => state.search.searchHistoryItems;
export const selectClickedSuggestionItem = state => state.search.clickedSuggestionItem;
export const selectClickedHistoryItem = state => state.search.clickedHistoryItem;
export const selectSuggestionList = state => state.search.suggestionList;
export const selectMatchedNodeIDs = state => state.search.matchedNodeIDs;
export const selectMatchedNodeIDsInProperties = state => state.search.matchedNodeIDsInProperties;
export const selectMatchedNodeIDsInNameAndDescription = state => state.search.matchedNodeIDsInNameAndDescription;
export const selectSearchIsFinished = state => !state.search.isSearching && !!state.search.searchResult;
                                                  

// note - to use the following, must get highlightingMatchedNodeID from graphSlice,
// then useSelector( (state) => selectMatchedResult(state, highlightingMatchedNodeID) ) 
export const selectMatchedResult = createSelector(
  [selectSearchResult, (state, matchedNodeID) => matchedNodeID],
  (searchResult, matchedNodeID) => {
    return searchResult && searchResult.matchedNodes.find( (item) => item.id === matchedNodeID );
  });

// useSelector( (state) => selectSearchResultOfHighlighted(state, matchedNodeID) )
// export const selectSearchResultOfHighlighted = createSelector(
//   [selectSearchResult, (state, matchedNodeID) => matchedNodeID],
//   (searchResult, matchedNodeID) => {
//     return searchResult.find( item => item.id == matchedNodeID );
//   });


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
  
  
