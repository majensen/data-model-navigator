import React from 'react';
import clsx from 'clsx';
import { useSelector, useDispatch } from 'react-redux';
import { Button, withStyles } from '@material-ui/core';
import styles from './ActionLayer.style';
import {
  searchResultCleared,
  selectIsSearchMode,
  selectOverlayPropertyHidden,
} from '../../../../../../features/search/searchSlice';
import {
  selectOverlayTableHidden,
} from '../../../../../../features/graph/graphSlice';

/**
* A layer over the graph.
* Put action buttons here.
*/
const ActionLayer = ({
  classes,
}) => {
  const dispatch = useDispatch();
  const isSearchMode = useSelector( selectIsSearchMode );
  const overlayPropertyHidden = useSelector( selectOverlayPropertyHidden );
  const overlayTableHidden =  useSelector( selectOverlayTableHidden );
  return (
    <div className={clsx(classes.actionLayer, {
      [classes.zvalue]: !overlayPropertyHidden || !overlayTableHidden,
    })}>
      {
        isSearchMode && (
          <Button
            className={clsx(classes.clearSearch, {
              [classes.zvalue]: !overlayPropertyHidden || !overlayTableHidden,
            })}
            onClick={() => dispatch(searchResultCleared())}
            label="Clear Search Result"
          > Clear Search Result
            </Button>
        )
      }
    </div>
  );
}

export default withStyles(styles)(ActionLayer);
