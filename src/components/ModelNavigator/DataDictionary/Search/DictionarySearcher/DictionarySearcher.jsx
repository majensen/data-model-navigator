/* eslint-disable react/forbid-prop-types */
import React, { useState, useRef, useEffect } from "react";
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
import { compareTwoStrings } from "string-similarity";
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
  dictionary,
  hidePropertyTable,
  onClearAllFilter,
  onClickBlankSpace,
  onSaveCurrentSearchKeyword,
  onSearchResultCleared,
  onSearchResultUpdated,
  onSearchHistoryItemCreated,
  onStartSearching,
}) {
  let autoCompleteRef = useRef(null);
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
  const [searchData, setSearchData] = useState(prepareSearchData(dictionary));
  const [text, setText] = useState("");

  // this is probably not right
  useEffect( () => {
    if (currentSearchKeyword) {
      autoCompleteRef.current.setInputText(currentSearchKeyword)
      this.search(this.props.currentSearchKeyword);
    }
  }, [currentSearchKeyword, autoCompleteRef]);

  // componentDidMount() {
  //   // resume search status after switching back from other pages
  //   if (currentSearchKeyword) {
  //     autoCompleteRef.current.setInputText(currentSearchKeyword)
  //     this.search(this.props.currentSearchKeyword);
  //   }
  // }

  const search = (str) => {
    setIsSearching(true);
    const { result, errorMsg } = searchKeyword(
      this.searchData,
      formatText(str)
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

  const inputChangeFunc = (query) => {
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
    const suggestionList = Object.keys(matchedStrings).
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
    setSuggestionList(suggestionList);
    setText(text);
  };

  const resetSearchResult = () => {
    setIsSearchFinished(false);
    setSearchResult({
        matchedNodes: [],
        summary: {},
    });
    onSearchResultCleared();
  };

  const onClearResult = () => {
    resetSearchResult();
    autoCompleteRef.current.clearInput();
  };

  const launchClearSearchFromOutside = () => {
    onClearResult();
  };

  const launchSearchFromOutside = (keyword) => {
    autoCompleteRef.current.setInputText(keyword);
    search(keyword);
  };

  const suggestionItemClickFunc = (suggestionItem) => {
    autoCompleteRef.current.setInputText(suggestionItem.fullString);
    search(suggestionItem.fullString);
  };

  const submitInputFunc = (inputText) => {
    search(formatText(inputText));
  };

  const clearFilterHandler = () => {
    onClickBlankSpace();
    onClearAllFilter();
    hidePropertyTable();
  };

  return (
    <div className={classes.searcher}>
      <SearchThemeConfig>
        <div className={classes.searchBarTitle}>
          <span className={classes.searchBarTitleText}>Filter & Search</span>
        </div>
        <div className={classes.searchInput}>
          <AutoComplete
            className="hermo"
            ref={autoCompleteRef}
            suggestionList={suggestionList}
            inputPlaceHolderText="Search in Dictionary"
            onSuggestionItemClick={suggestionItemClickFunc}
            onInputChange={inputChangeFunc}
            onSubmitInput={submitInputFunc}
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
  );
  
}

DictionarySearcher.propTypes = {
  dictionary: PropTypes.object.isRequired,
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
