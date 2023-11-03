import React from 'react';
import { MuiThemeProvider, ThemeProvider, createMuiTheme, createTheme } from '@material-ui/core/styles';
import themes, { overrides, typography } from './themes';

const lightTheme = createMuiTheme({ ...themes.light, ...overrides, ...typography });
const darkTheme = createMuiTheme({ ...themes.dark, ...overrides, ...typography });

const defaultContextData = {
  dark: false,
  toggleTheme: () => {},
};

const ThemeContext = React.createContext(defaultContextData);
const useTheme = () => React.useContext(ThemeContext);

const useEffectDarkMode = () => {
  const [themeState, setThemeState] = React.useState({
    dark: false,
    hasThemeMounted: false,
  });
  React.useEffect(() => {
    const lsDark = localStorage.getItem('dark') === 'true';
    setThemeState({ ...themeState, dark: lsDark, hasThemeMounted: true });
  }, []);

  return [themeState, setThemeState];
};

const CustomThemeProvider = ({ children }) => {
  const [themeState, setThemeState] = useEffectDarkMode();

  const toggleTheme = () => {
    const dark = !themeState.dark;
    localStorage.setItem('dark', JSON.stringify(dark));
    setThemeState({ ...themeState, dark });
  };

  const computedTheme = themeState.dark ? darkTheme : lightTheme;

  const legnedTheme = {
    '& div.value_categoryLegendIcon': {
      width: '35px',
      height: '25px',
      backgroundRepeat: 'no-repeat',
      backgroundImage: `url('https://raw.githubusercontent.com/CBIIT/datacommons-assets/data_model_pdf_icons/icdc/DMN/legend/administrative.svg')`,
      '& img': {
        display: 'none',
      },
    },
  }

  const nodeTheme = {
    '& button.Program_nodeTitleBtn': {
      color: 'red',
    },
    '& button.Project_nodeTitleBtn': {
      color: 'blue',
    },
    
    '& span.Node_iconWrapper': {
      width: '45px',
      height: '38px',
      backgroundSize: '45px 38px',
      backgroundRepeat: 'no-repeat',
      backgroundImage: `url('static/media/src/components/ModelNavigator/DataDictionary/ReactFlowGraph/Canvas/assets/graph_icon/administrative.svg')`,
      '& img': {
        display: 'none',
      },
    },
    '& div.customNodeExpand': {
      color: 'orange',
    },
    '& div.Program_iconWrapper': {
      height: '55px',
      width: '35px',
      borderRadius: '75px',
      backgroundSize: '35px 35px',
      backgroundRepeat: 'no-repeat',
      backgroundImage: `url('static/media/src/components/ModelNavigator/DataDictionary/ReactFlowGraph/Canvas/assets/graph_icon/clinical.svg')`,
      '& img': {
        display: 'none',
      },
    },
    '& span.Program_listItemLabel': {
      color: 'yellow',
    },
  }
  
  const theme = {
    overrides: {
      MuiContainer: {
        maxWidthLg: {
          ...nodeTheme,
          ...legnedTheme,
        },
      },
    },
  };

  return (
    <ThemeProvider theme={createTheme(theme)}>
      <ThemeContext.Provider
        value={{
          dark: themeState.dark,
          toggleTheme,
        }}
      >
        {children}
      </ThemeContext.Provider>
    </ThemeProvider>
  );
};

export { CustomThemeProvider, useTheme };
