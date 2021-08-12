import React from 'react'
import { Link } from 'react-router-dom';
import { Button, makeStyles, Typography } from '@material-ui/core'
import HomeIcon from '@material-ui/icons/Home'

const useStyles = makeStyles(theme => ({

    container: {
        display: 'flex',
        textAlign: 'center',
        alignItems: 'center',
        minHeight: '100vh',

        "& button": {
            marginTop: '20px',
            background: theme.palette.primary.main,
            color: '#fff',
        },
    },
    header: {
        color: theme.palette.primary.main,
        textTransform: 'uppercase',
    },
}))

function NotFoundPage() {

    const classes = useStyles();

    return (
        <div className={classes.container}>
            <div style={{ margin: 'auto' }}>
                <Typography variant="h2" gutterBottom className={classes.header}>
                    Page not found (404)
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
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

export default NotFoundPage