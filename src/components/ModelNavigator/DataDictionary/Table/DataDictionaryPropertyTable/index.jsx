/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { withStyles } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import {
  getMatchesSummaryForProperties,
} from '../../Utils/highlightHelper';
import DialogBox from './component/DialogComponent';
import { controlVocabConfig as config } from '../../../Config/nav.config';
import TableHead from './component/TableHead';
import TableRows from './component/TableRows';

import {
  selectIsSearchMode,
} from '../../../../../features/search/searchSlice';

const DataDictionaryPropertyTable = ({
  classes,
  title,
  node,
  onlyShowMatchedProperties,
  hasBorder,
  needHighlightSearchResult,
  matchedResult,
  hideIsRequired,
}) => {
  const [display, setDisplay] = useState(false);
  const [items, setItems] = useState([]);
  const [matchedItem, setMatchedItems] = useState([]);
  const [property, setProperty] = useState('');

  const isSearchMode = useSelector( selectIsSearchMode );
  const properties = node.props(); // eslint-disable-line no-undef
  const openBoxHandler = (values, typeMatchList = [], prop_handle) => {
    setDisplay(true);
    setItems(values);
    setMatchedItems(typeMatchList);
    setProperty(prop_handle);
  };

  const closeHandler = () => {
    setDisplay(false);
    setItems([]);
  };

  const needHighlight = onlyShowMatchedProperties
    || needHighlightSearchResult;
  const matchedPropertiesSummary = needHighlightSearchResult
        ? (matchedResult 
           ? getMatchesSummaryForProperties(
             properties,
             matchedResult.matches,)
           : [])
        : [];

  return (
    <div className={classes.propertyTable}>
      <table className={classes.propertyTable}>
        <TableHead hideIsRequired={hideIsRequired} />
        <tbody>
          <TableRows
            onlyShowMatchedProperties={onlyShowMatchedProperties}
            matchedPropertiesSummary={matchedPropertiesSummary}
            properties={properties}
            needHighlightSearchResult={needHighlight}
            hideIsRequired={hideIsRequired}
            openBoxHandler={openBoxHandler}
            isSearchMode={isSearchMode}
            title={title}
          />
        </tbody>
      </table>
      {items.length > 0
      && (
      <DialogBox
        display={display}
        closeHandler={closeHandler}
        items={items}
        maxNoOfItems={config.maxNoOfItems}
        maxNoOfItemDlgBox={config.maxNoOfItemDlgBox}
        isSearchMode={isSearchMode}
        typeMatchList={matchedItem}
        node={title}
        property={property}
      />
      )}
    </div>
  );
}

const styles = () => ({
  propertyTable: {
    backgroundColor: `var(--g3-color__white)`,
    borderCollapse: 'collapse',
    width: '100%',
    borderBottom: '1px solid #adbec4'
  },
  withOutBorder: {

  }
});

export default withStyles(styles)(DataDictionaryPropertyTable);
