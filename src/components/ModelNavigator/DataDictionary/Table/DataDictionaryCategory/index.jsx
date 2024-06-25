/* eslint-disable react/prefer-stateless-function */
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import _ from 'lodash';
import { withStyles } from "@material-ui/core";
import {
  defaultCategory,
  getCategoryStyle,
  tableNodeCategoryList,
} from "../../NodeCategories/helper";
import DataDictionaryNode from "../DataDictionaryNode";
import styles from "./DataDictionaryCategory.style";
import {
  selectHighlightingNodeID,
} from '../../../../../features/graph/graphSlice';

const DataDictionaryCategory = ({
  classes,
  category,
  // pdfDownloadConfig,
  expandNode,
  nodes,
}) => {
  const highlightingNodeID = useSelector( selectHighlightingNodeID );

  const categoryStyles = getCategoryStyle(category);
  const categoryColor = categoryStyles.color;
  const background = categoryStyles.background
    ? categoryStyles.background
    : categoryStyles.color;
  const iconURL = tableNodeCategoryList[category]
    ? tableNodeCategoryList[category].icon
        : defaultCategory.icon;
  
  return (
    <div>
      <div
        style={{
          borderLeftColor: categoryColor,
            minHeight: '44px',
          background,
            display: 'flex',
            alignItems: 'center',
          color: "#ffffff",
            paddingLeft: '20px',
            gap: '8px'
        }}
      >
        <img src={iconURL} alt="icon"  style={{
        width: '32px'}
        }/>
        <div className={classes.title}>
          <span>{_.capitalize(category)} </span>
        </div>
      </div>
      <div

        style={{ borderLeftColor: categoryColor }}
      />
      {nodes.map((node) => (
        <DataDictionaryNode
          node={node}
          key={node.handle}
          description={node.desc}
          // pdfDownloadConfig={pdfDownloadConfig}
          expanded={true || highlightingNodeID && highlightingNodeID.includes(node.handle)}
          expandNode={expandNode}
        />
      ))}
    </div>
  );
};

export default withStyles(styles)(DataDictionaryCategory);
