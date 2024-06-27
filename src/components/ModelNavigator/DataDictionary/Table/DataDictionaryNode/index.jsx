import React, {useContext} from "react";
import { useSelector, useDispatch } from 'react-redux';
import { withStyles } from "@material-ui/core";
// import { downloadTemplate } from "../../Utils/utils";
import { getCategoryColor } from "../../NodeCategories/helper";
import DataDictionaryPropertyTable from "../DataDictionaryPropertyTable";
import "./DataDictionaryNode.css";
import styles from "./DataDictionaryNode.style";
import NodeViewComponent from "./components/NodeViewComponent";
import { ConfigContext } from "../../../Config/ConfigContext";

import {
  tableNodeExpanded,
} from '../../../../../features/graph/graphSlice';

const NODE_STATE = {
  OPEN: "open",
  CLOSE: "close",
};

const DataDictionaryNode = ({
  classes,
  node, // this is an mdf-reader node, not a flowgraph node
  // pdfDownloadConfig,
  tag,
  value,
  description,
  expanded
}) => {
  const dispatch = useDispatch();
  const config = useContext( ConfigContext );
  
  const handleClickNode = (nodeID) => {
    if (!expanded) {
      dispatch(tableNodeExpanded(NODE_STATE.OPEN));
    } else {
      dispatch(tableNodeExpanded(NODE_STATE.CLOSED));
    }
  };

  const handleCloseNode = () => {
      dispatch(tableNodeExpanded(NODE_STATE.CLOSED));
  };

  // const handleDownloadTemplate = (e, format) => {
  //   const { node } = props;
  //   e.stopPropagation(); // no toggling
  //   downloadTemplate(format, node.handle);
  // };

  const color = tag ? config.tagAttribute(tag, value).table.color : '#000000';

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
          isExpanded={expanded}
          description={description}
          // pdfDownloadConfig={pdfDownloadConfig}
          propertyCount={propertyCount}
        />
      </div>
      {expanded && (
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
