/* eslint-disable react/prefer-stateless-function */
import React, {useContext} from "react";
import { useSelector, useDispatch } from "react-redux";
import _ from 'lodash';
import { withStyles } from "@material-ui/core";
import { defaultStyleAttributes } from '../../../Config/nav.config';
import DataDictionaryNode from "../DataDictionaryNode";
import styles from "./DataDictionaryCategory.style";
import {
  selectHighlightingNodeID,
} from '../../../../../features/graph/graphSlice';
import { ConfigContext } from '../../../Config/ConfigContext';

const DataDictionaryCategory = ({
  classes,
  category,
  expandNode,
  nodes,
}) => {
  const config = useContext( ConfigContext );
  const highlightingNodeID = useSelector( selectHighlightingNodeID );
  const categoryStyles = config.tagAttribute('Category', category)
        ? config.tagAttribute('Category', category)
        : defaultStyleAttributes;
  const categoryColor = categoryStyles.color;

  const background = categoryStyles.node.background
        ? categoryStyles.node.background
        : categoryStyles.color;
  
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
        <img
          src={categoryStyles.table.icon}
          alt="icon"
          style={{width: '32px'}}
        />
        { category ? (
          <div className={classes.title}>
            <span>{_.capitalize(category)} </span>
          </div>
        ) : (
          <>
          </>
        )}
      </div>
      <div
        style={{ borderLeftColor: categoryColor }}
      />
      {nodes.map((node) => (
        <DataDictionaryNode
          node={node}
          key={node.handle}
          category={config.legendTag}
          description={node.desc}
          expanded={true || highlightingNodeID && highlightingNodeID.includes(node.handle)}
          expandNode={expandNode}
        />
      ))}
    </div>
  );
};

export default withStyles(styles)(DataDictionaryCategory);
