import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Button,
  withStyles,
} from '@material-ui/core';
import clsx from 'clsx';
import styles from './Header.style';
import CustomTheme from './Header.theme.config';

// graph all the things
const brandIconSrc = 'https://avatars.githubusercontent.com/u/82073?v=4';
const HeaderComponent = ({
  classes,
  // model, fullDictionary, 
}) => {
  const pageConfig = {};
  const modelVersion = "TEST";
  
  return (
    <>
      <CustomTheme>
        <div
          className={classes.titleContainer}
        >
          <div
            className={classes.logoAndTitle}
          >
            <img
              className={classes.brandIcon}
              alt="brand-icon"
              src={pageConfig?.brandIconSrc || brandIconSrc}
            />
            <div className={classes.titleAndVersion}>
              <h2
                className={modelVersion ? clsx(classes.title, classes.titleWithVersion) : classes.title}
              >
                {pageConfig?.title || "Data Model Navigator"}
              </h2>
              {modelVersion && (<span className={classes.modelVersion}>Version {modelVersion}</span>)}
            </div>
          </div>
        </div>
        <hr className={classes.divider} />
      </CustomTheme>
    </>

  );
};

export default withStyles(styles)(HeaderComponent);
