import React from 'react';
import { ThemeProvider, StyledEngineProvider, createTheme } from '@mui/material/styles';

export default function SearchThemeConfig({
    children,
}) {
  const theme = {
    components: {
        
    }
  };
  const computedTheme = createTheme(theme);
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={computedTheme}>
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

