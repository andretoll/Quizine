import React from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import { MuiThemeProvider, createTheme, withStyles, responsiveFontSizes, CssBaseline } from '@material-ui/core';
import { ConfirmProvider } from 'material-ui-confirm';
import { ErrorModalProvider } from './contexts/ErrorModalContext';
import { ConnectionProvider } from './contexts/HubConnectionContext';
import { SnackbarProvider } from './contexts/SnackbarContext';
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
      color: theme.palette.primary.main,
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

    '.MuiSlider-thumb': {
      transform: 'scale(1.7)',
      borderRadius: '20%',
    },

    'ul, ol': {
      margin: '0',
      padding: '0',
      listStyle: 'none',
    },

    'hr': {
      opacity: '0.5',
    },

    '.primary-color': {
      color: theme.palette.primary.main
    },

    '.secondary-background': {
      background: theme.palette.secondary.main
    },

    '.loadingAnimation': {

      '&:after': {
        overflow: 'hidden',
        display: 'inline-block',
        verticalAlign: 'bottom',
        '-webkit-animation': '$ellipsis steps(14, end) 900ms infinite',
        '-moz-animation': '$ellipsis steps(14, end) 900ms infinite',
        '-o-animation': '$ellipsis steps(14, end) 900ms infinite',
        animation: '$ellipsis steps(14, end) 900ms infinite',
        content: '"\\2026"',
        width: '0px'
      }
    },

    "@keyframes ellipsis": {
      "to": {
        width: '1.25em',
      }
    },
    "@-webkit-keyframes ellipsis": {
      "to": {
        width: '1.25e',
      }
    }
  },
}))(() => null);

function App() {

  const theme = responsiveFontSizes(createTheme({
    palette: {
      type: 'dark',
      primary: {
        main: '#daa520',
      },
      secondary: {
        main: '#1F2833',
      },
      background: {
        main: 'linear-gradient(115deg, #000 -15%, #fe6b6b 50%, #2196F3 50%, #000 115%)'
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
    },
    typography: {
      overline: {
        fontSize: '1rem',
      },
    },
    overrides: {
      MuiTooltip: {
        tooltip: {
          fontSize: "1em",
        },
      },
    },
  }))

  return (
    <MuiThemeProvider theme={theme}>
      <GlobalCss />
      <CssBaseline />
      <ConfirmProvider>
        <SnackbarProvider>
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
                <ConnectionProvider>
                  <ErrorModalProvider>
                    <QuizPage />
                  </ErrorModalProvider>
                </ConnectionProvider>
              </Route>
              <Route path="*" component={NotFoundPage} />
            </Switch>
          </Router>
        </SnackbarProvider>
      </ConfirmProvider>
    </MuiThemeProvider>
  );
}

export default App;
