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
            "value": 4,
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
            "onclick": {
                "enable": true,
                "mode": "remove"
            }
        },
        "modes": {
            "remove": {
                "particles_nb": 10
            }
        }
    }
}

function HomePage() {

    const classes = useStyles();
    
    useTitle("Home");

    return (
        <div>
            <div className={classes.root}>
                <div style={{ height: '100vh', width: '100vw', position: 'absolute' }}>
                    <Particles
                        height="100vh"
                        params={particleParams}
                    />
                </div>
                <Container className={classes.container}>
                    <div>
                        <Grid container item xs={12}>
                            <Slide in timeout={2000}>
                                <div style={{ margin: 'auto', zIndex: 1 }}>
                                    <Brand size={150} />
                                </div>
                            </Slide>
                        </Grid>
                    </div>
                    <div>
                        <Grid container spacing={4}>
                            <Slide in timeout={2000} direction="right">
                                <Grid item xs={12} sm={6}>
                                    <Link to="/create">
                                        <Button variant="contained" color="secondary">
                                            Create
                                        </Button>
                                    </Link>
                                </Grid>
                            </Slide>
                            <Slide in timeout={2000} direction="left">
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

export default HomePage;