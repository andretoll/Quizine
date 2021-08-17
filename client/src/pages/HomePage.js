import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import Slide from '@material-ui/core/Slide';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Brand from '../components/Brand';

const useStyles = makeStyles(theme => ({

    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        background: `linear-gradient(115deg, #000 -15%, ${theme.palette.primaryBackground.main} 50%, ${theme.palette.secondaryBackground.main} 50%, #000 115%)`,

        '& button': {
            width: '200px',
            fontSize: '2em',
            padding: '0.5em 0.7em',
            transition: 'transform .5s',
            letterSpacing: '5px',

            '&:hover': {
                transform: 'translateY(-5px)',
                color: theme.palette.primary.main
            },
        }
    },
}))

function HomePage() {

    const classes = useStyles();

    return (
        <div>
            <div className={classes.container}>
                <Container>
                    <Grid container item xs={12}>
                        <Slide in timeout={2000}>
                            <div style={{ margin: 'auto' }}>
                                <Brand size={200} />
                            </div>
                        </Slide>
                    </Grid>
                    <Grid container spacing={4} style={{ marginTop: '100px' }}>
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
                </Container>
            </div>
        </div>
    )
}

export default HomePage;