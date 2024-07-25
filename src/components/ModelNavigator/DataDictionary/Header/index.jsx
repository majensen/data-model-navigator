import React, { useContext } from 'react';
import withStyles from '@mui/styles/withStyles';
import clsx from 'clsx';
import styles from './Header.style';
import CustomTheme from './Header.theme.config';
import { ConfigContext } from '../../Config/ConfigContext';
import { ModelContext } from '../../Model/ModelContext';
import { brandIconSrc } from '../../Config/nav.config';

const HeaderComponent = ({
  classes,
}) => {
  const config = useContext( ConfigContext );
  const model = useContext( ModelContext );

  const handle = model.handle;
  const version = model.version;
  
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
                className={version ? clsx(classes.title, classes.titleWithVersion) : classes.title}
              >
                {config.pageTitle || "Data Model Navigator"}
              </h2>
              {handle && (<span className={classes.modelVersion}>{handle}</span>)}
              {version && (<span className={classes.modelVersion}>Version {version}</span>)}
            </div>
          </div>
        </div>
        <hr className={classes.divider} />
      </CustomTheme>
    </>

  );
};

export default withStyles(styles)(HeaderComponent);
