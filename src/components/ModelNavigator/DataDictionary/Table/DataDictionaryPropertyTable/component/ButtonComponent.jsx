import React from "react";
import { Button, createTheme, ThemeProvider, StyledEngineProvider, adaptV4Theme } from "@mui/material";
import { FontRegistry } from '../../../../../../assets/fonts/util';

const theme = {
  components: {
    MuiButton: {
      styleOverrides: {      
        root: {
          fontSize: "13px",
          textTransform: "none",
          color: "#1D79A8",
          fontFamily: FontRegistry("Nunito Sans"),
          float: "right",
          background: "none",
          marginTop: "-20px",
          marginRight: "20px",
          fontStyle: "italic",
          "&:hover": {
            backgroundColor: "transparent",
            cursor: "pointer",
          },
        },
      },
    },
  },
};

const ButtonComponent = ({ label, openHandler, disableTouchRipple }) => (
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={createTheme(adaptV4Theme(theme))}>
      <Button onClick={openHandler} disableTouchRipple={disableTouchRipple}>
        {label}
      </Button>
    </ThemeProvider>
  </StyledEngineProvider>
);

ButtonComponent.defaultProps = {
  disableTouchRipple: true,
};

export default ButtonComponent;
