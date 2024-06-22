/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
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
import {
  resetIcon,
  defaultFacetSectionProps,
  filterConfig
} from "../../../config/nav.config";
import {
  configsLoaded,
  filterSelectorToggled,
  allFiltersCleared,
  selectFiltersSelected,
} from "../../../../../features/filter/filterSlice";
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
  hidePropertyTable,
  onClickBlankSpace,
  onResetGraphCanvas,
  onSortSection,
}) => {
  const dispatch = useDispatch();

  const { facetSectionProps, facetFilters } = filterConfig;
  
  const showCheckboxCount = filterConfig?.showCheckboxCount || 3;
  
  const selectedFilters = useSelector(selectFiltersSelected);
  const selectedFiltersCount = selectedFilters ? selectedFilters.length : 0;

  const [checkBoxCount, setCheckBoxCount] = useState(3);

  useEffect(() => {
    setCheckBoxCount(showCheckboxCount);
  }, []);


  const [sectionsExpanded, setSectionsExpanded] = useState(
    Object.keys(facetSectionProps).reduce((acc, filterKey) => {
      const { isExpanded } = facetSectionProps[filterKey];
      if (isExpanded) {
        acc.push(filterKey);
      }
      return acc;
    }, [])
  );

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

  const handleToggle = (item) => () => {
    // this is not good
    const checkBoxInfo = { 
      groupName: item.groupName,
      section: item.section,
      name: item.name,
      group: item.group,
      tag: item.tag,
      value: item.value,
      datafield: item.datafield,
      isChecked: item.isChecked,
    };
    // onClickBlankSpace();
    // hidePropertyTable();
    // onToggleCheckBox(toggleCheckBoxItem); //
    dispatch(filterSelectorToggled({checkBoxInfo}));
  };

  // this provides the data that is ultimately displayed:
  // which is state.submission.checkbox
  
  // const sideBarContent = useSelector((state) => 
  //   state.submission && state.submission.checkbox
  //     ? state.submission.checkbox // are 'checkboxItems'
  //     : {
  //         data: [],
  //       defaultPanel: false,
        
  //     }
  // );

  // const sideBarDisplay = sideBarContent.data.filter(
  //   (sideBar) => sideBar.show === true
  // );

  /*
  const sideBarSections = arrangeBySections(sideBarDisplay);
  
  const arrangeBySections = (arr) => {
    const sideBar = {};
    arr.forEach(({ section, ...item }) => {
      if (!sideBar[section]) {
        sideBar[section] = { sectionName: section, items: [] };
      }
      sideBar[section].items.push({ section, ...item });
    });
    return Object.values(sideBar);
  };
  */

    // sideBarItem has datafield, checkboxItems (array), groupName = is just a facetFilter
  // currentSection has items (array), sectionName, 
  // currentSection.items - array of sideBarItems = facetFilters
  // sideBarSections - arry of [current]Sections
  // sideBarSections just an array of groups (by section) of facetFilters
  const sections = {};
  facetFilters
    .forEach( (filt) => {
      if (!sections[filt.section]) {
        sections[filt.section] = { sectionName: filt.section, items: [] };
      }
      sections[filt.section].items.push(filt);
    });
  const sideBarSections = Object.values(sections);
  
  
  if (
    facetSectionProps &&
    Object.keys(facetSectionProps).length === 0
  ) {
    return <></>;
  }

  const clearFilterHandler = () => {
    dispatch(allFiltersCleared());
    onClickBlankSpace();
    hidePropertyTable();
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
              backgroundColor: facetSectionProps[currentSection.sectionName]
                ? facetSectionProps[currentSection.sectionName].color
                  ? facetSectionProps[currentSection.sectionName].color
                  : ""
                : "#000000",
              margin: "0px",
              height: facetSectionProps[currentSection.sectionName]
                ? facetSectionProps[currentSection.sectionName].height
                  ? facetSectionProps[currentSection.sectionName].height
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
                                     facetSectionProps={facetSectionProps}
                                     handleToggle={handleToggle}
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
