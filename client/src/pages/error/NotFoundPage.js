import React from 'react';
import { Link } from 'react-router-dom';
import HomeIcon from '@material-ui/icons/Home';
import { Button, makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({

    container: {
        display: 'flex',
        textAlign: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: theme.palette.secondary.main,

        "& button": {
            marginTop: '20px',
        },
    },
}));

function NotFoundPage() {

    const classes = useStyles();

    return (
        <div className={classes.container}>
            <div style={{ margin: 'auto' }}>
                <Typography variant="h2" color="primary" gutterBottom>
                    Page not found (404)
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Sorry, the page you're looking for does not exist. Make sure you've typed in the correct URL.
                </Typography>
                <Link to="/">
                    <Button variant="contained" color="primary" startIcon={<HomeIcon />}>
                        Take me home!
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default NotFoundPage;