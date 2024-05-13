/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import './DataDictionaryTable.css';
import { parseDictionaryNodes } from '../../Utils/utils';
import { createFileName } from '../../utils';
import DataDictionaryCategory from '../DataDictionaryCategory';

// const pdfDownloadConfig = {
//   type: 'document',
//   prefix: 'ICDC_Data_Model ',
//   landscape: true,
// };

/**
 * Just exported for testing
 * Little helper that extacts a mapping of category-name to
 * the list of nodes in that category given a dictionary definition object
 *
 * @param {Object} dictionary
 * @return {} mapping from category to node list
 */

export function category2NodeList(model) {
  return Object.fromEntries(
    model.tag_kvs('Category')
      .map( ([key, value]) => {
        let cat = value;
        return [cat.toLowerCase(),
                model.tagged_items('Category', cat)
                .filter(item => item._kind === 'Node')]
      })
  );
}


/** cluster props according to the category for PDF download */
export function sortByCategory(c2nl, model) {
  const keys = Object.keys(c2nl);
  return model.nodes().sort((a, b) =>
    keys.indexOf(a.tags('Category') - keys.indexOf(b.tags('Category')));
}

const getNodePropertyCount = (model) => {
  return {
    nodesCount: model.nodes().length,
    propertiesCount: model.props().length,
  };
};

/**
 * Little components presents an overview of the types in a dictionary organized by category
 *
 * @param {dictionary} params
 */
const DataDictionaryTable = ({
  classes, model, highlightingNodeID, onExpandNode, dictionaryName, pdfDownloadConfig,
}) => {
  const c2nl = category2NodeList(model);
  const { nodesCount, propertiesCount } = getNodePropertyCount(model);
  return (
    <>
      {/* <DownloadLinkWrapper> */}
      <p className={classes.tableInfo}>
        <span>{dictionaryName}</span>
        <span> dictionary has </span>
        <span>{nodesCount}</span>
        <span> nodes and </span>
        <span>{propertiesCount}</span>
        <span> properties </span>
      </p>
      {/* <DownloadButton
          config={{ ...pdfDownloadConfig, type: 'document' }}
          documentData={sortByCategory(c2nl, dictionary)}
          fileName={createFileName('', pdfDownloadConfig.prefix)}
        /> */}
      {/* </DownloadLinkWrapper> */}
      <div className={classes.tableBody}>
        {Object.keys(c2nl).map((category) => (
          <DataDictionaryCategory
            key={category}
            nodes={c2nl[category]}
            category={category}
            highlightingNodeID={highlightingNodeID}
            onExpandNode={onExpandNode}
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
  onExpandNode: PropTypes.func,
  dictionaryName: PropTypes.string,
};

DataDictionaryTable.defaultProps = {
  model: {},
  highlightingNodeID: null,
  onExpandNode: () => {},
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
