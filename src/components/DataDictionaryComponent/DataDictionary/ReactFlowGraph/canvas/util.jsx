import classNames from 'classnames';

export const nodeColor = (node) => { 
  switch (node.category) {
    case 'administrative':
        return '#9B2D20';
    case 'study':
        return '#9875FF';
    case 'case':
        return '#FF7F15';
    case 'clinical_trial':
        return '#00A1BB';
    case 'biospecimen':
        return '#00785A';
    case 'analysis':
        return '#B533A9';
    case 'data_file':
        return '#00AD0E';
    case 'clinical':
        return '#1C75BC';
    default:
        return '#ff0072';
  }
};

/**
 * 
 * @param {*} param0 
 * set classes for matching nodes
 */
export const setMatchingNodeClasses = ({
  matchedNodeIDs = [],
  matchedNodeIDsInNameAndDescription = [],
  matchedNodeIDsInProperties = [],
}, node) => {
  const nodeClass = classNames({
    nodeTitle: true,
    matchedNodeIDs: (matchedNodeIDs.indexOf(node.id) !== -1),
    matchedInNameAndDescription: (matchedNodeIDsInNameAndDescription
        .indexOf(node.id) !== -1),
    matchedInProperties: (matchedNodeIDsInProperties.indexOf(node.id) !== -1)
  });
  node.data['matchingClasses'] = nodeClass;
} 