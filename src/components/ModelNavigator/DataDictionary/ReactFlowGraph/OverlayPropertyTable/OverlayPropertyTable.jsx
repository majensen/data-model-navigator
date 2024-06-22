/* eslint-disable max-len */
/* eslint-disable react/forbid-prop-types */
import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import IconButton from '@material-ui/core/IconButton';
import { Grid, withStyles } from '@material-ui/core';
import _ from 'lodash';

import {
  getNodeDescriptionFragment,
  getNodeTitleFragment,
} from '../../Utils/highlightHelper';

import {
  selectIsSearchMode,
  selectSearchResult,
} from '../../../../../features/search/searchSlice';
import {
  changedVisOverlayPropTable,
  selectPropTableNodeID,
} from '../../../../../features/graph/graphSlice';
import {
  getCategoryBackground,
  getCategoryColor,
  tableIconUrl,
} from "../../NodeCategories/helper";
import DataDictionaryPropertyTable from "../../Table/DataDictionaryPropertyTable";
import styles from "./OverlayPropertyTable.style";
import NodeViewComponent from "../../Table/DataDictionaryNode/components/NodeViewComponent";

const OverlayPropertyTable = ({
  classes,
  nodeID,
  matchedResult,
  hidden,
}) =>  {
  const dispatch = useDispatch();
  const isSearchMode = useSelector(selectIsSearchMode);
  const node = nodeID ? globalThis.model.nodes( nodeID ) : null; // eslint-disable-line no-undef
  const getTitle = () => {
    if (isSearchMode) {
      const nodeTitleFragment = getNodeTitleFragment(
        matchedResult.matches,
        node.title,
        "overlay-property-table__span"
      );
      return nodeTitleFragment;
    }
    return node.title;
  };

  const getDescription = () => {
    if (isSearchMode) {
      const nodeDescriptionFragment = getNodeDescriptionFragment(
        matchedResult.matches,
        node.description,
        "overlay-property-table__span"
      );
      return nodeDescriptionFragment;
    }
    return node.description;
  };

  /**
   * Toggle the property table to display all properties
   */
  const handleOpenAllProperties = () => {
    // this.props.onOpenMatchedProperties();
  };

  /**
   * Toggle the property table to display matched properties only
   */
  const handleDisplayOnlyMatchedProperties = () => {
    // this.props.onCloseMatchedProperties();
  };

  const needHighlightSearchResult = isSearchMode;
  if (!node || hidden) {
    return (
      <></>
    );
  }
  return (
    <div className={classes.table}>
      <div className={classes.background} />
      <div className={classes.fixedContainer}>
        <div className={classes.content}>
          <div className={classes.header}>
            <div
              className={classes.category}
              style={{
                borderLeftColor: getCategoryColor(node.category),
                backgroundColor: getCategoryBackground(node.category),
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  paddingLeft: '4px'
                }}
              >
                <img
                  src={`${tableIconUrl}${node.category}.svg`}
                  alt="icon"
                  className={classes.categoryIcon}
                />
                <h4
                  style={{ color: "#FFF" }}
                  className={classes.categoryText}
                >
                  {_.capitalize(node.category)}
                </h4>
              </div>
              <div>
                <IconButton
                  className={classes.iconCloseRounded}
                  onClick={() => dispatch(changedVisOverlayPropTable(true))}
                >
                  <CloseRoundedIcon
                    style={{ color: "#FFF", fontSize: "20px" }}
                  />
                </IconButton>
              </div>
            </div>
          </div>
          <div
            className={classes.categoryDivider}
            style={{ borderLeftColor: getCategoryColor(node.category) }}
          />
          <div
            className={classes.node}
            style={{
              borderLeftColor: getCategoryColor(node.category),
              marginBottom: "0px",
              borderRight: "1px solid #ADBEC4",
              backgroundColor: "white",
            }}
          >
            <NodeViewComponent
              node={node}
              description={node.desc}
              isSearchMode={isSearchMode}
              matchedResult={matchedResult}
              // pdfDownloadConfig={props.pdfDownloadConfig}
              propertyCount={node.props().length}
              isOverlay={true}
            />
          </div>
          
          <div
            className={classes.propertyTable}
            style={{ borderLeftColor: getCategoryColor(node.category) }}
          >
            <div className={classes.property}>
              <DataDictionaryPropertyTable
                title={node.title}
                node={node}
                onlyShowMatchedProperties={false}
                needHighlightSearchResult={needHighlightSearchResult}
                hideIsRequired={false}
                matchedResult={matchedResult}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withStyles(styles)(OverlayPropertyTable);
