import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useForm, Controller } from 'react-hook-form';
import { useTitle } from '../hooks/useTitle';
import { useSnackbar } from '../contexts/SnackbarContext';
import { Join } from '../services/QuizService';
import GoHome from '../components/GoHome';
import {
    makeStyles,
    TextField,
    Button,
    Container,
    Fade,
    Paper,
    FormControl,
    Typography,
    CircularProgress,
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({

    container: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },

    wrapper: {
        maxWidth: '600px',
    },

    content: {
        background: theme.palette.secondary.main,
        padding: '20px',
    },

    form: {
        alignContent: 'center',

        '& p': {
            color: theme.palette.error.main,
            margin: '5px',
        },
    },

    formControl: {
        margin: '15px 0',
    }
}))

function JoinPage() {

    const classes = useStyles();
    const history = useHistory();
    const location = useLocation();
    const { notifyError } = useSnackbar();

    // Show error message if state contains one
    const [errorMessage, setErrorMessage] = useState(location.state?.errorMessage);

    const [inProgress, setInProgress] = useState(false);

    const hash = history.location.hash.replace('#', '');

    const { register, handleSubmit, control, formState: { errors, isValid } } = useForm({
        mode: 'onChange', defaultValues: {
            "sessionId": hash,
            "username": '',
        }
    });

    useTitle("Join");

    useEffect(() => {
        register("sessionId", { required: true });
        register("username", { required: true, maxLength: 15, validate: isOnlyWhitespace });
    }, [register]);

    useEffect(() => {

        if (errorMessage)
            notifyError(errorMessage);

        setErrorMessage(null);
        window.history.replaceState({}, document.title)
    }, [notifyError, errorMessage]);

    function isOnlyWhitespace(value) {
        return !!value.trim();
    }

    // Handle form submission
    async function onHandleSubmit(data) {

        setInProgress(true);
        console.info("Joining quiz...");

        setErrorMessage(null);

        await Join(data).then(response => {
            if (response.status === 200) {
                console.info("Successfully joined quiz.");
                history.push(`/quiz/${data.sessionId}`, { sessionId: data.sessionId, username: data.username, url: location.pathname + location.hash });
            } else {
                response.text().then(result => {
                    setErrorMessage(result);
                });
            }
        }).catch(error => {
            console.error(error);
            setErrorMessage("Failed to connect to the server.");
        }).finally(_ => {
            setInProgress(false);
        });
    }

    return (
        <div className={classes.container}>
            <Container maxWidth="sm">
                <Fade in timeout={1500}>
                    <Paper elevation={10} className={classes.content}>
                        <div style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
                            <GoHome style={{ position: 'absolute' }} />
                            <Typography variant="h3" style={{ textAlign: 'center', flex: '1' }}>Join quiz</Typography>
                        </div>
                        <form onSubmit={handleSubmit(onHandleSubmit)} className={classes.form}>

                            <FormControl margin="dense" fullWidth>
                                <Controller
                                    control={control}
                                    name="sessionId"
                                    render={({ field: { onChange, value } }) => (
                                        <TextField autoComplete="off" label="Session ID" autoFocus disabled={hash?.length > 0} onChange={onChange} value={value} />
                                    )} />
                                {errors.sessionId && errors.sessionId.type === "required" && <p>Session ID is required.</p>}
                            </FormControl>

                            <FormControl margin="dense" fullWidth>
                                <Controller
                                    control={control}
                                    name="username"
                                    render={({ field: { onChange, value } }) => (
                                        <TextField autoComplete="off" label="Username" autoFocus={hash.length > 0} onChange={onChange} value={value} />
                                    )} />
                                {errors.username && errors.username.type === "required" && <p>Session ID is required.</p>}
                                {errors.username && errors.username.type === "maxLength" && <p>Username must consist of less than 15 characters.</p>}
                                {errors.username && errors.username.type === "validate" && <p>Invalid username.</p>}
                            </FormControl>

                            <div style={{ textAlign: 'center', marginTop: '30px ' }}>
                                {inProgress ?
                                    <CircularProgress />
                                    :
                                    <Button variant="contained" color="primary" type="submit" size="large" disabled={!isValid}>
                                        Join
                                    </Button>
                                }
                            </div>

                        </form>
                    </Paper>
                </Fade>

            </Container>
        </div>
    )
}

export default JoinPage;