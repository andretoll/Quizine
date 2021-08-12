import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Logo from '../assets/logo/logo_white.png';

const useStyles = makeStyles(theme => ({

    outerContainer: {
        border: `5px solid ${theme.palette.primary.main}`,
        borderRadius: '7%',
        padding: '4px'
    },

    innerContainer: {
        background: theme.palette.primary.main,
        borderRadius: '5%',
        padding: '5px'
    },

    text: {
        fontWeight: 'bold', letterSpacing: '2px', color: '#fff', textTransform: 'uppercase'
    }
}))

function Brand(props) {

    const classes = useStyles();

    return (
        <div className={classes.outerContainer}>
            <div className={classes.innerContainer}>
                <img height={props.size} src={Logo} alt="quizine logo" />
                <Typography className={classes.text} variant="h2">
                    Quizine
                </Typography>
            </div>
        </div>
    )
}

export default Brand;