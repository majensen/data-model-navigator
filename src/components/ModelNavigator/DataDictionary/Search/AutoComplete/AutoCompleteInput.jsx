/* eslint-disable no-unused-vars */
import React, { useRef, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, withStyles } from '@material-ui/core';
import './AutoCompleteInput.css';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';
import styles from './AutoCompleteInputStyle';
import { ModelContext } from '../../../Model/ModelContext';
import {
  prepareSearchData,
  searchKeyword,
} from '../DictionarySearcher/searchHelper.js';
import {
  searchStarted,
  searchCompleted,
  selectClickedSuggestionItem,
  suggestionItemClicked,
  suggestionItemReset,
} from '../../../../../features/search/searchSlice';

// import acInputReducer from './AutoCompleteInputReducer';

function AutoCompleteInput({
  classes,
  placeHolderText,
  inputTitle,
}) {

  const dispatch = useDispatch();
  const closeIconHidden = false;
  const clickedSuggestionItem = useSelector( selectClickedSuggestionItem );
  const model = useContext(ModelContext);
  const searchData = model ? prepareSearchData(model) : null;
  
  let inputRef = useRef(null);
  
  const search = (str,save = true) => {
    dispatch(searchStarted(str))
    const { result, msg } = searchKeyword(
      searchData,
      `${str}`.toLowerCase()
    );
    dispatch(searchCompleted({result, errorMsg:msg, save}));
    return (result && result.length > 0 ? result : null);
  };

  const suggest = (str) => { search(str, false); }
        
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
      dispatch(suggestionItemReset());
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

export default withStyles(styles)(AutoCompleteInput);
