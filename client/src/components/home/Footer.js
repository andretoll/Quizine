import { Link } from 'react-router-dom';
import EmailIcon from '@material-ui/icons/EmailOutlined';
import {
    makeStyles,
    Container,
    Typography,
    Grid,
    Button,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({

    container: {
    },

    primary: {
        background: theme.palette.secondary.main,
        padding: '30px',
    },

    secondary: {
        background: theme.palette.secondary.dark,
        padding: '5px',
        textAlign: 'center',
    },

    header: {
        display: 'block',
        borderLeft: `5px solid ${theme.palette.primary.main}`,
        paddingLeft: '10px',
    },
}));

function Footer() {

    const classes = useStyles();

    return (
        <div className={classes.container}>
            <div className={classes.primary}>
                <Container>
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={6}>
                            <Typography className={classes.header} variant="overline" gutterBottom>Play the game</Typography>
                            <Link to="/start">
                                <Button variant="outlined">Open in web</Button>
                            </Link>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography className={classes.header} variant="overline">Contact</Typography>
                            <List disablePadding>
                                <ListItem>
                                    <ListItemIcon>
                                        <EmailIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="andretoll@outlook.com" />
                                </ListItem>
                            </List>
                        </Grid>
                    </Grid>
                </Container>
            </div>
            <div className={classes.secondary}>
                <Typography variant="body2">© 2021 | Quizine | All Rights Reserved</Typography>
            </div>
        </div>
    )
}

export default Footer;