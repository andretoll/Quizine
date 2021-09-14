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
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import "@fontsource/oleo-script";

// Global styles
const GlobalCss = withStyles(theme => ({

  '@global': {

    body: {
      "-webkit-font-smoothing": 'antialiased',
      "-moz-osx-font-smoothing": 'grayscale',
      margin: '0',
      background: theme.palette.gradient.main,
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

    '.MuiSelect-select': {
      whiteSpace: 'normal',
    },

    '.MuiTooltip-tooltip': {
      background: theme.palette.secondary.light,
      fontSize: '1.1em'
    },

    '.MuiTooltip-arrow': {
      color: theme.palette.secondary.light,
    },

    '.MuiPopover-paper': {
      background: theme.palette.secondary.dark,
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
    
    '.secondary-background-light': {
      background: theme.palette.secondary.light
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
        main: '#081229',
      },
      gradient: {
        main: 'linear-gradient(135deg, #750051 , #005192)',
      },
      error: {
        main: '#cd5c5c',
      },
    },
    typography: {
      h1: {
        fontWeight: 700,
      },
      h2: {
        fontFamily: 'Oleo Script, Roboto',
        fontWeight: 400,
      },
      h3: {
        fontFamily: 'Oleo Script, Roboto',
        fontWeight: 100,
      },
      overline: {
        fontSize: '1rem',
      },
    },
    overrides: {
      MuiTableRow: {
        root: {
          '&:last-child td': {
            borderBottom: 0,
          },
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
