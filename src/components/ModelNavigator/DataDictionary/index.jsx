import React, { useRef, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Button, withStyles } from "@material-ui/core";
import DictionarySearcher from "./Search/DictionarySearcher";
import DictionarySearchHistory from "./Search/DictionarySearchHistory";
import FacetFilters from './Search/FacetFilter';
import HeaderComponent from "./Header";
import DictionaryView from "./DictionaryView";

import {
  tabGraphViewChanged,
  selectIsGraphView,
} from '../../../features/graph/graphSlice';
import "./DataDictionary.css";

function DataDictionary({
  classes,
  // pdfDownloadConfig,
}) {

  const dispatch = useDispatch();
  const dictionarySearcherRef = useRef(null);
  
  useEffect(() => {
    dispatch(tabGraphViewChanged(true));
  }, []);

  const handleClickSearchHistoryItem = (keyword) => {
    dictionarySearcherRef.current.launchSearchFromOutside(keyword);
  };

  const handleClearSearchResult = () => {
    dictionarySearcherRef.current.clearSearchFromOutside();
  };

  return (
    <div className={classes.dictionaryContainer}>
      <HeaderComponent /> {/* pdfDownloadConfig={pdfDownloadConfig} /> */}
      <div className={classes.dataDictionary}>
        <div className={classes.sidebar}>
          <DictionarySearcher ref={dictionarySearcherRef} />
          <DictionarySearchHistory
            onClickSearchHistoryItem={handleClickSearchHistoryItem}
            onClearSearchHistory={handleClearSearchResult}
          />
          <FacetFilters />
        </div>
        <DictionaryView
          // pdfDownloadConfig={pdfDownloadConfig}
          handleClearSearchResult={handleClearSearchResult}
        />
      </div>
    </div>
  );
};

const styles = () => ({
  dictionaryContainer: {
    marginTop: "-40px",
    overflowY: "hidden",
    background: '#fff',
  },
  dataDictionary: {
    display: "flex",
    height: "calc(100vh)",
  },
  container: {
    paddingTop: "60px",
    fontFamily: "Raleway, sans-serif",
    paddingLeft: "27px",
    paddingRight: "27px",
  },
  detailContainer: {
    margin: "auto",
    paddingTop: "30px",
    paddingLeft: "50px",
    paddingRight: "50px",
    letterSpacing: "0.014em",
    color: "#000000",
    size: "12px",
    lineHeight: "23px",
  },
  sidebar: {
    width: "320px",
    minWidth: "320px",
    height: "100%",
    marginTop: "-3px",
    overflowY: "auto",
    boxShadow: "inset -10px -1px 10px -7px rgb(50 50 50 / 25%)",
    borderTopRightRadius: "7px",
  },

  mainGraphView: {
    width: "calc(100vw - 320px)",
    minWidth: "900px",
  },
  mainTableView: {
    width: "calc(100vw - 320px)",
    minWidth: "900px",
    overflowY: "scroll",
  },
});

export default withStyles(styles)(DataDictionary);
