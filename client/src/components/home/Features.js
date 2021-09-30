import VisibilitySensor from 'react-visibility-sensor';
import SpeedIcon from '@material-ui/icons/Speed';
import GroupIcon from '@material-ui/icons/Group';
import GameIcon from '@material-ui/icons/VideogameAsset';
import {
    Container,
    Grid,
    Grow,
    makeStyles,
    Typography,
} from '@material-ui/core';

const useStyles = makeStyles(() => ({

    feature: {
        textAlign: 'center',

        '& svg': {
            fontSize: '6em',
        },
    },
}));

function Features() {

    const classes = useStyles();

    return (
        <Container maxWidth="md" className={classes.container}>
            <VisibilitySensor partialVisibility>
                {({ isVisible }) => (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Grow in={isVisible} timeout={2000}>
                            <Grid container spacing={4}>
                                <Grid item xs={12} sm={4}>
                                    <div className={classes.feature}>
                                        <SpeedIcon />
                                        <Typography variant="h4" color="primary">Fast</Typography>
                                        <Typography variant="subtitle1">Ultra-fast real-time updates brings you a seamless experience.</Typography>
                                    </div>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <div className={classes.feature}>
                                        <GroupIcon />
                                        <Typography variant="h4" color="primary">Multiplayer</Typography>
                                        <Typography variant="subtitle1">Built-in support for up to 8 players. Invite your friends (or foes!).</Typography>
                                    </div>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <div className={classes.feature}>
                                        <GameIcon />
                                        <Typography variant="h4" color="primary">Game Modes</Typography>
                                        <Typography variant="subtitle1">Several fun and challenging game modes. Which one will you pick?</Typography>
                                    </div>
                                </Grid>
                            </Grid>
                        </Grow>
                    </div>
                )}
            </VisibilitySensor>
        </Container>
    )
}

export default Features;