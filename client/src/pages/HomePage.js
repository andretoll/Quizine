import Metrics from '../components/home/Metrics';
import useTitle from '../hooks/useTitle';
import Navbar from '../components/home/Navbar';
import Hero from '../components/home/Hero';
import {
    makeStyles, Typography
} from '@material-ui/core';
import Features from '../components/home/Features';

const useStyles = makeStyles((theme) => ({

    root: {
        minHeight: '100vh',
    },

    section: {
        minHeight: '500px', //TODO: Remove
        display: 'flex',
        alignItems: 'center'
    },

    oddSection: {
        background: theme.palette.gradient.main,
        color: '#fff',
    },

    evenSection: {
        background: theme.palette.secondary.main,
        color: '#fff',
    },
}));

function HomePage() {

    useTitle("Home");

    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Navbar>Home!</Navbar>
            <Hero />
            <section className={`${classes.section} ${classes.evenSection}`}>
                {/* What do we put here? */}
            </section>
            <section className={`${classes.section} ${classes.oddSection}`}>
                <Features />
            </section>
            <section className={`${classes.section} ${classes.evenSection}`}>
                <Metrics />
            </section>
            <section className={`${classes.section} ${classes.oddSection}`}>
                {/* Screenshots */}
                <Typography variant="h2">Media</Typography>
            </section>
        </div>
    )
}

export default HomePage;