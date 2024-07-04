import React, { useContext } from "react";
import { useSelector } from 'react-redux';
import _ from 'lodash';
import { Button, Grid, withStyles } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import styles from "./NodeViewComponent.style";
import { createFileName } from "../../../utils";
import {
  getNodeDescriptionFragment,
  getNodeTitleFragment,
} from "../../../Utils/highlightHelper";
import { ConfigContext } from '../../../../Config/ConfigContext';
import {
  selectIsSearchMode,
  selectMatchedResult,
} from '../../../../../../features/search/searchSlice';
import {
  selectHighlightingMatchedNodeID,
} from '../../../../../../features/graph/graphSlice';

const NodeViewComponent = ({
  classes,
  node,
  description,
  propertyCount,
  // pdfDownloadConfig,
  // fileManifestConfig,
  isExpanded,
  isOverlay,
}) => {
  const config = useContext( ConfigContext );
  const isSearchMode = useSelector( selectIsSearchMode );
  const isFileManifest = node.handle === "file";
  const isTemplate = node.tags('Template') === "Yes";
  const highlightingMatchedNodeID = useSelector( selectHighlightingMatchedNodeID );
  const matchedResult = useSelector(
    (state) => selectMatchedResult(state, highlightingMatchedNodeID)
  );

  const getTitle = () => {
    if (isSearchMode && matchedResult) {
      const nodeTitleFragment = getNodeTitleFragment(
        matchedResult.matches,
        _.capitalize(node.handle),
        "data-dictionary-property-table__span"
      );
      return nodeTitleFragment;
    }
    return _.capitalize(node.handle);
  };

  const getDescription = (description) => {
    if (isSearchMode && matchedResult) {
      const nodeDescriptionFragment = getNodeDescriptionFragment(
        matchedResult.matches,
        description,
        "data-dictionary-property-table__span"
      );
      return nodeDescriptionFragment;
    }
    return description;
  };

  const TagLabels = () => 
        config.annotationTags.map( (tag) => {
          if (node.tags(tag)) {
            return (
              <div key={tag}>
                <span className={classes.nodeLabel}>
                  <span>{_.capitalize(tag)}:</span>
                  <span className={classes.nodeAssignment}>
                    {_.capitalize(node.tags(tag))}
                  </span>
                </span>
              </div>
            );
          } else {
            return (
              <div key={tag}>
              </div>
            );
          }
        });

  return (
    <div className={classes.container}>
      <div className={classes.titleAndDescContainer}>
        <span className={classes.nodeTitle}>{getTitle()}</span>

        <div className={classes.tagsAndDescriptionContainer}>
          <p className={classes.nodeDescription}>
            {node.desc ? getDescription(node.desc) : description}
          </p>
          <div className={classes.tagsAndBtnContainer}>
            <div>
              <Button
                startIcon={
                  !isOverlay ? (
                    !isExpanded ? (
                      <ExpandMoreIcon />
                    ) : (
                      <ExpandLessIcon />
                    )
                  ) : null
                }
                variant="contained"
                classes={{
                  root: classes.propertyCountBtn,
                }}
              >
                <p
                  style={{ fontSize: "11px" }}
                >
                  <span 
                    style={{ fontSize: "14px", fontWeight: "700", color: "#42779a", fontFamily: "Open Sans"}}>
                    {propertyCount}
                  </span>
                  { propertyCount === 1 ? (
                    <> property</>
                  ) : (
                    <> properties</>) }
                </p>
              </Button>
            </div>
            <div>
              <div className={classes.assignmentAndClassTags}>
                <TagLabels />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withStyles(styles)(NodeViewComponent);
