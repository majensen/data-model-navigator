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
  SearchResultContext,
  SearchHistoryContext,
  SuggestionContext,
} from '../SearchContext';

// import acInputReducer from './AutoCompleteInputReducer';

function AutoCompleteInput({
  classes,
  placeHolderText,
  inputTitle,
}) {

  // const [state, dispatch] = useReducer(acInputReducer, {
  //   isSearching: false,
  //   isSearchFinished: false,
  //   searchResult: { matchedNodes: [], summary: {} },
  //   currentSearchKeyword: '',
  //   hasError: false,
  //   inputText: '',
  //   closeIconHidden: true,
  // });
  const closeIconHidden = false;
  
  const { searchData, setSearchData } = useContext(SearchDataContext);
  const { isSearching, setIsSearching,
          isSearchFinished, setIsSearchFinished,
          searchResult, setSearchResult,
          hasError, setHasError,
          errorMsg, setErrorMsg,
          currentSearchKeyword, setCurrentSearchKeyword } = useContext(SearchResultContext);
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
  setClickedSuggestionItem(null);
  
  const search = (str) => {
    setIsSearching(true);
    setIsSearchFinished(false);
    setHasError(false);
    const { result, errorMsg:msg } = searchKeyword(
      searchData,
      `${str}`.toLowerCase()
    );
    setIsSearching(false);
    setIsSearchFinished(true);
    if (!result || result.length === 0) {
      setHasError(true);
      setErrorMsg(msg);
      setSuggestionList([]); 
      return;
    }
    else {
      const summary = getSearchSummary(result);
      setHasError(false);
      setCurrentSearchKeyword(str);
      setSearchResult({
        matchedNodes: result,
        summary
      })
      setSuggestionList([]);
      setSearchHistoryItems(
        addSearchHistoryItems({
          keywordStr: str,
          matchedCount: summary.generalMatchedNodeIDs.length,
        }));
    }
  };

  const suggest = (str) => {
    setIsSearching(true);
    setIsSearchFinished(false);
    const { result, errorMsg:msg } = searchKeyword(searchData, str);
    setIsSearching(false);
    setIsSearchFinished(true);
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
            compareTwoStrings(str2, str) -
              compareTwoStrings(str1, str)
          )
          .map((s) => ({
            fullString: s,
            matchedPieceIndices: matchedStrings[s].matchedPieceIndices,
          }));

    setSearchResult({
      matchedNodes: result,
      summary
    });
    setSuggestionList(suggList);
    // closeIconHidden:!inputRef.current.value ||
    //   inputRef.current.value.length === 0,
  };
        
  // handler produces a submitted search
  const handleSubmitInput = (inputText) => {
    search(inputText);
  };

  // handler produces autocomplete
  const handleInputChange = (inputText) => {
    if (inputText.length > 1) {
      suggest(inputText);
    }
  }

  const handleChange = () => {
    handleInputChange(inputRef.current.value);
  }

  const handleClickedSuggItem = () => {
    if (inputRef.current) {
      inputRef.current.value = clickedSuggestionItem.fullString;
      handleSubmit();
      setClickedSuggestionItem(null);
    }
  }
  
  const handleClear = () =>  {
    inputRef.current.value = '';
    handleInputChange('');
  }

  const handleSubmit = (e) => {
    e && e.preventDefault();
    handleSubmitInput(inputRef.current.value);
  }

  return (
    <div className={ classes.autoCompleteInput }>
      { clickedSuggestionItem && handleClickedSuggItem() }
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
        !closeIconHidden && (
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
