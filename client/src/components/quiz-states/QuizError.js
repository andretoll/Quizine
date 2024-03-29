import { Link } from 'react-router-dom';
import ErrorIcon from '@material-ui/icons/ErrorOutline';
import {
    makeStyles,
    Paper,
    Typography,
    Button
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({

    container: {
        background: theme.palette.secondary.main,
        padding: '15px',
        textAlign: 'center',
        maxWidth: '550px',

        '& svg': {
            fontSize: '4em',
        },

        '& button': {
            display: 'block',
            margin: 'auto',
            marginTop: '20px',
        }
    },
}));

function QuizError(props) {

    const classes = useStyles();

    return (
        <Paper className={classes.container}>
            <div>
                <ErrorIcon color="error" />
            </div>
            <Typography variant="overline" gutterBottom>{props.errorMessage}</Typography>
            <Link to="/start">
                <Button variant="outlined" color="primary" size="large">Exit</Button>
            </Link>
        </Paper>
    )
}

export default QuizError;