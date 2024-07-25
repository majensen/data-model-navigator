import React from 'react';
import { Button } from '@mui/material';

import withStyles from '@mui/styles/withStyles';

const TabPanel = ({
  children,
  value,
  index,
  classes,
}) => (
  <div
    className={classes.content}
    role="tabpanel"
    hidden={value !== index}
  >
    {children}
  </div>
);

const styles = () => ({
  content: {
    height: '100%',
  },
});

export default withStyles(styles)(TabPanel);
