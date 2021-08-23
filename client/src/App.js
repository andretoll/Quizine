import React, { useEffect, useState } from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import { MuiThemeProvider, createTheme, withStyles, responsiveFontSizes, CssBaseline } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import NotFoundPage from './pages/error/NotFoundPage';
import HomePage from './pages/HomePage';
import CreatePage from './pages/CreatePage';
import JoinPage from './pages/JoinPage';
import QuizPage from './pages/QuizPage';
import "@fontsource/roboto";

// Global styles
const GlobalCss = withStyles(theme => ({

  '@global': {

    body: {
      "-webkit-font-smoothing": 'antialiased',
      "-moz-osx-font-smoothing": 'grayscale',
      margin: '0',
      background: theme.palette.background.default,
      overflow: 'hidden',
    },

    a: {
      color: theme.palette.text.primary,
      textDecoration: 'none'
    },

    '::-webkit-scrollbar': {
      width: '5px',
    },
    '::-webkit-scrollbar-track': {
      background: theme.palette.secondary.dark,
    },
    '::-webkit-scrollbar-thumb': {
      background: theme.palette.primary.main,
      borderRadius: '1em',
    },

    'ul, ol': {
      margin: '0',
      padding: '0',
      listStyle: 'none',
    },

    '.primary-color': {
      color: theme.palette.primary.main
    },

    '.secondary-background': {
      background: theme.palette.secondary.main
    },
  },
}))(() => null);

function App() {

  // Get user preference
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [darkMode, setDarkMode] = useState(prefersDarkMode);

  useEffect(() => {
    setDarkMode(prefersDarkMode);
  }, [prefersDarkMode]);

  const theme = responsiveFontSizes(createTheme({
    palette: {
      type: darkMode ? 'dark' : 'light',
      primary: {
        main: '#daa520',
      },
      secondary: {
        main: '#1F2833',
      },
      primaryBackground: {
        main: '#fe6b6b ',
      },
      secondaryBackground: {
        main: '#2196F3',
      },
      gradient: {
        main: 'linear-gradient(45deg, #6f5656 30%, #1F2833 90%)',
      },
    }
  }))

  return (
    <MuiThemeProvider theme={theme}>
      <GlobalCss />
      <CssBaseline />
      <Router>
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route exact path="/create">
            <CreatePage />
          </Route>
          <Route path="/join">
            <JoinPage />
          </Route>
          <Route path="/quiz">
            <QuizPage />
          </Route>
          <Route path="*" component={NotFoundPage} />
        </Switch>
      </Router>
    </MuiThemeProvider>
  );
}

export default App;
