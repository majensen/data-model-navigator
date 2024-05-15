/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import './DataDictionaryTable.css';
import {
  createFileName,
  category2NodeList,
  sortByCategory,
  getNodePropertyCount,
} from '../../utils';
import DataDictionaryCategory from '../DataDictionaryCategory';

/**
 * Little components presents an overview of the types in a dictionary organized by category
 *
 * @param {dictionary} params
 */
const DataDictionaryTable = ({
  classes, model, highlightingNodeID, expandNode, dictionaryName, pdfDownloadConfig,
}) => {
  const c2nl = category2NodeList(model);
  const { nodesCount, propertiesCount } = getNodePropertyCount(model);
  return (
    <>
      <p className={classes.tableInfo}>
        <span>{dictionaryName}</span>
        <span> dictionary has </span>
        <span>{nodesCount}</span>
        <span> nodes and </span>
        <span>{propertiesCount}</span>
        <span> properties </span>
      </p>
      <div className={classes.tableBody}>
        {Object.keys(c2nl).map((category) => (
          <DataDictionaryCategory
            key={category}
            nodes={c2nl[category]}
            category={category}
            highlightingNodeID={highlightingNodeID}
            exxpandNode={expandNode}
            pdfDownloadConfig={pdfDownloadConfig}
          />
        ))}
      </div>
    </>
  );
};

DataDictionaryTable.propTypes = {
  model: PropTypes.object,
  highlightingNodeID: PropTypes.string,
  expandNode: PropTypes.func,
  dictionaryName: PropTypes.string,
};

DataDictionaryTable.defaultProps = {
  model: PropTypes.object,
  highlightingNodeID: null,
  expandNode: () => {},
  dictionaryName: '',
};

const styles = () => ({
  tableBody: {
  },
  tableInfo: {
    marginTop: '0',
    marginBottom: '0',
    marginLeft: '15px',
    color: '#32495A',
    fontFamily: 'Lato',
    fontSize: '14px',
    letterSpacing: '0',
    lineHeight: '26.06px',
  },
});

export default withStyles(styles)(DataDictionaryTable);
