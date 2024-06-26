import React, { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Icon, withStyles } from "@material-ui/core";
import { legendIconUrl } from "../../NodeCategories/helper";
import relationshipSvg from "../../NodeCategories/icons/Legend/lg_relationship_links.svg";
import toggleSvg from "../../NodeCategories/icons/Legend/lg_link.svg";
import Styles from "./LegendStyle";
import _ from 'lodash';
import clsx from "clsx";
import {
  legendDisplayChanged,
  selectLegendDisplayed,
  selectGraphViewConfig,
} from '../../../../../features/graph/graphSlice';
import {
  selectOverlayPropertyHidden,
} from '../../../../../features/search/searchSlice';

const Legend = ({
  classes,
  categoryItems,
  styles,
  overlayPropertyHidden
}) => {
  const dispatch = useDispatch();
  const display = useSelector( selectLegendDisplayed );
  const graphViewConfig = useSelector( selectGraphViewConfig );
  styles = styles ? styles : graphViewConfig?.legend?.styles;
  const toggleLegend = () => dispatch(legendDisplayChanged(!display));

  /**
  * set legend position - scroll bar width varies based on browser so
  * legend position must be
  * adjusted by window.innerWidth and document.documentElement.clientWidth
  * (refrane from using hard coded value)
  * latest version of browse will have scroll bar over browser
  */
  const scrollBarWidth = document.documentElement.clientWidth;
  const rightMargin =  window.innerWidth - scrollBarWidth;
  const positionRight = rightMargin > 0 ? rightMargin : 17;
  const position = { right: positionRight };

  const categoryListComponent = categoryItems.map((category) => {
    const imgUrl = `${legendIconUrl}${category}.svg`;
    return (
      <div key={category} className={classes.category}>
        <div className={classes.categoryIcon}>
          <img src={imgUrl} alt="icon" />
        </div>
        <span className={classes.text}>{_.capitalize(category)}</span>
      </div>
    );
  });

  const ToggleBtn = () => (
    <div className={display ? classes.headerExpand : classes.headerCollapse}>
      {display && <span className={classes.headerTitle}>Node Category</span>}
      <span
        className={classes.toggleBtn}
        onClick={toggleLegend}
        role="button"
        tabIndex={0}
      >
        <img src={toggleSvg} alt="toggle Legend" />
      </span>
    </div>
  );

  return (
    <>
      <div
        className={clsx({
          [classes.zvalue]: overlayPropertyHidden,
          [classes.legendExpand]: display,
          [classes.legendCollapse]: !display,
        })}
        style={
          display
            ? { ...styles?.legendExpand, ...position }
            : { ...styles?.legendCollapse, ...position }
        }
      >
        {
          <>
            <ToggleBtn />
            {display && (
              <>
                <div className={classes.item}>
                  <img src={relationshipSvg} alt="relation" />
                  <span className={classes.text}>relationship links</span>
                </div>
                {categoryListComponent}
              </>
            )}
          </>
        }
      </div>
    </>
  );
};

export default withStyles(Styles)(Legend);
