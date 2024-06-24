import React from 'react';
import { useSelector } from 'react-redux';
import { withStyles } from '@material-ui/core';
import clsx from 'clsx';
import AutoCompleteInput from './AutoCompleteInput';
import AutoCompleteSuggestions  from './AutoCompleteSuggestions';
import {
  selectSuggestionList,
} from '../../../../../features/search/searchSlice';
import './AutoComplete.css';

import styles from './AutoCompleteStyle';

function AutoComplete({
  classes,
  inputPlaceHolderText,
  inputTitle,
}) {

  const suggestionList = useSelector( selectSuggestionList );

  return (
      <div
        className={
          clsx(classes.autoComplete,
               { [classes.emptySuggestionList]: suggestionList.length })
        }
      >
        <div className={classes.inputWrapper}>
          <AutoCompleteInput
            classes={ classes }
            placeHolderText={ inputPlaceHolderText }
            inputTitle={ inputTitle }
          />
        </div>
        <AutoCompleteSuggestions
          className={classes.suggestions}
          classes={classes}
        />
      </div>
  );
}


export default withStyles(styles)(AutoComplete);
