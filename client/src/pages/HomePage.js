import Metrics from '../components/home/Metrics';
import useTitle from '../hooks/useTitle';
import Navbar from '../components/home/Navbar';
import Hero from '../components/home/Hero';
import Introduction from '../components/home/Introduction';
import Features from '../components/home/Features';
import Faq from '../components/home/Faq';
import ScrollToTopIcon from '@material-ui/icons/ArrowUpward';
import {
    makeStyles,
    useScrollTrigger,
    Fab,
    Zoom,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({

    root: {
        minHeight: '100vh',
    },

    section: {
        padding: '100px 0',
        position: 'relative',
    },

    oddSection: {
        background: theme.palette.gradient.main,
        color: '#fff',
    },

    evenSection: {
        background: theme.palette.secondary.dark,
        color: '#fff',
        boxShadow: '0 0 4px 4px rgba(0 0 0 / 50%)',
    },
}));

function HomePage() {

    useTitle("Home");

    const classes = useStyles();

    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 100,
    });

    function scrollToTop() {
        window.scrollTo({
            behavior: 'smooth',
            top: 0
        })
    };

    return (
        <div className={classes.root}>
            <Navbar>Home!</Navbar>
            <Hero />
            <section className={`${classes.section} ${classes.evenSection}`}>
                <Introduction />
            </section>
            <section className={`${classes.section} ${classes.oddSection}`}>
                <Features />
            </section>
            <section className={`${classes.section} ${classes.evenSection}`}>
                <Metrics />
            </section>
            <section className={`${classes.section} ${classes.oddSection}`}>
                <Faq />
            </section>
            <div style={{ position: 'fixed', right: '0', bottom: '0', margin: '20px' }}>
                <Zoom in={trigger}>
                    <Fab onClick={scrollToTop} color="primary">
                        <ScrollToTopIcon />
                    </Fab>
                </Zoom>
            </div>
        </div>
    )
}

export default HomePage;