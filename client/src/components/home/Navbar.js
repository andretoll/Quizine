import { useEffect, useState } from 'react';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import { ReactComponent as Logo } from '../../assets/logo/logo.svg';
import {
    makeStyles,
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText
} from '@material-ui/core';
import { Fragment } from 'react';

const useStyles = makeStyles((theme) => ({

    appbar: {
        background: 'transparent',
        padding: '10px 0',
        transition: 'all 0.5s ease-out',

        '& .title': {
            display: 'flex',
            alignItems: 'center',
            fill: '#fff',
            color: '#fff',
            pointerEvents: 'none',

            [theme.breakpoints.down('xs')]: {
                margin: 'auto',
            },

            '& svg': {
                transition: 'transform 0.5s',
                transformOrigin: 'left',
                height: '40px',
                fill: 'inherit',
            },

            '& h2': {
                fontSize: '3rem',
                marginLeft: '10px',
                transition: 'transform 0.5s ease-out',
                transformOrigin: 'left',
                color: 'inherit',
            },
        },

        '& .navLinks': {
            display: 'flex',
            marginLeft: 'auto',

            [theme.breakpoints.down('xs')]: {
                display: 'none',
            },
        },

        '&.solid': {
            background: theme.palette.secondary.main,

            '& .title': {
                '& svg': {
                    transform: 'scale(0.8)',
                },

                '& h2': {
                    transform: 'scale(0.8)',
                },
            },
        },
    },

    menuButton: {
        display: 'none',

        [theme.breakpoints.down('xs')]: {
            position: 'absolute',
            display: 'block',
        },
    },

    drawer: {
        background: theme.palette.secondary.main,
        padding: '10px 0',
    },
}));

function Navbar() {

    const classes = useStyles();

    const [navbarSolid, setNavbarSolid] = useState(false);
    const [menuAnchor, setMenuAnchor] = useState(null);

    useEffect(() => {

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll)
        }

    }, []);

    function handleScroll() {
        setNavbarSolid(window.scrollY > 0);
    }

    function openMenu(event) {

        if (menuAnchor !== null)
            setMenuAnchor(null);
        else
            setMenuAnchor(event.currentTarget);
    }

    function closeMenu() {
        setMenuAnchor(null);
    }

    function getLinks() {

        return (
            <Fragment>
                <ListItem>
                            <ListItemText primary="ListItem 1" />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="ListItem 2" />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="ListItem 3" />
                        </ListItem>
            </Fragment>
        )
    }

    return (
        <AppBar elevation={navbarSolid ? 10 : 0} color="secondary" className={`${classes.appbar} ${navbarSolid ? 'solid' : ''}`}>
            <Toolbar variant="regular">
                <IconButton edge="start" className={classes.menuButton} onClick={openMenu}>
                    <MenuIcon fontSize="large" />
                </IconButton>
                <Drawer
                    anchor='top'
                    open={menuAnchor !== null}
                    onClose={closeMenu}
                    PaperProps={{ className: classes.drawer }}
                >
                    <Toolbar>
                        <IconButton edge="start" className={classes.menuButton} onClick={closeMenu}>
                            <CloseIcon fontSize="large" />
                        </IconButton>
                    </Toolbar>
                    <List>
                        {/* getLinks() */}
                    </List>
                </Drawer>
                <div className="title">
                    <Logo />
                    <Typography variant="h2" color="textPrimary">Quizine</Typography>
                </div>
                <List className="navLinks">
                    {/* getLinks() */}
                </List>
            </Toolbar>
        </AppBar>
    )
}

export default Navbar;