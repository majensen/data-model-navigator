import FileSaver from 'file-saver';
import PropTypes from 'prop-types';
import JSZip from 'jszip';
import _ from 'lodash';

// import { dataDictionaryTemplatePath, appname } from '../localconf';

const dataDictionaryTemplatePath = 'FIXME';
const appname = 'Data Dictionary Vizualizations';

const concatTwoWords = (w1, w2) => {
  if (w1.length === 0) return w2;
  if (w2.length === 0) return w1;
  return `${w1} ${w2}`;
};

// patch over original for getting property type:
export const getType = (prop) => {
  if (prop.type == 'value_set') {
    return prop.valueSet();
  }
  else {
    return prop.type || 'UNDEFINED';
  }
}

export const downloadTemplate = (format, nodeId) => {
  if (format === 'tsv' || format === 'json') {
    const templatePath = `${dataDictionaryTemplatePath}${nodeId}?format=${format}`;
    window.open(templatePath);
  }
};

export const downloadMultiTemplate = (
  format,
  nodesToDownload,
  allRoutes,
  clickingNodeName,
  dictionaryVersion,
) => {
  if (format !== 'tsv' && format !== 'json') {
    return;
  }
  const zip = new JSZip();
  Promise.all(Object.keys(nodesToDownload).map((nodeID) => {
    const fileUrl = `${dataDictionaryTemplatePath}${nodeID}?format=${format}`;
    const saveAsFileName = nodesToDownload[nodeID];
    return fetch(fileUrl).then((response) => {
      if (response.ok) {
        return response.text();
      }
      throw new Error(`cannot download template for node "${nodeID}"`);
    }).then((responseText) => {
      zip.file(saveAsFileName, responseText);
    }).catch(() => {
      throw new Error(`cannot download template for node "${nodeID}"`);
    });
  })).then(() => {
    const time = new Date();
    const startingNodeName = 'Project';
    let readmeContent = `The following ${format.toUpperCase()} templates were downloaded from ${appname} on ${time.toLocaleDateString()} ${time.toLocaleTimeString()}. The following are all possible paths from "${startingNodeName}" node to "${clickingNodeName}" using data dictionary version ${dictionaryVersion}. The downloaded ${format.toUpperCase()} files need to be submitted in the order shown in the chosen path(s) below:\n`;
    readmeContent = readmeContent.concat(
      allRoutes.map((nodeIDsInRoute, routeIndex) => `${routeIndex + 1}. ${nodeIDsInRoute.join(',')}`).join('\n'),
    );
    zip.file('README.txt', readmeContent);
    zip.generateAsync({ type: 'blob' })
      .then((content) => {
        FileSaver.saveAs(content, `templates-${format}.zip`);
      });
  });
};

export const graphStyleConfig = {
  nodeTextFontSize: 10,
  nodeTextLineGap: 4,
  nodeContentPadding: 20,
  nodeIconRadius: 10,
};

const searchHistoryLocalStorageKey = 'datadictionary:searchHistory';
/**
 * @typedef {Object} SearchHistoryItem
 * @property {string} keywordStr - keywordStr of this item
 * @property {integer} matchedCount - matched count for this keyword
 */

/**
 * Get search history items from localStorage
 * @returns {SearchHistoryItem[]} array of search history items
 */
export const getSearchHistoryItems = () => {
  const items = JSON.parse(localStorage.getItem(searchHistoryLocalStorageKey));
  return items;
};

/**
 * Add search history item to localStorage
 * @params {SearchHistoryItem} searchHistoryItem - item to add into localStorage
 * @returns {SearchHistoryItem[]} array of new search history items
 */
export const addSearchHistoryItems = (searchHistoryItem) => {
  const { keywordStr } = searchHistoryItem;
  if (!keywordStr || keywordStr.length === 0) return getSearchHistoryItems();
  const prevHistory = JSON.parse(localStorage.getItem(searchHistoryLocalStorageKey));
  let newHistory = [];
  if (prevHistory) newHistory = prevHistory.slice(0); // clone array

  // if item already exists, need to remove item before adding to the beginning
  if (prevHistory && prevHistory.find((item) => item.keywordStr === keywordStr)) {
    const index = prevHistory.findIndex((item) => item.keywordStr === keywordStr);
    newHistory = prevHistory.slice(0);
    newHistory.splice(index, 1); // remove item
  }
  newHistory.unshift(searchHistoryItem); // add to the beginning
  localStorage.setItem(searchHistoryLocalStorageKey, JSON.stringify(newHistory));
  return newHistory;
};

/**
 * Clear search history item in localStorage
 * @returns {SearchHistoryItem[]} empty array as new search history items
 */
export const clearSearchHistoryItems = () => {
  const newHistory = [];
  localStorage.setItem(searchHistoryLocalStorageKey, JSON.stringify(newHistory));
  return newHistory;
};

export const MatchedIndicesShape = PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number));

export const MatchedItemShape = PropTypes.shape({
  indices: MatchedIndicesShape,
  arrayIndex: PropTypes.number,
  key: PropTypes.string,
  value: PropTypes.string,
});

export const SearchItemPropertyShape = PropTypes.shape({
  name: PropTypes.string,
  description: PropTypes.string,
  type: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
});

export const SearchItemShape = PropTypes.shape({
  id: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  properties: PropTypes.arrayOf(SearchItemPropertyShape),
});

export const SearchResultItemShape = PropTypes.shape({
  item: SearchItemShape,
  matches: PropTypes.arrayOf(MatchedItemShape),
});

// reactflow graph events
export const onViewChange = (payload) => {
  localStorage.setItem('reactflowGraphView', JSON.stringify(payload));
  return payload;
};

export const onCanvasWidthChange = ({ canvasWidth, graphViewConfig }) => {
  const updateGraphViewConfig = _.cloneDeep(graphViewConfig);
  if (updateGraphViewConfig) {
    updateGraphViewConfig.canvas.width = canvasWidth;
  }
  return updateGraphViewConfig;
};
