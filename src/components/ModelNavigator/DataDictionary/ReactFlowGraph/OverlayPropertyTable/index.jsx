/* eslint-disable max-len */
/* eslint-disable react/forbid-prop-types */
import React, { useRef, useContext } from 'react';
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
  selectMatchedResult,
} from '../../../../../features/search/searchSlice';
import {
  changedVisOverlayPropTable,
  selectPropTableNodeID,
  selectHighlightingMatchedNodeID,
} from '../../../../../features/graph/graphSlice';
import {defaultStyleAttributes} from '../../../Config/nav.config';
import { ConfigContext } from '../../../Config/ConfigContext';

import DataDictionaryPropertyTable from "../../Table/DataDictionaryPropertyTable";
import styles from "./OverlayPropertyTable.style";
import NodeViewComponent from "../../Table/DataDictionaryNode/components/NodeViewComponent";

const OverlayPropertyTable = ({
  classes,
  nodeID,
  hidden,
}) =>  {
  const dispatch = useDispatch();
  const config = useContext( ConfigContext );
  const isSearchMode = useSelector(selectIsSearchMode);
  const node = nodeID ? globalThis.model.nodes( nodeID ) : null; // eslint-disable-line no-undef
  const matchedNodeID = useSelector( selectHighlightingMatchedNodeID );
  const matchedResult = useSelector(
    (state, matchedNodeID) => selectMatchedResult(state, matchedNodeID)
  );

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
  const category = node.tags('Category') ? node.tags('Category') : null;
  const borderLeftColor = node.tags('Category') 
        ? config.tagAttribute('Category', node.tags('Category')).table.color
        : defaultStyleAttributes.node.color;
  const backgroundColor = node.tags('Category')
        ? config.tagAttribute('Category', node.tags('Category')).node.background
        : defaultStyleAttributes.node.background;
  const tableIcon = node.tags('Category') 
        ? (node.tags('Category').table.icon
           ? node.tags('Category').table.icon
           : defaultStyleAttributes.table.icon)
        : defaultStyleAttributes.table.icon;
  return (
    <div className={classes.table}>
      <div className={classes.background} />
      <div className={classes.fixedContainer}>
        <div className={classes.content}>
          <div className={classes.header}>
            <div
              className={classes.category}
              style={{
                borderLeftColor,
                backgroundColor
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
                  src={tableIcon}
                  alt="icon"
                  className={classes.categoryIcon}
                />
                { category ? (
                  <h4
                    style={{ color: "#FFF" }}
                    className={classes.categoryText}
                  >
                    {_.capitalize(node.category)}
                  </h4>
                ) : (
                  <>
                  </>
                )}
              </div>
              <div>
                <IconButton
                  className={classes.iconCloseRounded}
                  onClick={() => dispatch(changedVisOverlayPropTable("hide"))}
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
            style={{ borderLeftColor }}
          />
          <div
            className={classes.node}
            style={{
              borderLeftColor,
              marginBottom: "0px",
              borderRight: "1px solid #ADBEC4",
              backgroundColor: "white",
            }}
          >
            <NodeViewComponent
              node={node}
              description={node.desc}
              matchedResult={matchedResult}
              propertyCount={node.props().length}
              isOverlay={true}
            />
          </div>
          
          <div
            className={classes.propertyTable}
            style={{ borderLeftColor }}
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
