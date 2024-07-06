/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  List,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  withStyles,
  Divider,
  Backdrop,
  CircularProgress,
  Icon,
  Button,
} from "@material-ui/core";
import {
  ArrowDropDown as ArrowDropDownIcon,
  ExpandMore as ExpandMoreIcon,
} from "@material-ui/icons";
import _ from "lodash";
import { ConfigContext } from '../../Config/ConfigContext'; 
import { ModelContext } from '../../Model/ModelContext';
import {
  resetIcon,
  defaultFacetSectionProps,
} from "../../Config/nav.config";
import {
  filtersInitRequested,
  allFiltersCleared,
  selectFiltersSelected,
} from "../../../../features/filter/filterSlice";
import {
  clickedBlankSpace,
  changedVisOverlayPropTable,
} from "../../../../features/graph/graphSlice";
import FacetSelector from "./FacetSelector";
import styles from "./FacetFilters.style";
import FacetFilterThemeProvider from "./FacetFilterThemeConfig";

const CustomAccordionSummary = withStyles({
  root: {
    marginBottom: -1,
    padding: "0 39px",
    minHeight: 48,
    // marginLeft: 35,
    "&$expanded": {
      minHeight: 48,
    },
  },
  content: {
    "&$expanded": {
      margin: "16px 0",
    },
  },
  expanded: {},
})(AccordionSummary);

const FacetFiltersView = ({
  classes,
  onToggleCheckBox,
  onResetGraphCanvas,
  onSortSection,
}) => {
  const dispatch = useDispatch();
  const model = useContext( ModelContext );
  const config = useContext( ConfigContext );
  dispatch(filtersInitRequested(model));

  const facetSectionProps = config.facetSections;
  const facetFilters = config.facetFilters;

  const showCheckboxCount = 3;
  
  const selectedFilters = useSelector(selectFiltersSelected);
  const selectedFiltersCount = selectedFilters ? selectedFilters.length : 0;

  const [sectionsExpanded, setSectionsExpanded] = useState([]);

  const handleSectionChange = (panel) => (event, isExpanded) => {
    const sections = _.cloneDeep(sectionsExpanded);
    if (isExpanded) {
      sections.push(panel);
    } else {
      const index = sections.indexOf(panel);
      if (index > -1) {
        sections.splice(index, 1);
      }
    }
    setSectionsExpanded(sections);
  };

  const sections = {};
  facetFilters
    .forEach( (filt) => {
      if (!sections[filt.section]) {
        sections[filt.section] = { sectionName: filt.section, items: [] };
      }
      sections[filt.section].items.push(filt);
    });
  const sideBarSections = Object.values(sections);
  
  // this below is not right - there should be a single "default section"
  if (
    facetSectionProps &&
    facetSectionProps.length === 0
  ) {
    return <></>;
  }

  const clearFilterHandler = () => {
    dispatch(allFiltersCleared());
    dispatch(clickedBlankSpace());
    dispatch(changedVisOverlayPropTable('hide'));
  };

  return (
    <>
      <Button
        id="button_sidebar_clear_all_filters"
        variant="outlined"
        disabled={selectedFiltersCount === 0}
        className={classes.customButton}
        classes={{ root: classes.clearAllButtonRoot }}
        onClick={clearFilterHandler}
        disableRipple
      >
        CLEAR ALL
      </Button>
      {sideBarSections.map((currentSection) => (
        <FacetFilterThemeProvider key={currentSection?.sectionName}>
          <Divider
            variant="middle"
            style={{
              backgroundColor: config.facetSection(currentSection.sectionName)
                ? config.facetSection(currentSection.sectionName).color
                ? config.facetSection(currentSection.sectionName).color
                : ""
              : "#000000",
              margin: "0px",
              height: config.facetSection(currentSection.sectionName)
                ? config.facetSection(currentSection.sectionName).height
                  ? config.facetSection(currentSection.sectionName).height
                  : ""
                : "5px",
            }}
          />
          <Accordion
            expanded={sectionsExpanded.includes(currentSection.sectionName)}
            onChange={handleSectionChange(currentSection.sectionName)}
            classes={{
              root: classes.expansionPanelRoot,
            }}
          >
            <CustomAccordionSummary
              expandIcon={
                <ArrowDropDownIcon
                  classes={{ root: classes.dropDownIconSection }}
                  fontSize="large"
                />
              }
            >
              <div className={classes.sectionSummaryText}>
                {currentSection.sectionName}
              </div>
            </CustomAccordionSummary>

            <AccordionDetails
              classes={{ root: classes.expansionPanelDetailsRoot }}
            >
              <List component="div" disablePadding dense>
                {
                  currentSection.items.map((facetItem) => {
                    return (
                      <FacetSelector facetItem={facetItem}
                                     section={currentSection}
                      />
                    );
                  })
                }
              </List>
            </AccordionDetails>
          </Accordion>
        </FacetFilterThemeProvider>
      ))}
    </>
  );
};

export default withStyles(styles)(FacetFiltersView);
