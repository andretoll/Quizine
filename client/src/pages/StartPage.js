import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTitle } from '../hooks/useTitle';
import Brand from '../components/Brand';
import {
    makeStyles,
    Slide,
    Grid,
    Container,
    Button
} from '@material-ui/core';
import Particles from 'react-particles-js';

const useStyles = makeStyles(theme => ({

    root: {
        textAlign: 'center',
        overflow: 'hidden',

        '& button': {
            width: '200px',
            fontSize: '2em',
            padding: '0.5em 0.7em',
            transition: 'all .5s',
            letterSpacing: '5px',

            '&:hover': {
                transform: 'translateY(-5px)',
                color: theme.palette.primary.main,
                boxShadow: theme.shadows[8]
            },
        }
    },

    container: {
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
    },

    fade: {
        maxHeight: '100vh',
        '-webkit-animation': '$fade 3s ease-in-out',
        '-moz-animation': '$fade 3s ease-in-out',
        '-o-animation': '$fade 3s ease-in-out',
        animation: '$fade 3s ease-in-out',
    },

    "@keyframes fade": {
        '0%': {
            opacity: '0',
        },
        '100%': {
            opacity: '1',
        },
    },

    "@-webkit-keyframes fade": {
        '0%': {
            opacity: '0',
        },
        '100%': {
            opacity: '1',
        },
    }
}))

const particleParams = {
    "particles": {
        "number": {
            "value": 100,
            "density": {
                "enable": false
            }
        },
        "size": {
            "value": 2,
            "random": true
        },
        "move": {
            "direction": "bottom",
            "out_mode": "out"
        },
        "line_linked": {
            "enable": false
        }
    },
    "interactivity": {
        "events": {
            "onhover": {
                "enable": true,
                "mode": "repulse",
            },
        },
    }
}

function StartPage() {

    const delay = 2000;
    const classes = useStyles();

    const [ready, setReady] = useState(false);

    useTitle("Start");

    useEffect(() => {

        setTimeout(() => {
            setReady(true);
        }, delay);
    }, []);

    return (
        <div>
            <div className={classes.root}>
                <div style={{ position: 'absolute' }}>
                    {ready &&
                        <Particles
                            className={classes.fade}
                            height="100vh"
                            params={particleParams}
                        />
                    }
                </div>
                <Container className={classes.container}>
                    <div>
                        <Grid container item xs={12}>
                            <Slide in timeout={delay}>
                                <div style={{ margin: 'auto', zIndex: 1 }}>
                                    <Link to="/">
                                        <Brand size={150} />
                                    </Link>
                                </div>
                            </Slide>
                        </Grid>
                    </div>
                    <div>
                        <Grid container spacing={4}>
                            <Slide in timeout={delay} direction="right">
                                <Grid item xs={12} sm={6}>
                                    <Link to="/create">
                                        <Button variant="contained" color="secondary">
                                            Create
                                        </Button>
                                    </Link>
                                </Grid>
                            </Slide>
                            <Slide in timeout={delay} direction="left">
                                <Grid item xs={12} sm={6}>
                                    <Link to="/join">
                                        <Button variant="contained" color="secondary">
                                            Join
                                        </Button>
                                    </Link>
                                </Grid>
                            </Slide>
                        </Grid>
                    </div>
                </Container>
            </div>
        </div>
    )
}

export default StartPage;