import React from 'react';
import clsx from 'clsx';

/**
 * 
 * @param {*} param0 
 * set classes for matching nodes base on search query
 */
 export const setMatchingNodeClasses = ({
    matchedNodeIDs = [],
    matchedNodeIDsInNameAndDescription = [],
    matchedNodeIDsInProperties = [],
  },
  node,
  classes,
  category) => {
    const id = `${node}`.trim().toLowerCase();
    return clsx(classes.nodeTitleBtn, classes[category], {
      [classes.matchedNodeIDs]: (matchedNodeIDs.indexOf(id) !== -1),
      [classes.matchedInNameAndDesc]: (matchedNodeIDsInNameAndDescription.indexOf(id) !== -1),
      [classes.matchedNodeIDsInProps]: (matchedNodeIDsInProperties.indexOf(id) !== -1)
        && (matchedNodeIDsInNameAndDescription.indexOf(id) === -1),
      [classes.excludeNode]: (matchedNodeIDs.indexOf(id) === -1),
    });
}

/**
 * highlight the matching string based on search query result
 */
export const highlightMatchingTitle = (node, matchedNodeNameQuery = '', classes) => {
    let id = `${node}`.trim().toLowerCase();
    /**check for exact match */
    if (matchedNodeNameQuery.toLowerCase() === id) {
      return (<b className={classes.highLightNode}>{id}</b>);
    }

    //split text to highlight node title 
    const arr = id.replace(matchedNodeNameQuery, `,${matchedNodeNameQuery},`).split(",");
    const highlightTitle = arr.map((text) => {
      if (text.toLowerCase() === matchedNodeNameQuery.toLowerCase()) {
        return (
        <b className={classes.highLightNode}>
          {matchedNodeNameQuery}
        </b>);
      }
      return (<span>{text}</span>);
    });
  return highlightTitle;
}
