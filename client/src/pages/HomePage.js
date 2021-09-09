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

function HomePage() {

    const classes = useStyles();
    
    useTitle("Home");

    return (
        <div>
            <div className={classes.root}>
                <Container className={classes.container}>
                    <div>
                        <Grid container item xs={12}>
                            <Slide in timeout={2000}>
                                <div style={{ margin: 'auto' }}>
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