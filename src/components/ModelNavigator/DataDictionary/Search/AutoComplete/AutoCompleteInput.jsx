/* eslint-disable no-unused-vars */
import React, { useRef, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import './AutoCompleteInput.css';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import styles from './AutoCompleteInputStyle';
import { ModelContext } from '../../../Model/ModelContext';
import {
  prepareSearchData,
  searchKeyword,
} from '../DictionarySearcher/searchHelper.js';
import {
  changedVisAcCloseIcon,
  searchStarted,
  searchDataPrepared,
  searchCompleted,
  searchResultCleared,
  suggestionItemClicked,
  suggestionItemReset,
  suggestionsCleared,
  selectSearchData,
  selectClickedSuggestionItem,
  historyItemClicked,
  historyItemReset,
  selectAcCloseIconHidden,
  selectClickedHistoryItem,
} from '../../../../../features/search/searchSlice';
import {
  selectModelID,
} from '../../../../../features/graph/graphSlice';

// import acInputReducer from './AutoCompleteInputReducer';

function AutoCompleteInput({
  classes,
  placeHolderText,
  inputTitle,
}) {

  const dispatch = useDispatch();
  const closeIconHidden = useSelector( selectAcCloseIconHidden );
  const clickedSuggestionItem = useSelector( selectClickedSuggestionItem );
  const clickedHistoryItem = useSelector( selectClickedHistoryItem );
  const model = useContext(ModelContext);
  const modelID = useSelector( selectModelID );
  const searchData = useSelector( selectSearchData );
  
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
    dispatch(changedVisAcCloseIcon(!!inputText ? 'show' : 'hide'));
  }

  const handleChange = () => {
    handleInputChange(inputRef.current.value);
  }

  const handleClickedSuggItem = () => {
    if (inputRef.current) {
      inputRef.current.value = clickedSuggestionItem.fullString;
      handleSubmit();
      dispatch(suggestionsCleared());
    }
  }

  const handleClickedHistItem = () => {
    if (inputRef.current) {
      inputRef.current.value = clickedHistoryItem.keywordStr;
      handleSubmit();
      dispatch(historyItemReset());
    }
  }

  const handleClear = () =>  {
    inputRef.current.value = '';
    handleInputChange('');
    dispatch(searchResultCleared());
    dispatch(suggestionsCleared());
    dispatch(changedVisAcCloseIcon('hide'));
  }

  const handleSubmit = (e) => {
    e && e.preventDefault();
    handleSubmitInput(inputRef.current.value);
  }

  // update search data when new model appears

  useEffect( () => {
    let id = modelID;
    const searchData = prepareSearchData(model);
    dispatch(searchDataPrepared(searchData));
  }, [modelID] );
  
  return (
    <div className={ classes.autoCompleteInput }>
      { clickedSuggestionItem && handleClickedSuggItem() }
      { clickedHistoryItem && handleClickedHistItem() }
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
