import React, { useState, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import {
  Button,
  withStyles,
} from '@material-ui/core';
import clsx from 'clsx';
import styles from './Header.style';
import CustomTheme from './Header.theme.config';
import { ConfigContext } from '../../Config/ConfigContext';
import { brandIconSrc } from '../../Config/nav.config';

const HeaderComponent = ({
  classes,
}) => {
  const modelVersion = "TEST";
  const config = useContext( ConfigContext );
  
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
              src={config.brandIconSrc || brandIconSrc}
            />
            <div className={classes.titleAndVersion}>
              <h2
                className={modelVersion ? clsx(classes.title, classes.titleWithVersion) : classes.title}
              >
                {config.pageTitle || "Data Model Navigator"}
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
