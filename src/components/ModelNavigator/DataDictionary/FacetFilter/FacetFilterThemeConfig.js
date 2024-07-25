import React from 'react';
import { ThemeProvider, StyledEngineProvider, createTheme, adaptV4Theme } from '@mui/material/styles';

const theme = {
  overrides: {
    Mui: {
      '&$expanded': {
        margin: '0px 0px',
      }
    },
    MuiAccordionDetails: {
      root: {
        padding: '0px 0px 0px',
      },
    },
    MuiAccordion: {
      root: {
        '&$expanded': {
            margin: 'auto',
          },
      }
    }
  },
};

export default function FacetFilterThemeConfig ({
  children,
}) {
  const computedTheme = createTheme(adaptV4Theme(theme));
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={computedTheme}>
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
