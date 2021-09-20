import { Link } from 'react-router-dom';
import Particles from 'react-particles-js';
import PlayIcon from '@material-ui/icons/PlayArrow';
import {
    makeStyles,
    Typography,
    IconButton,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({

    container: {
        position: 'relative',
        background: theme.palette.gradient.main,
        overflow: 'hidden',
        height: '90vh',
        display: 'flex',
        alignItems: 'center',
    },

    particlesContainer: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        overflow: 'hidden',

        '& #tsparticles': {
            height: '100%',
        },
    },

    content: {
        margin: '200px auto',
        textAlign: 'center',
    },

    buttonsContainer: {
        margin: '50px 0',
    },

    startButton: {
        border: '3px solid',
        transition: 'all 0.5s',

        '& svg': {
            fontSize: '2em',
        },

        '&:hover': {
            borderColor: theme.palette.primary.main,
            color: theme.palette.primary.main,
            background: 'transparent',
        },
    },
}));

const particleParams = {
    "particles": {
        "number": {
            "value": 100,
            "density": {
                "enable": false
            }
        },
        "size": {
            "value": 1,
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

function Hero() {

    const classes = useStyles();

    return (
        <div className={classes.container}>
            <div className={classes.particlesContainer}>
                <Particles
                    width="100vw"
                    params={particleParams}
                />
            </div>
            <div className={classes.content}>

                <Typography variant="h4" style={{ fontWeight: 100, textTransform: 'uppercase' }}>A modern approach to the classic quiz game</Typography>
                <div className={classes.buttonsContainer}>
                    <Link to="/start">
                        <IconButton className={classes.startButton}>
                            <PlayIcon />
                        </IconButton>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Hero;