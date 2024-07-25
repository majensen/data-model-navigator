import React from 'react';
import { ThemeProvider, StyledEngineProvider, createTheme, adaptV4Theme } from '@mui/material/styles';

export default function HeaderThemeConfig ({
  children,
}) {
  const theme = {
    overrides: {
    },
  };

  const computedTheme = createTheme(adaptV4Theme(theme));
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={computedTheme}>
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

