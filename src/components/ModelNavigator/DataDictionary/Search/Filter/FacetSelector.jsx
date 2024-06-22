import React, { Fragment, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
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
import _ from "lodash";
import {
  ArrowDropDown as ArrowDropDownIcon,
  ExpandMore as ExpandMoreIcon,
} from "@material-ui/icons";
import CheckBoxView from "./CheckBoxView";
import styles from "./FacetFilters.style";
import {
  sortLabels,
  resetIcon,
  defaultFacetSectionProps,
} from "../../../config/nav.config";
import { filterGroupCleared } from '../../../../../features/filter/filterSlice';

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

const FacetSelector = ({
  classes,
  facetItem,
  section,
  facetSectionProps,
  handleToggle,
  checkBoxCount,
  setCheckBoxCount,
  onSortSection
}) => {
  const dispatch = useDispatch();
  
  const [groupsExpanded, setGroupsExpanded] = useState([]);
  
  const handleGroupsChange = (panel) => (event, isExpanded) => {
    const groups = _.cloneDeep(groupsExpanded);
    if (isExpanded) {
      groups.push(panel);
    } else {
      const index = groups.indexOf(panel);
      if (index > -1) {
        groups.splice(index, 1);
      }
      // setCheckBoxCount(showCheckboxCount);
    }
    setGroupsExpanded(groups);
  };

  function getSortButtonColor(facetItem, sortType) {
    return sortByForGroups[facetItem.datafield] === sortType
      ? "#B2C6D6"
      : "#4A4A4A";
  }

  const sortByForGroups = useSelector((state) =>
    state.submission && state.submission.sortByList
      ? state.submission.sortByList
      : {}
  );


  const displayAllSelection = (checkboxItems) => {
    let count = 0;
    checkboxItems.forEach((item) => {
      if (item.isChecked) {
        count += 1;
      }
    });
    setCheckBoxCount(count);
  };

  function getCheckBoxColor(index, currentSection) {
    return facetSectionProps[currentSection.sectionName]
      ? facetSectionProps[currentSection.sectionName].checkBoxColorsOne
      : defaultFacetSectionProps.checkBoxColorsOne;
  }
  
  const getGroupNameColor = (facetItem, currentSection) => {
    let groupNameColor = "black";
    facetItem.checkboxItems.map((item) => {
      if (item.isChecked) {
        groupNameColor = facetSectionProps[currentSection.sectionName]
          ? facetSectionProps[currentSection.sectionName].color
            ? facetSectionProps[currentSection.sectionName].color
            : ""
          : defaultFacetSectionProps.color;
      }
      return "";
    });
    return groupNameColor;
  };

  const checkBoxes = (facetItem, section) => {
    const showItems = facetItem.checkboxItems.filter(
      (item) => item !== undefined
    );
    return showItems.map((item, index) => (
      <CheckBoxView
        key={index}
        checkboxItem={item}
        facetItem={facetItem}
        handleToggle={handleToggle}
        facetSectionProps={facetSectionProps}
        defaultFacetSectionProps={defaultFacetSectionProps}
        backgroundColor={getCheckBoxColor(index, section)}
        checkColor={getGroupNameColor(facetItem, section)}
      />
    ));
  };


  return (
    <Fragment key={facetItem?.groupName}>
      <Accordion
        square
        expanded={groupsExpanded.includes(
          facetItem.groupName
          )}
        onChange={handleGroupsChange(facetItem.groupName)}
        classes={{
          root: classes.expansionPanelfacetItem,
        }}
      >
        <CustomAccordionSummary
          expandIcon={
            <ExpandMoreIcon
              classes={{
                root: classes.dropDownIconSubSection,
              }}
              style={{ fontSize: 26 }}
            />
          }
          className={classes.customExpansionPanelSummaryRoot}
        >
          <div
            id={`filterGroup_${facetItem.datafield}`}
            style={{
              color: getGroupNameColor(
                facetItem,
                section
              ),
            }}
            className={classes.subSectionSummaryText}
          >
            {facetItem.groupName}
          </div>
        </CustomAccordionSummary>
        <AccordionDetails
          classes={{
            root: classes.expansionPanelDetailsRoot,
          }}
        >
          <List component="div" disablePadding dense>
            <div className={classes.sortGroup}>
              <span className={classes.sortGroupIcon}>
                <Icon
                  style={{ fontSize: 10 }}
                  onClick={() => {
                    dispatch(filterGroupCleared({facetItem}));
                  }}
                >
                  <img
                    src={resetIcon.src}
                    height={resetIcon.size}
                    width={resetIcon.size}
                    alt={resetIcon.alt}
                  />
                </Icon>
              </span>
              <span
                className={classes.sortGroupItem}
                style={{
                  color: getSortButtonColor(
                    facetItem,
                    "alphabet"
                  ),
                }}
                onClick={() => {
                  onSortSection(
                    facetItem.datafield,
                    "alphabet"
                  );
                }}
              >
                {sortLabels.sortAlphabetically}
              </span>
              <span
                className={classes.sortGroupItemCounts}
                style={{
                  color: getSortButtonColor(
                    facetItem,
                    "count"
                  ),
                }}
                onClick={() => {
                  onSortSection(
                    facetItem.datafield,
                    "count"
                  );
                }}
              >
                {sortLabels.sortByCount}
              </span>
            </div>
            { checkBoxes(facetItem, section) }
            </List> 
        </AccordionDetails>
      </Accordion>
    </Fragment>
  );
};

export default withStyles(styles)(FacetSelector);
