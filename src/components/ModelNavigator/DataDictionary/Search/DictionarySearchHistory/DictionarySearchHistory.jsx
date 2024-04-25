import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import styles from './DictionarySearchHistory.style';

function DictionarySearchHistory({
  classes,
  onClickSearchHistoryItem,
  onClearSearchHistoryItems,
  searchHistoryItems,
}) {
  const handleClick = (keyword) => {
    onClickSearchHistoryItem(keyword);
  }

  const handleClearHistory = () => {
    onClearSearchHistoryItems();
  }

  var historyItems = []
  if (searchHistoryItems) {
    historyItems = searchHistoryItems.map((item) => {
      const zeroCountModifier = item.matchedCount === 0
            ? classes.itemBadgeZero : '';
      return (
        <div
          className={classes.item}
          key={item.keywordStr}
          onClick={() => handleClick(item.keywordStr)}
          role="button"
          tabIndex={0}
        >
          <span className={classes.itemKeyword}>
            {item.keywordStr}
          </span>
          <span className={`${classes.itemBadge} ${zeroCountModifier}`}>
            {item.matchedCount}
          </span>
        </div>
      );
    });
  }
  if (searchHistoryItems && searchHistoryItems.length > 0) {
    return (
      <div className={classes.searchHistory}>
        <div>
          <h4 className={classes.titleText}>
            Last Search
          </h4>
          <span
            className={classes.clear}
            onClick={handleClearHistory}
            role="button"
            tabIndex={0}
          >
            Clear History
          </span>
        </div>
        <div className={classes.serachedItems}>
          {historyItems}
        </div>
      </div>
    );
  }
  return (
    <>
    </>
  );
}

const SearchHistoryItemShape = PropTypes.shape({
  keywordStr: PropTypes.string,
  matchedCount: PropTypes.number,
});

DictionarySearchHistory.propTypes = {
  searchHistoryItems: PropTypes.arrayOf(SearchHistoryItemShape),
  onClickSearchHistoryItem: PropTypes.func,
  onClearSearchHistoryItems: PropTypes.func,
};

DictionarySearchHistory.defaultProps = {
  searchHistoryItems: [],
  onClickSearchHistoryItem: () => {},
  onClearSearchHistoryItems: () => {},
};

export default withStyles(styles)(DictionarySearchHistory);
