// this is a popup window that displays all acceptable values for a property
import React, { useEffect, useState } from 'react';
import {
  DialogContent,
  IconButton,
  Backdrop,
  Dialog,
  createTheme,
  ThemeProvider,
  StyledEngineProvider,
} from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import CloseIcon from '@mui/icons-material/Close';
import ListComponent from './ListComponent';
import ButtonComponent from './ButtonComponent';
// import DownloadFileTypeBtn from './DownloadFileTypeBtn';

const theme = {
  components: {
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '5px',
          padding: '0px 0px 0px 20px',
          boxShadow: 'none',
          overflowX: 'hidden',
          overflowY: 'hidden',
        },
        paperScrollPaper: {
          maxHeight: '575px',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '15px 25px 35px 15px',
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: '#4a4a4a52',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          padding: 'none',
          '&:hover': {
            backgroundColor: 'transparent',
            cursor: 'pointer',
          },
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: '#0d71a3',
        },
      },
    },
  },
};

const DialogComponent = ({
  classes,
  display,
  closeHandler,
  items,
  maxNoOfItems,
  maxNoOfItemDlgBox,
  isSearchMode,
  typeMatchList,
  node,
  property,
}) => {
  const [open, setOpen] = useState(display);
  const [expand, setExpand] = useState(true);
  const [values, setValues] = useState([]);
  const [boxSize, setBoxSize] = useState('sm');
  useEffect(() => {
    setOpen(display);
    setValues(items);

    if (items && items.length > maxNoOfItemDlgBox) {
      // setValues(items.slice(0, maxNoOfItemDlgBox));
      setExpand(true);
    }
  }, [display, open, items, maxNoOfItemDlgBox]);

  const expandView = () => {
    if (items.length > maxNoOfItemDlgBox + maxNoOfItems) {
      setBoxSize('md');
    }
    setValues(items);
    setExpand(true);
  };

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={createTheme(theme)}>
        <Dialog
          open={open}
          onClose={closeHandler}
          maxWidth={boxSize}
          BackdropProps={{
            timeout: 500,
          }}
          BackdropComponent={Backdrop}
        >
          <div className={classes.titleContent}>
            <div item xs={1} className={classes.closeBtn}>
              {/* <DownloadFileTypeBtn
                data={items}
                node={node}
                propertyKey={property}
                /> */}
              <IconButton onClick={closeHandler} aria-label="Close Dialog" size="large">
                <CloseIcon
                  fontSize="small"
                />
              </IconButton>
            </div>
            <div>
              <span className={classes.title}>
                Acceptable Values
              </span>
            </div>
          </div>
          <DialogContent>
            <ListComponent
              enums={values}
              maxNoOfItems={maxNoOfItems}
              maxNoOfItemDlgBox={maxNoOfItemDlgBox}
              expand={expand}
              isSearchMode={isSearchMode}
              typeMatchList={typeMatchList}
            />
            <br />
            {(items.length > maxNoOfItemDlgBox && !expand) && (
              <ButtonComponent
                label="...show more"
                openHandler={expandView}
              />
            )}
          </DialogContent>
        </Dialog>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

const styles = () => ({
  titleContent: {
    width: '100%',
  },
  title: {
    paddingLeft: '20px',
    fontSize: '18px',
    marginTop: '20px',
    display: 'inherit',
    fontWeight: '600',
    color: '#0d71a3',
  },
  closeBtn: {
    width: '225px',
    padding: '20px',
    textAlign: 'right',
    float: 'right',
  },
});

DialogComponent.defaultProps = {
  maxNoOfItems: 30,
};

export default withStyles(styles)(DialogComponent);


