// AutoCompleteInput state:
// isSearching: false,
// searchResult: { matchedNodes:[], summary: {} }
// currentSearchKeyword: '',
// hasError: false,
// errorMsg: '',
// inputText: '',
// closeIconHidden: true,

export default function AutoCompleteInputReducer(state, action) {
  switch (action.type) {
  case 'RESET_SEARCH':
    return ({
      ...state,
      isSearching: true,
      isSearchFinished: false,
      hasError: false,
      errorMsg: '',
      searchResult: { matchedNodes: [], summary: {} },
      closeIconHidden: true,
    });
  case 'SEARCH_FINISHED_WITH_ERROR':
    return({
      ...state,
      isSearching: false,
      isSearchFinished: true,
      hasError: true,
      errorMsg: action.errorMsg,
      searchResult: { matchedNodes: [], summary: {} },
    });
  case 'SEARCH_FINISHED':
    return({
      ...state,
      isSearching: false,
      isSearchFinished: true,
      hasError: false,
      currentSearchKeyword: action.keyword,
      searchResult: {
        matchedNodes: action.result,
        summary: action.summary,
      }
    });
  }
}
