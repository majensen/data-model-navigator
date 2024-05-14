import React, { useRef, useContext } from 'react';
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import styles from './AutoCompleteSuggestnStyle';
import { SuggestionContext } from '../SearchContext';

/**
 * Wrap suggestion item into HTML, take following as an e.g.:
 *   suggestionsItem={
 *     fullString: 'abcdea',
 *     matchedPieceIndices: [
 *       [0, 1],
 *       [5, 6]
 *     ];
 *   };
 * Return HTML should be:
 *     <span className='auto-complete-suggestions__highlight'>
 *       a
 *     </span>
 *     <span>bcde</span>
 *     <span className='auto-complete-suggestions__highlight'>
 *       a
 *     </span>
 */

function PaintItemOld({classes, suggestionItem}) {
  const { fullString, matchedPieceIndices } = suggestionItem;
  let cursor = 0;
  let currentHighlighPieceIndex = 0;
  const resultHTMLSnippits = [];
  while (currentHighlighPieceIndex < matchedPieceIndices.length) {
    const highlightStartPos = matchedPieceIndices[currentHighlighPieceIndex][0];
    const highlightEndPos = matchedPieceIndices[currentHighlighPieceIndex][1];
    if (cursor < highlightStartPos) {
      resultHTMLSnippits.push(
        <span key={cursor}>
          {fullString.substring(cursor, highlightStartPos)}
          </span>
      );
    }
    resultHTMLSnippits.push(
      <span key={highlightStartPos} className={classes.highlight}>
        {fullString.substring(highlightStartPos, highlightEndPos)}
      </span>
    );
    cursor = highlightEndPos;
    currentHighlighPieceIndex += 1;
    }
  if (cursor < fullString.length) {
    resultHTMLSnippits.push(
      <span key={cursor}>
        {fullString.substring(cursor)}
      </span>
    );
  }
  return (
    <>
      {resultHTMLSnippits}
    </>
  );
};

function PaintItem({ classes, suggestionItem }) {
  var left=0;
  const {fullString, matchedPieceIndices} = suggestionItem;
  const painted = matchedPieceIndices.map( (elt) => (
    <>
      {fullString.substring(left,elt[0]-1)}
      <span className={ classes.highlight }>
        {fullString.substring(...elt)}
      </span>
      left = elt[1]
    </>
  ));
  return (
    <>
      {painted}
    </>
  );
};


function SuggestionItemDiv({ classes, suggestionItem, i }) {
  const { fullString, matchedPieceIndices } = suggestionItem;
  const { setClickedSuggestionItem } = useContext(SuggestionContext);
  
  const handleClickItem = () => {
    setClickedSuggestionItem(suggestionItem);
  };

  return (
    <div
      key={`${i}-${suggestionItem.fullString}`}
      className={ classes.suggestionItem }
      onClick={ handleClickItem }
      role="button"
      tabIndex={0} // why not $i?
    >
      <PaintItemOld suggestionItem={suggestionItem} classes={classes}/>
    </div>
  );
}

function AutoCompleteSuggestions({
  classes,
}) {
  const { suggestionList } = useContext(SuggestionContext);
  const divList = suggestionList.map(
    (suggestionItem, i) => (
      <SuggestionItemDiv
        classes={classes}
        suggestionItem={suggestionItem}
        key={ `${suggestionItem.fullString}-$i` } />
    ))
  return (
    <div className={classes.suggestionList}>
      { divList }
    </div>
  );
}


export const SuggestionItem = {
  fullString: PropTypes.string.isRequired,
  matchedPieceIndices: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
};
  
AutoCompleteSuggestions.propTypes = {
  suggestionList: PropTypes.arrayOf(PropTypes.shape(SuggestionItem)),
};

AutoCompleteSuggestions.defaultProps = {
  suggestionList: [],
  onSuggestionItemClick: () => {},
};

export default withStyles(styles)(AutoCompleteSuggestions);
