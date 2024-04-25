/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-unused-vars */
import React, { useState, useRef, useContext } from 'react';
import { Button, withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import './AutoCompleteInput.css';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';
import styles from './AutoCompleteInputStyle';
import SearchDataContext from '../SearchContext';


function AutoCompleteInput({
  classes,
  placeHolderText,
  inputTitle,
}) {

  let inputRef = useRef(null)
  const searchData = useContext(SearchDataContext);

  const search = (str) => {
    setIsSearching(true);
    const { result, errorMsg } = searchKeyword(
      searchData,
      `${str}`.toLowerCase()
    );
    if (!result || result.length === 0) {
      // group in a reducer?
      onSearchResultUpdated([], []);
      setIsSearchFinished(true);
      setHasError(true);
      setErrorMsg(errorMsg);
      setSuggestionList([]);
      return;
    }
    const summary = getSearchSummary(result);
    setIsSearchFinished(true);
    setHasError(false);
    setSearchResult({
        matchedNodes: result,
        summary,
    });
    setSuggestionList([]);

    setIsSearching(false);
    onSearchResultUpdated(result, summary);
    onSearchHistoryItemCreated({
      keywordStr: str,
      matchedCount: summary.generalMatchedNodeIDs.length,
    });
    onSaveCurrentSearchKeyword(str);
  };

  const handleSubmitInput = (inputText) => {
    search(formatText(inputText));
  };

  const handleInputChange = (query) => {
    onStartSearching();
    resetSearchResult();
    const inputText = formatText(query);
    const { result } = searchKeyword(searchData, inputText);
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
    const suggList = Object.keys(matchedStrings).
      sort(
        (str1, str2) =>
          compareTwoStrings(str2, inputText) -
          compareTwoStrings(str1, inputText)
      ).
      map((str) => ({
        fullString: str,
        matchedPieceIndices: matchedStrings[str].matchedPieceIndices,
      }));
    const text = query;
    setSuggestionList(suggList);
    setText(text);
  }

  const [closeIconHidden, setCloseIconHidden] = useState(true);

  const updateCloseIcon = () => {
    setCloseIconHidden(!inputRef.current.value ||
                       inputRef.current.value.length === 0);
  }
  
  const clearInput = () => {
    inputRef.current.value = '';
    updateCloseIcon();
  }

  const handleChange = () => {
    handleInputChange(inputRef.current.value);
    updateCloseIcon();
  }

  const handleClear = () =>  {
    inputRef.current.value = '';
    updateCloseIcon();
    handleInputChange('');
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSubmitInput(inputRef.current.value);
  }

  const setInputText = (text) => {
    inputRef.current.value = text;
    updateCloseIcon();
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
