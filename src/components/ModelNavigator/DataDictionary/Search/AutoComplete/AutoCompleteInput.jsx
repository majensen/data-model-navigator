/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-unused-vars */
import React, { useRef, useReducer, useContext } from 'react';
import { Button, withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import { compareTwoStrings } from "string-similarity";
import './AutoCompleteInput.css';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';
import styles from './AutoCompleteInputStyle';
import { addSearchHistoryItems } from '../../Utils/utils';
import {
  searchKeyword,
  getSearchSummary,
} from '../DictionarySearcher/searchHelper.js';
import {
  SearchDataContext,
  SearchHistoryContext,
  SuggestionContext,
} from '../SearchContext';

import acInputReducer from './AutoCompleteInputReducer';

function AutoCompleteInput({
  classes,
  placeHolderText,
  inputTitle,
}) {

  const [state, dispatch] = useReducer(acInputReducer, {
    isSearching: false,
    searchResult: { matchedNodes: [], summary: {} },
    currentSearchKeyword: '',
    hasError: false,
    inputText: '',
    closeIconHidden: true,
  });
  const searchData = useContext(SearchDataContext);
  const {
    suggestionList,
    setSuggestionList,
    clickedSuggestionItem,
    setClickedSuggestionItem,
  } = useContext(SuggestionContext);
  const {
    searchHistoryItems,
    setSearchHistoryItems,
  } = useContext(SearchHistoryContext);
    
  let inputRef = useRef(null);
  // setClickedSuggestionItem(null);
  
  const search = (str) => {
    dispatch({type: 'RESET_SEARCH'});
    const { result, errorMsg } = searchKeyword(
      searchData,
      `${str}`.toLowerCase()
    );
    if (!result || result.length === 0) {
      dispatch({
        type: 'SEARCH_FINISHED_WITH_ERROR',
        errorMsg,
      });
      setSuggestionList([]); 
      return;
    }
    const summary = getSearchSummary(result);

    dispatch(({
      type: 'SEARCH_FINISHED',
      result,
      summary,
      currentSearchKeyword: str,
    }));

    setSuggestionList([]);
    setSearchHistoryItems(
      addSearchHistoryItems({
        keywordStr: str,
        matchedCount: summary.generalMatchedNodeIDs.length,
      }));
  };

  const handleSubmitInput = (inputText) => {
    dispatch({ type: "RESET_SEARCH" });
    search(inputText);
  };

  const handleInputChange = (query) => {
    dispatch({ type: "RESET_SEARCH" });
    if (query.length > 0) {
      const { result } = searchKeyword(searchData, query);
      const summary = getSearchSummary(result);
      const matchedStrings = {};
      result.forEach((resItem) => {
        resItem.matches.forEach((matchItem) => {
          if (!matchedStrings[matchItem.value]) {
            matchedStrings[matchItem.value] = {
              matchedPieceIndices: matchItem.indices.map((arr) => [
                arr[0],
                arr[1] + 1,
              ]),
            };
          }
        });
      });
      const suggList = Object.keys(matchedStrings)
            .sort(
              (str1, str2) =>
              compareTwoStrings(str2, query) -
                compareTwoStrings(str1, query)
            )
            .map((str) => ({
              fullString: str,
              matchedPieceIndices: matchedStrings[str].matchedPieceIndices,
            }));
      dispatch({
        type: "SEARCH_FINISHED",
        result: result,
        summary: summary,
        closeIconHidden:!inputRef.current.value ||
          inputRef.current.value.length === 0,
      })
      setSuggestionList(suggList);
    }
  }

  const handleChange = () => {
    handleInputChange(inputRef.current.value);
  }

  const handleClickedSuggItem = () => {
    inputRef.current.value = clickedSuggestionItem.fullString;
    setClickedSuggestionItem(null)
  }
  const handleClear = () =>  {
    inputRef.current.value = '';
    dispatch({type: 'RESET_SEARCH'});
    handleInputChange('');
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSubmitInput(inputRef.current.value);
  }

  return (
    <div className={ classes.autoCompleteInput }>
      <form
        className={ classes.autoCompleteInputForm }
        onSubmit={ handleSubmit }
      >
        <input
          title={ inputTitle }
          className={ classes.autoCompleteInputBox }
          onChange={ handleChange }
          placeholder={ placeHolderText }
          ref={ inputRef }
        />
      </form>
      {
        !state.closeIconHidden && (
          <>
            <Button
              onClick={handleClear}
              disableRipple
              className={classes.closeBtn}
              aria-label="Clear search"
            >
              <CloseIcon
                className={classes.closeIcon}
              />
            </Button>
            <i className={classes.verticalLine} />
          </>
        )
      }
      <Button
        onClick={ handleSubmit }
        disableRipple
        className={ classes.searchBtn }
        aria-label="Submit search"
      >
        <SearchIcon
          className={ classes.searchIcon }
        />
      </Button>
    </div>
  );
}

            
AutoCompleteInput.propTypes = {
  placeHolderText: PropTypes.string,
  icon: PropTypes.string,
  inputTitle: PropTypes.string,
};

AutoCompleteInput.defaultProps = {
  placeHolderText: 'Search',
  icon: 'search',
  inputTitle: 'Search Input',
};

export default withStyles(styles)(AutoCompleteInput);
