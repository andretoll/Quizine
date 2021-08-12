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
        minHeight: '100vh',
        paddingTop: '100px',
        textAlign: 'center',
        background: `linear-gradient(90deg, ${theme.palette.primaryBackground.dark} 0%, ${theme.palette.primaryBackground.main} 50%, ${theme.palette.secondaryBackground.main} 50%, ${theme.palette.secondaryBackground.dark} 100%)`,

        '& button': {
            fontSize: '1.5em'
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
                                    <Button variant="contained" color="primary" size="large">
                                        Create
                                    </Button>
                                </Link>
                            </Grid>
                        </Slide>
                        <Slide in timeout={2000} direction="left">
                            <Grid item xs={12} sm={6}>
                                <Link to="/join">
                                    <Button variant="contained" color="primary" size="large">
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