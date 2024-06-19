import { createSlice, createSelector } from '@reduxjs/toolkit';
import _ from 'lodash';

import {
  selectHighlightingMatchedNodeID,
} from '../graph/graphSlice';

function getSearchHistoryItems() {
  return null;
}
const initialState = {
  searchHistoryItems: getSearchHistoryItems(),
  currentSearchKeyword: '',
  searchResult: [],
  overlayPropertyHidden: true,
  isSearchMode: false,
  isSearching: false,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    searchResultCleared(state, action) {
      // what?
    },
  },
});

export const {
  // reducer/actions
  searchResultCleared,
} = searchSlice.actions;

export default searchSlice.reducer;

// export Selectors

export const selectIsSearchMode = state => state.search.isSearchMode;
export const selectOverlayPropertyHidden = state => state.search.overlayPropertyHidden;
export const selectCurrentSearchKeyword = state => state.search.currentSearchKeyword;
export const selectSearchResult = state => state.search.searchResult;

  
