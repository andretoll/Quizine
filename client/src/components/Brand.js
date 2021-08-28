import { makeStyles } from '@material-ui/core';
import { Typography} from '@material-ui/core';
import Logo from '../assets/logo/logo_white.png';

const useStyles = makeStyles(theme => ({

    outerContainer: {
        border: `5px solid ${theme.palette.secondary.main}`,
        borderRadius: '7%',
        padding: '5px'
    },

    innerContainer: {
        background: theme.palette.secondary.main,
        borderRadius: '5%',
        padding: '15px'
    },

    text: {
        fontWeight: 'bold', 
        letterSpacing: '2px', 
        textTransform: 'uppercase',
        color: theme.palette.primary.main,
    }
}))

function Brand(props) {

    const classes = useStyles();

    return (
        <div className={classes.outerContainer}>
            <div className={classes.innerContainer}>
                <img height={props.size} src={Logo} alt="quizine logo" />
                <Typography className={classes.text} variant="h3">
                    Quizine
                </Typography>
            </div>
        </div>
    )
}

export default Brand;