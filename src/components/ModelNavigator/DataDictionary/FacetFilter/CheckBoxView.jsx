/* eslint-disable no-unused-vars */
import React, {useContext} from "react";
import { useSelector, useDispatch } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { Checkbox, ListItem, ListItemText, Divider, Tooltip } from "@material-ui/core";
import {
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxBlankIcon,
} from "@material-ui/icons";
import { ConfigContext } from '../../Config/ConfigContext'; 
import {
  selectCheckboxState,
  selectFullTagMatrix,
  selectDisplayedTagMatrix,
  filterSelectorToggled,
} from "../../../../features/filter/filterSlice";
import {
  clickedBlankSpace,
  changedVisOverlayPropTable,
} from "../../../../features/graph/graphSlice";
import _ from "lodash";

const styles = {
  listItemGutters: {
    padding: "10px 20px 10px 0px",
    // paddingRight: '5px',
    boxShadow: "inset -10px -1px 10px -7px rgb(50 50 50 / 25%)",
    display: "flex",
    alignItems: "center",
  },
  checkboxRoot: {
    marginLeft: "5px",
    height: 12,
  },
  panelDetailText: {
    color: "#323232",
    fontFamily: "Nunito",
    fontSize: "14px",
    fontWeight: "200",
  },
  panelSubjectText: {
    color: "#323232",
    fontFamily: "Nunito",
    fontSize: "14px",
    marginRight: "0px",
  },
};
const alignment = "flex-start";

function CheckBoxView(props) {
  const {
    classes,
    checkboxItem,
    facetItem,
    defaultFacetSectionProps,
    backgroundColor,
  } = props;
  const dispatch = useDispatch();
  const config = useContext( ConfigContext );
  const checkboxState = useSelector(selectCheckboxState);
  const displayedTagMatrix = useSelector(selectDisplayedTagMatrix);
  const fullTagMatrix = useSelector(selectFullTagMatrix);
  const getStyles = () => {
    if (checkboxState[`checkbox_${checkboxItem.tag}_${checkboxItem.value}`]) {
      return {
        backgroundColor: backgroundColor,
        boxShadow: "none",
      };
    }
  };
  const handleToggle = (tagpair) => {
    dispatch(filterSelectorToggled(tagpair));
    dispatch(changedVisOverlayPropTable('hide'));
    dispatch(clickedBlankSpace());
  };


  return (
    <>
      <ListItem
        width={1}
        button
        alignItems={alignment}
        selected={checkboxState[`checkbox_${checkboxItem.tag}_${checkboxItem.value}`]}
        onClick={(e) => {
         handleToggle({tag:checkboxItem.tag, value:checkboxItem.value})
        }}
        className={classes.nested}
        style={getStyles()}
        classes={{
          selected: classes.selected,
          gutters: classes.listItemGutters,
        }}
        role="presentation"
      >
        <Checkbox
          id={`checkbox_${facetItem.tag}_${checkboxItem.value}`}
          icon={<CheckBoxBlankIcon style={{ fontSize: 18 }} />}
          checkedIcon={
            <CheckBoxIcon
              style={{
                fontSize: 18,
              }}
            />
          }
          style={{
            color: config.facetSection(facetItem.section)
              ? config.facetSection(facetItem.section).checkBoxBorderColor
              ? config.facetSection(facetItem.section).checkBoxBorderColor
              :"#137fbe"
            : "#137fbe",
          }}
          checked={checkboxState[`checkbox_${checkboxItem.tag}_${checkboxItem.value}`]}
          // onChange={(e) => {
          //   e && e.stopPropagation();
          //   handleToggle({tag:checkboxItem.tag, value:checkboxItem.value})
          // }}
          tabIndex={-1}
          disableRipple
          color="secondary"
          classes={{ root: classes.checkboxRoot }}
          inputProps={{ "aria-label": checkboxItem.name }}
        />
        {checkboxItem.title ? (
          <>
            <Tooltip title={checkboxItem.title.name}>
              <div className={classes.panelDetailText}>
                <span>{`${checkboxItem.title.acronym}`}</span>
              </div>
            </Tooltip>
          </>
        ) : (
          <div className={classes.panelDetailText}>
            <span>{checkboxItem.name}</span>
          </div>
        )}
        <ListItemText />
        <div className={classes.panelSubjectText}>
          <span
            style={{
              color: config.facetSection(facetItem.section)
                ? config.facetSection(facetItem.section).color
                ? config.facetSection(facetItem.section).color
                : defaultFacetSectionProps.color
              : defaultFacetSectionProps.color,
            }}
          >
            &nbsp;
            {displayedTagMatrix[checkboxItem.tag]
             ? (displayedTagMatrix[checkboxItem.tag][checkboxItem.value]
                ? displayedTagMatrix[checkboxItem.tag][checkboxItem.value].count
                : fullTagMatrix[checkboxItem.tag][checkboxItem.value].count)
             : (fullTagMatrix[checkboxItem.tag]
                ? fullTagMatrix[checkboxItem.tag][checkboxItem.value].count
                : "")}
          </span>
        </div>
      </ListItem>
      <Divider
        variant="middle"
        style={{
          backgroundColor: checkboxState[`checkbox_${checkboxItem.tag}_${checkboxItem.value}`]
            ? "#FFFFFF" : "#B1B1B1",
          margin: "0px",
          height: checkboxState[`checkbox_${checkboxItem.tag}_${checkboxItem.value}`]
            ? "2px" : "1px",
        }}
      />
    </>
  );
}

export default withStyles(styles)(CheckBoxView);
