import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  createTheme,
  ThemeProvider,
  StyledEngineProvider,
  adaptV4Theme,
} from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import FiberManualRecord from '@mui/icons-material/FiberManualRecord';
import {
  addHighlightingSpans,
} from '../../../Utils/highlightHelper';

const twoColumnsView = {
  overrides: {
    MuiList: {
      padding: {
        paddingTop: '0px',
      },
      root: {
        paddingBottom: '0',
        fontWeight: '500',
        listStyleType: 'disc',
        WebkitColumns: 2,
        MozColumns: 2,
        columns: 2,
      },
    },
    MuiListItem: {
      root: {
        paddingLeft: '0px',
        paddingTop: '2px',
        marginTop: '-9px',
        paddingBottom: '0',
        alignItems: 'inherit',
        fontWeight: '300',
      },
      gutters: {
        paddingLeft: '2px',
        marginBottom: '1px',
      },
    },
  },
};

const threeColumnsView = {
  overrides: {
    MuiList: {
      root: {
        paddingBottom: '0',
        fontWeight: '500',
        listStyleType: 'disc',
        WebkitColumns: 3,
        MozColumns: 3,
        columns: 3,
      },
      padding: {
        paddingTop: '0px',
        marginTop: '-10px',
      },
    },
    MuiListItemIcon: {
      root: {
        paddingLeft: '0',
        display: 'initial',
        paddingTop: '4px',
        minWidth: '10px',
        color: '#00002dd9',
      },
    },
    MuiListItem: {
      root: {
        paddingLeft: '0px',
        paddingTop: '2px',
        marginTop: '-10px',
        paddingBottom: '0',
        alignItems: 'inherit',
        fontWeight: '300',
      },
      MuiListItemText: {
        root: {
          padding: '4px',
          marginTop: '-2px',
          marginBottom: '3px',
        },
      },
      gutters: {
        margin: 'auto',
        marginBottom: '-10px',
        paddingLeft: '0px',
      },
    },
  },
};

const theme = {
  overrides: {
    MuiList: {
      padding: {
        paddingTop: '2px',
      },
    },
    MuiListItem: {
      root: {
        paddingLeft: '0px',
        paddingTop: '2px',
        marginTop: '-10px',
        paddingBottom: '0',
        alignItems: 'inherit',
        fontWeight: '300',
      },
      gutters: {
        paddingLeft: '0',
      },
    },
    MuiListItemIcon: {
      root: {
        paddingLeft: '0',
        paddingTop: '11px',
        minWidth: '10px',
        color: '#00002dd9',
      },
    },
    MuiListItemText: {
      root: {
        padding: '4px',
        marginTop: '0px',
        marginBottom: '0px',
      },
    },
  },
};

const ListComponent = ({
  classes,
  enums,
  maxNoOfItems,
  maxNoOfItemDlgBox,
  expand,
  typeMatchList,
  isSearchMode,
}) => {
  // const meanIndex = (length) => ((length % 2) ? length / 2 - 0.5 : length / 2);
  const customTheme = (expand && enums.length > maxNoOfItemDlgBox + maxNoOfItems)
    ? { overrides: { ...theme.overrides, ...threeColumnsView.overrides } }
    : (enums.length > maxNoOfItems)
      ? { overrides: { ...theme.overrides, ...twoColumnsView.overrides } } : theme;

  const highlightMatchingProperties = (enum_val) => {
    if (isSearchMode && typeMatchList && typeMatchList.length > 0) {
      const matchItem = typeMatchList.map((prop) => {
        if (prop.value === enum_val) { // so are the 'items' props or what?
          return prop;
        }
      }).filter((c) => c);
      if (matchItem.length === 1) {
        return (
          <ListItemText>
            <span className={classes.listItemText}>
              {enum_val.substring}
              {
              addHighlightingSpans(
                enum_val,
                matchItem[0].indices,
                'data-dictionary-property-table__span',
              )
            }
            </span>
          </ListItemText>
        );
      }
    }
    return (
      <ListItemText
        primary={(
          <Typography className={classes.listItemText}>
            {enum_val}
          </Typography>
        )}
      />
    );
  };

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={createTheme(adaptV4Theme(customTheme))}>
        <List>
          {enums.map((enum_val, index) => (
            <>
              <ListItem key={`${index}`}>
                <ListItemIcon>
                  <FiberManualRecord style={{ fontSize: 8 }} />
                </ListItemIcon>
                {highlightMatchingProperties(enum_val)}
              </ListItem>
            </>
          ))}
        </List>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

const styles = () => ({
  listItemText: {
    fontWeight: '300',
    fontSize: '14px',
    whiteSpace: 'pre-wrap',
  },
  longText: {
    fontSize: '13px',
    fontWeight: '300',
    marginBottom: '4px',
    lineHeight: '1.3',
    '@media not all and (min-resolution:.001dpcm)': {
      lineHeight: '1',
    },
  },
  listIcon: {
    float: 'left',
    paddingTop: '-5px',
    height: '20px',
    marginTop: '-35px',
  },
  label: {
    paddingLeft: '15px',
    display: 'block',
    fontSize: '14px',
    fontWeight: 300,
    '@media not all and (min-resolution:.001dpcm)': {
      marginBottom: '0px',
    },
  },
  highLightText: {
    color: 'var(--g3-color__highlight-orange)',
    fontWeight: '600',
  },
});

export default withStyles(styles)(ListComponent);
