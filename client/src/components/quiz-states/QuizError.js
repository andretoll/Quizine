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

    const errorMessage = props.errorMessage;

    const classes = useStyles();

    function refresh() {
        window.location.reload();
    }

    return (
        <Paper className={classes.container}>
            <div>
                <ErrorIcon color="error" />
            </div>
            <Typography variant="overline" gutterBottom>{errorMessage}</Typography>
            <Button variant="outlined" color="primary" size="large" onClick={refresh}>Reload session</Button>
        </Paper>
    )
}

export default QuizError;