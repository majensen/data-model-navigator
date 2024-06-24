/* eslint-disable react/forbid-prop-types */
import React, { useEffect, useRef, useContext } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {
  withStyles,
  createTheme,
  MuiThemeProvider,
  Button,
  List,
  ListItem,
  ListItemText,
  TextField,
} from "@material-ui/core";
import { createFilterOptions } from "@material-ui/lab";
import AutoComplete from "../AutoComplete/AutoCompleteView";
import ModelContext from "../../../Model/ModelContext";
import {
  allFiltersCleared,
} from '../../../../../features/filter/filterSlice';
import {
  clickedBlankSpace,
  changedVisOverlayPropTable,
} from '../../../../../features/graph/graphSlice';
import {
  selectCurrentSearchKeyword,
  selectSearchResult,
  selectSuggestionList,
  selectIsSearching,
  selectLastSearchError,
  selectSearchIsFinished,
} from '../../../../../features/search/searchSlice';

import {
  searchKeyword,
  getSearchSummary,
  formatText,
} from "./searchHelper";
import styles from "./DictionarySearcher.style";
import SearchThemeConfig from "./SearchThemeConfig";


function DictionarySearcher({
  activeFiltersCount,
  classes,
  onClearAllFilter,
  onSaveCurrentSearchKeyword,
  onSearchResultCleared,
  onSearchResultUpdated,
  onSearchHistoryItemCreated,
  onStartSearching,
}) {
  const dispatch = useDispatch();
  const searchIsFinished = useSelector( selectSearchIsFinished );
  const errorMsg = useSelector( selectLastSearchError )
  const hasError = errorMsg.length > 0;
  const currentSearchKeyword = useSelector( selectCurrentSearchKeyword );
  const suggestionList = useSelector( selectSuggestionList );
  const searchResult = useSelector( selectSearchResult );
  
  const autoCompleteRef = useRef(null);
  
  // this is probably not right??
  // useEffect( () => {
  //   if (currentSearchKeyword) {
  //     autoCompleteRef.current.setInputText(currentSearchKeyword);
  //   }
  // }, [currentSearchKeyword, autoCompleteRef]);


  // these probably don't belong here
//  const onClearResult = () => {
//    dispatch({ type: "CLEAR_RESULT" });
//  };
//    resetSearchResult();
//    autoCompleteRef.current.clearInput();
//  };
  const launchClearSearchFromOutside = () => {
//     onClearResult();
  };

  const launchSearchFromOutside = (keyword) => {
    autoCompleteRef.current.setInputText(keyword);
   };
  ////
  
  const clearFilterHandler = () => {
    dispatch(clickedBlankSpace());
    dispatch(allFiltersCleared());
    dispatch(changedVisOverlayPropTable('hide'));
  };
 
  return (
      <div className={classes.searcher}>
        <SearchThemeConfig>
          <div className={classes.searchBarTitle}>
            <span className={classes.searchBarTitleText}>Filter & Search</span>
          </div>
          <div className={classes.searchInput}>
            <AutoComplete
              ref={autoCompleteRef}
              className="hermo"
              suggestionList={suggestionList}
              inputPlaceHolderText="Search in Dictionary"
            />
            <br />
            <Button
              id="button_sidebar_clear_all_filters"
              variant="outlined"
              disabled={activeFiltersCount === 0}
              className={classes.customButton}
              classes={{ root: classes.clearAllButtonRoot }}
              onClick={clearFilterHandler}
              disableRipple
              title="CLEAR ALL"
            >
              CLEAR ALL
            </Button>
          </div>
        </SearchThemeConfig>
        <div className={classes.results}>
          {searchIsFinished && (
            <div>
              {!hasError &&
               (searchResult.matchedNodes.length > 0 ? (
                 <>
                   <div className={classes.searchResultText}>
                     <span>Search Results</span>
                   </div>
                   <List className={classes.resultList} dense>
                     <ListItem className={classes.resultItem}>
                       <span className={classes.resultCountTitleDesc}>
                         {
                           searchResult.summary
                             .matchedNodeNameAndDescriptionsCount
                         }
                       </span>
                       &nbsp;
                       <span>
                         Match(es) in nodes <br /> (title and description)
                       </span>
                     </ListItem>
                     <ListItem className={classes.resultItem}>
                       <span className={classes.resultCountProps}>
                         {searchResult.summary.matchedPropertiesCount}
                       </span>
                       &nbsp;
                       <span>Match(es) in node properties</span>
                     </ListItem>
                   </List>
                 </>
               ) : (
                 <p>No results found.</p>
               ))}
              {hasError && <p>{errorMsg}</p>}
            </div>
          )}
        </div>
      </div>
  );
  
}


export default withStyles(styles)(DictionarySearcher);
