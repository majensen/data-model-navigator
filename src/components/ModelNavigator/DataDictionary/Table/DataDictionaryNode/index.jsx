/* eslint-disable react/forbid-prop-types */
import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core";
import { downloadTemplate } from "../../Utils/utils";
import { getCategoryColor } from "../../NodeCategories/helper";
import DataDictionaryPropertyTable from "../DataDictionaryPropertyTable";
import "./DataDictionaryNode.css";
import styles from "./DataDictionaryNode.style";
import NodeViewComponent from "./components/NodeViewComponent";

const NODE_STATE = {
  OPEN: "open",
  CLOSE: "close",
};

const DataDictionaryNode = ( props ) => {
  const { classes, node, pdfDownloadConfig, description, expanded } = props;
  const notHorizontal = true; // supports landscape orientation

  const handleClickNode = (nodeID) => {
    const { expanded, expandNode } = props;
    if (!expanded) {
      expandNode(nodeID, NODE_STATE.OPEN);
    } else {
      expandNode(nodeID, NODE_STATE.CLOSE);
    }
  };

  const handleCloseNode = () => {
    const { expandNode } = props;
    expandNode(null);
  };

  const handleDownloadTemplate = (e, format) => {
    const { node } = props;
    e.stopPropagation(); // no toggling
    downloadTemplate(format, node.handle);
  };


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
          pdfDownloadConfig={pdfDownloadConfig}
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

DataDictionaryNode.propTypes = {
  node: PropTypes.object.isRequired,
  description: PropTypes.string,
  expanded: PropTypes.bool,
  expandNode: PropTypes.func,
};

DataDictionaryNode.defaultProps = {
  description: "",
  expanded: false,
  expandNode: () => {},
};

export default withStyles(styles)(DataDictionaryNode);
