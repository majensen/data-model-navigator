import React, { useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Button, List, ListItem } from "@mui/material";
import withStyles from '@mui/styles/withStyles';
import AutoComplete from "../AutoComplete";
import {
  allFiltersCleared,
} from '../../../../../features/filter/filterSlice';
import {
  clickedBlankSpace,
  changedVisOverlayPropTable,
} from '../../../../../features/graph/graphSlice';
import {
  searchResultCleared,
  selectSearchResult,
  selectSuggestionList,
  selectLastSearchError,
  selectSearchIsFinished,
} from '../../../../../features/search/searchSlice';

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

  const suggestionList = useSelector( selectSuggestionList );
  const searchResult = useSelector( selectSearchResult );
  
  const autoCompleteRef = useRef(null);
  

  // useEffect( () => {
  //   if (currentSearchKeyword) {
  //     autoCompleteRef.current.setInputText(currentSearchKeyword);
  //   }
  // }, [currentSearchKeyword, autoCompleteRef]);


  const clearFilterHandler = () => {
    dispatch(clickedBlankSpace());
    dispatch(allFiltersCleared());
    dispatch(changedVisOverlayPropTable('hide'));
  };
 
  return (
      <div className={classes.searcher}>

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
              sx={{ root: { ...styles().clearAllButtonRoot},
                    ...styles().customButton,
                  }}
              onClick={clearFilterHandler}
              disableRipple
              title="CLEAR ALL"
            >
              CLEAR ALL
            </Button>
          </div>

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
