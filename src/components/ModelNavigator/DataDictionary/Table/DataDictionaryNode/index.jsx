import React, { useContext } from "react";
import { useSelector, useDispatch } from 'react-redux';
import withStyles from '@mui/styles/withStyles';
import DataDictionaryPropertyTable from "../DataDictionaryPropertyTable";
import "./DataDictionaryNode.css";
import styles from "./DataDictionaryNode.style";
import NodeViewComponent from "./components/NodeViewComponent";
import { ConfigContext } from "../../../Config/ConfigContext";

import {
  tableNodeExpandChanged,
  selectTableNodeIsExpanded,
} from '../../../../../features/graph/graphSlice';

const NODE_STATE = {
  OPEN: "open",
  CLOSED: "close",
};

const DataDictionaryNode = ({
  classes,
  node, // this is an mdf-reader node, not a flowgraph node
  category,
  description,
}) => {
  const dispatch = useDispatch();
  const config = useContext( ConfigContext );

  //           expanded={highlightingNodeID && highlightingNodeID.includes(node.handle)}
  const isExpanded = useSelector(
    state => selectTableNodeIsExpanded(state, node.handle)
  );
  const handleClickNode = (nodeID) => {
    if (!isExpanded) {
      dispatch(tableNodeExpandChanged({nodeState: NODE_STATE.OPEN, nodeID}));
    } else {
      dispatch(tableNodeExpandChanged({nodeState: NODE_STATE.CLOSED, nodeID}));
    }
  };

  // const handleCloseNode = (nodeID) => {
  //   dispatch(tableNodeExpandChanged({nodeState: NODE_STATE.CLOSED, nodeID}));
  // };

  // const handleDownloadTemplate = (e, format) => {
  //   const { node } = props;
  //   e.stopPropagation(); // no toggling
  //   downloadTemplate(format, node.handle);
  // };

  const color = category
        ? (config.tagAttribute('Category')
           ? config.tagAttribute('Category').table.color
           : '#000000' )
        : '#000000';

  const propertyCount = node.props().length;
  
  return (
    <>
      <div
        className={classes.node}
        style={{ borderLeftColor: color }}
        onClick={() => handleClickNode(node.handle)}
        onKeyPress={() => handleClickNode(node.handle)}
        role="button"
        tabIndex={0}
      >
        <NodeViewComponent
          node={node}
          isExpanded={isExpanded}
          description={description}
          // pdfDownloadConfig={pdfDownloadConfig}
          propertyCount={propertyCount}
        />
      </div>
      {isExpanded && (
        <div
          className={classes.property}
          style={{
            borderLeft: `5px solid ${color}`,
            borderBottom: `1px solid #adbec4`,
          }}
        >
          <DataDictionaryPropertyTable
            title={node.handle}
s            node={node}
            // horizontal // supports horizontal orientation
          />
        </div>
      )}
    </>
  );
}

export default withStyles(styles)(DataDictionaryNode);
