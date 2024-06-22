import React from "react";
import { useSelector, useDispatch } from 'react-redux';
import { withStyles } from "@material-ui/core";
// import { downloadTemplate } from "../../Utils/utils";
import { getCategoryColor } from "../../NodeCategories/helper";
import DataDictionaryPropertyTable from "../DataDictionaryPropertyTable";
import "./DataDictionaryNode.css";
import styles from "./DataDictionaryNode.style";
import NodeViewComponent from "./components/NodeViewComponent";
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
  description,
  expanded
}) => {
  const dispatch = useDispatch();
  
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


  const propertyCount = node.props().length;
  return (
    <>
      <div
        className={classes.node}
        style={{ borderLeftColor: getCategoryColor(node.category) }}
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
            borderLeft: `5px solid ${getCategoryColor(node.tags('Category'))}`,
            borderBottom: `1px solid #adbec4`,
          }}
        >
          <DataDictionaryPropertyTable
            title={node.handle}
            properties={node.props()}
            requiredProperties={node.props().filter(p => p.tags('inclusion') === 'required')}
            preferredProperties={node.props().filter(p => p.tags('inclusion') === 'preferred')}
            // horizontal // supports horizontal orientation
          />
        </div>
      )}
    </>
  );
}

export default withStyles(styles)(DataDictionaryNode);
