import VisibilitySensor from 'react-visibility-sensor';
import SpeedIcon from '@material-ui/icons/Speed';
import TrophyIcon from '@material-ui/icons/EmojiEventsOutlined';
import FunIcon from '@material-ui/icons/WhatshotOutlined';
import {
    Container,
    Grid,
    Grow,
    makeStyles,
    Typography,
} from '@material-ui/core';

const useStyles = makeStyles(() => ({

    container: {
    },

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
                    <div style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {isVisible ?
                            <Grow in timeout={2000}>
                                <Grid container spacing={4}>
                                    <Grid item xs={12} sm={4}>
                                        <div className={classes.feature}>
                                            <SpeedIcon />
                                            <Typography variant="h4" color="primary">Fast</Typography>
                                            <Typography variant="subtitle1">Ultra-fast realtime updates wherever you are.</Typography>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <div className={classes.feature}>
                                            <TrophyIcon />
                                            <Typography variant="h4" color="primary">Competative</Typography>
                                            <Typography variant="subtitle1">Compete with your friends (or foes!).</Typography>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <div className={classes.feature}>
                                            <FunIcon />
                                            <Typography variant="h4" color="primary">Fun</Typography>
                                            <Typography variant="subtitle1">Enjoy a modern take on the classic quiz with up to 7 other players.</Typography>
                                        </div>
                                    </Grid>
                                </Grid>
                            </Grow>
                            :
                            null
                        }
                    </div>
                )}
            </VisibilitySensor>
        </Container>
    )
}

export default Features;