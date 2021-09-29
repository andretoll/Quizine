import VisibilitySensor from 'react-visibility-sensor';
import Image from '../../assets/quizine.png';
import {
    makeStyles,
    Container,
    Fade,
    Typography,
    Badge
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
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Fade in={isVisible} timeout={2000}>
                            <div>
                                <div>
                                    <Badge badgeContent="Alpha" color="primary" anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                                        <Typography variant="h2" color="primary" gutterBottom>Quizine</Typography>
                                    </Badge>
                                </div>
                                <Typography variant="h5" gutterBottom>A modern and sophisticated quiz game.</Typography>
                                <div style={{ maxWidth: '500px' }}>
                                    <img src={Image} alt="screenshot" style={{ margin: '20px 0', maxWidth: '100%', maxHeight: '100%' }} />
                                </div>
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