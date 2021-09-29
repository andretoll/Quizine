import { Link } from 'react-router-dom';
import EmailIcon from '@material-ui/icons/EmailOutlined';
import {
    makeStyles,
    Container,
    Typography,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({

    primary: {
        background: theme.palette.secondary.main,
        padding: '70px 0',
    },

    secondary: {
        background: theme.palette.secondary.dark,
        padding: '15px',
        textAlign: 'center',
    },

    header: {
        display: 'block',
        marginBottom: '5px',
        fontSize: '1.2rem',
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
                                Open in web
                            </Link>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography className={classes.header} variant="overline">Contact</Typography>
                            <List disablePadding>
                                <ListItem style={{padding: '0'}}>
                                    <ListItemIcon>
                                        <EmailIcon />
                                    </ListItemIcon>
                                    <ListItemText primaryTypographyProps={{variant: "body2"}} primary="andretoll@outlook.com" />
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