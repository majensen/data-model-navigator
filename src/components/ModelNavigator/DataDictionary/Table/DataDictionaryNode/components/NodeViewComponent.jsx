import React from "react";
import { Button, Grid, withStyles } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import styles from "./NodeViewComponent.style";
import { capitalizeFirstLetter, createFileName } from "../../../utils";
import IconDownloadPDF from "../../icons/icon_download_PDF.svg";
import IconDownloadPTSV from "../../icons/icon_download_TSV.svg";
import DownloadButton from "../../../NodePDF/DownloadButton";
import { fileManifestDownloadSettings as defaultConfig } from "../../../../../../config/file-manifest-config";
import {
  getNodeDescriptionFragment,
  getNodeTitleFragment,
} from "../../../Utils/highlightHelper";

const NodeViewComponent = ({
  classes,
  node,
  description,
  isSearchMode,
  matchedResult,
  pdfDownloadConfig,
  fileManifestConfig,
  propertyCount,
  isExpanded,
  isOverlay,
}) => {
  const csvBtnDownloadConfig = {
    image: IconDownloadPTSV,
    fileType: "tsv",
    prefix: pdfDownloadConfig?.downloadPrefix || "Data_Loading_Template-",
  };

  const isFileManifest = node.handle === "file";
  const isTemplate = node.tags('Template') === "Yes";
  const fileManifestDownloadSettings = fileManifestConfig || defaultConfig;

  const getTitle = () => {
    if (isSearchMode) {
      const nodeTitleFragment = getNodeTitleFragment(
        matchedResult.matches,
        capitalizeFirstLetter(node.handle),
        "data-dictionary-property-table__span"
      );
      return nodeTitleFragment;
    }
    return capitalizeFirstLetter(node.handle);
  };

  const getDescription = (description) => {
    if (isSearchMode) {
      const nodeDescriptionFragment = getNodeDescriptionFragment(
        matchedResult.matches,
        description,
        "data-dictionary-property-table__span"
      );
      return nodeDescriptionFragment;
    }
    return description;
  };

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
                {propertyCount === 1 ? (
                  <p
                    style={{ fontSize: "11px" }}
                  >{<span 
                    style={{ fontSize: "14px", fontWeight: "700", color: "#42779a", fontFamily: "Open Sans"}}>
                      {propertyCount}</span>
                    } property</p>
                ) : (
                  <p style={{ fontSize: "11px" }}>
                    {<span 
                    style={{ fontSize: "14px", fontWeight: "700", color: "#42779a", fontFamily: "Open Sans"}}>
                      {propertyCount}</span>
                    } properties
                  </p>
                )}
              </Button>
            </div>
            <div>
              <div className={classes.assignmentAndClassTags}>
                {node.assignment && (
                  <>
                    <span className={classes.nodeLabel}>
                      <span>Assignment:</span>
                      <span className={classes.nodeAssignment}>
                        {capitalizeFirstLetter(node.assignment)}
                      </span>
                    </span>
                  </>
                )}
                {node.class && (
                  <>
                    <span className={classes.nodeLabel}>
                      Class:
                      <span className={classes.nodeClass}>
                        {capitalizeFirstLetter(node.tags('Class'))}
                      </span>
                    </span>
                  </>
                )}
              </div>
            </div>
            {/* leave out download feature
            <div style={{ paddingRight: "10px"}}>                
              <ButtonGroup>
                {(isTemplate || (isFileManifest && isTemplate)) && (
                  <DownloadButton
                    config={csvBtnDownloadConfig}
                    documentData={node}
                    template={node.tags('Template')}
                    isFileManifest={isFileManifest}
                    fileName={
                      isFileManifest
                        ? createFileName(
                            "",
                            pdfDownloadConfig?.downloadPrefix || fileManifestDownloadSettings.filename_prefix
                          )
                        : createFileName(node.id, csvBtnDownloadConfig.prefix)
                    }
                  />
                )}
                <DownloadButton
                  config={{
                    ...pdfDownloadConfig,
                    type: "single",
                    image: IconDownloadPDF,
                  }}
                  documentData={node}
                  fileName={createFileName(node.handle, pdfDownloadConfig?.prefix)}
                />
                </ButtonGroup>
           </div>
               */}

          </div>
        </div>
      </div>
    </div>
  );
};

export default withStyles(styles)(NodeViewComponent);
