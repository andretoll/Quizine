import React from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import { MuiThemeProvider, createTheme, withStyles, responsiveFontSizes, CssBaseline } from '@material-ui/core';
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

    '::-webkit-scrollbar': {
      width: '10px',
    },
    '::-webkit-scrollbar-track': {
      background: theme.palette.secondary.main,
    },
    '::-webkit-scrollbar-thumb': {
      background: theme.palette.gradient.main,
      borderRadius: '1em',
    },

    a: {
      color: theme.palette.text.primary,
      textDecoration: 'none'
    },

    'ul, ol': {
      margin: '0',
    },

    '.primary-color': {
      color: theme.palette.primary.light
    },
  },
}))(() => null);

function App() {

  const theme = responsiveFontSizes(createTheme({
    palette: {
      type: 'light',
      primary: {
        main: '#6f5656',
      },
      secondary: {
        main: '#1F2833',
      },
      primaryBackground: {
        main: '#FE6B8B',
        dark: '#d85671'
      },
      secondaryBackground: {
        main: '#2196F3',
        dark: '#007ee4',
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
