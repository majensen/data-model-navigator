import { createSlice, createSelector } from '@reduxjs/toolkit';
import _ from 'lodash';

const initialState = {
  searchHistoryItems: getSearchHistoryItems(),
  currentSearchKeyword: '',
  searchResult: [],
  isSearchMode: false,
  isSearching: false,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
  },
});

export const {
  // reducer/actions
};

export default searchSlice.reducer;

// export Selectors
