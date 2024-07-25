import React from 'react';
import { ThemeProvider, StyledEngineProvider, createTheme, adaptV4Theme } from '@mui/material/styles';

export default function SearchThemeConfig({
    children,
}) {
  const theme = {
    components: {
        
    }
  };
  const computedTheme = createTheme(adaptV4Theme({}));
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={computedTheme}>
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

