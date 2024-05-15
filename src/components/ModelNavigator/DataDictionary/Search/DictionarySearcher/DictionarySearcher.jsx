/* eslint-disable react/forbid-prop-types */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
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
import {
  SearchDataContext,
  SearchHistoryContext,
} from "../SearchContext";

import {
  prepareSearchData,
  searchKeyword,
  getSearchSummary,
  ZERO_RESULT_FOUND_MSG,
  formatText,
} from "./searchHelper";
import styles from "./DictionarySearcher.style";
import SearchThemeConfig from "./SearchThemeConfig";


function DictionarySearcher({
  activeFiltersCount,
  classes,
  currentSearchKeyword,
  model,
  hidePropertyTable,
  onClearAllFilter,
  onClickBlankSpace,
  onSaveCurrentSearchKeyword,
  onSearchResultCleared,
  onSearchResultUpdated,
  onSearchHistoryItemCreated,
  onStartSearching,
}) {
  
  const [searchData, setSearchData] = useState(prepareSearchData(model));
  const [searchHistoryItems, setSearchHistoryItems] = useState([]);

  const [isSearching, setIsSearching] = useState(false);
  const [isSearchFinished, setIsSearchFinished] = useState(false);
  const [searchResult, setSearchResult] = useState(
    {
      matchedNodes: [],
      summary: {},
    });
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [suggestionList, setSuggestionList] = useState([]);
  const [text, setText] = useState("");
  
  // this is probably not right??
  // useEffect( () => {
  //   if (currentSearchKeyword) {
  //     autoCompleteRef.current.setInputText(currentSearchKeyword)
  //     search(currentSearchKeyword);
  //   }
  // }, [currentSearchKeyword, autoCompleteRef]);

  // componentDidMount() {
  //   // resume search status after switching back from other pages
  //   if (currentSearchKeyword) {
  //     autoCompleteRef.current.setInputText(currentSearchKeyword)
  //     this.search(this.props.currentSearchKeyword);
  //   }
  // }

  // these probably don't belong here
  // const onClearResult = () => {
  //   dispatch({ type: "CLEAR_RESULT" });
  // };

  //       {
  //   resetSearchResult();
  //   autoCompleteRef.current.clearInput();
  // };
  const launchClearSearchFromOutside = () => {
   //  onClearResult();
  };

  const launchSearchFromOutside = (keyword) => {
    // autoCompleteRef.current.setInputText(keyword);
    // search(keyword);
  };
  ////
  
  const clearFilterHandler = () => {
    onClickBlankSpace();
    onClearAllFilter();
    hidePropertyTable();
  };
 
  return (
    <SearchHistoryContext.Provider value={{searchHistoryItems, setSearchHistoryItems}}>
    <SearchDataContext.Provider value={searchData}>
      <div className={classes.searcher}>
        <SearchThemeConfig>
          <div className={classes.searchBarTitle}>
            <span className={classes.searchBarTitleText}>Filter & Search</span>
          </div>
          <div className={classes.searchInput}>
            <AutoComplete
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
          {isSearchFinished && (
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
                 <p>{ZERO_RESULT_FOUND_MSG}</p>
               ))}
              {hasError && <p>{errorMsg}</p>}
            </div>
          )}
        </div>
      </div>
    </SearchDataContext.Provider>
    </SearchHistoryContext.Provider>
  );
  
}

DictionarySearcher.propTypes = {
  model: PropTypes.object.isRequired,
  setIsSearching: PropTypes.func,
  onSearchResultUpdated: PropTypes.func,
  onSearchHistoryItemCreated: PropTypes.func,
  onSearchResultCleared: PropTypes.func,
  onSaveCurrentSearchKeyword: PropTypes.func,
  currentSearchKeyword: PropTypes.string,
  onStartSearching: PropTypes.func,
};

DictionarySearcher.defaultProps = {
  setIsSearching: () => {},
  onSearchResultUpdated: () => {},
  onSearchHistoryItemCreated: () => {},
  onSearchResultCleared: () => {},
  onSaveCurrentSearchKeyword: () => {},
  currentSearchKeyword: "",
  onStartSearching: () => {},
};

export default withStyles(styles)(DictionarySearcher);
