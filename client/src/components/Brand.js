import { ReactComponent as Logo } from '../assets/logo/logo.svg';
import {
    makeStyles,
    Paper,
    Typography
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({

    innerContainer: {
        background: theme.palette.secondary.main,
        borderRadius: '5%',
        padding: '30px'
    },

    icon: {
        borderBottom: '4px solid',
        padding: '10px',
    },

    text: {
        letterSpacing: '2px',
        textTransform: 'uppercase',
        marginTop: '10px',
    }
}))

function Brand(props) {

    const classes = useStyles();

    return (
        <Paper className={classes.innerContainer} variant="elevation" elevation={12}>
            <div className={classes.icon}>
                <Logo fill="#fff" height={props.size} />
            </div>
            <Typography className={classes.text} variant="h4">
                Quizine
            </Typography>
        </Paper>
    )
}

export default Brand;