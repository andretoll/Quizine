import VisibilitySensor from 'react-visibility-sensor';
import {
    makeStyles,
    Container,
    Fade,
    Typography
} from '@material-ui/core';

const useStyles = makeStyles(() => ({

    container: {
        textAlign: 'center',
    },

    introducing: {
        position: 'absolute',
        top: "0",
        left: '50%',
        transform: 'translateX(-50%)',
        marginTop: '20px',
    },
}));

function Introduction() {

    const classes = useStyles();

    return (
        <Container maxWidth="md" className={classes.container}>

            <VisibilitySensor partialVisibility>
                {({ isVisible }) => (
                    <div style={{ height: '150px', display: 'flex', justifyContent: 'center' }}>
                        <Fade in={isVisible} timeout={2000}>
                            <div>
                                <Typography variant="h2" color="primary" gutterBottom>Quizine</Typography>
                                <Typography variant="overline">
                                    A modern and sophisticated quiz game.
                                </Typography>
                            </div>
                        </Fade>
                        <Fade in={!isVisible} timeout={1000}>
                            <Typography className={classes.introducing} variant="h3">
                                Introducing...
                            </Typography>
                        </Fade>
                    </div>
                )}
            </VisibilitySensor>
        </Container>
    )
}

export default Introduction;