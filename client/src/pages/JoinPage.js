import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useForm, Controller } from 'react-hook-form';
import { useTitle } from '../hooks/useTitle';
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
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({

    container: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: theme.palette.background.main,
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
            color: theme.palette.error.dark,
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

    // Show error message if state contains one
    const [errorMessage, setErrorMessage] = useState(location.state?.errorMessage);

    const hash = history.location.hash.replace('#', '');

    const { register, handleSubmit, control, formState: { errors, isValid } } = useForm({
        mode: 'onChange', defaultValues: {
            "sessionId": hash,
            "username": '',
        }
    });

    useTitle("Join quiz");
    useEffect(() => {
        register("sessionId", { required: true });
        register("username", { required: true, maxLength: 15, validate: isOnlyWhitespace });
    }, [register]);

    function isOnlyWhitespace(value) {
        return !!value.trim();
    }

    // Handle form submission
    function onHandleSubmit(data) {

        console.info("Joining session...");
        console.trace(data);

        setErrorMessage(null);
        history.push(`/quiz/${data.sessionId}`, { sessionId: data.sessionId, username: data.username, url: location.pathname + location.hash });
    }

    return (
        <div className={classes.container}>
            <Container maxWidth="sm">
                <Fade in timeout={1500}>
                    <Paper elevation={10} className={classes.content}>
                        <GoHome />
                        <Typography variant="h3" style={{ textAlign: 'center' }}>Join quiz</Typography>
                        <Typography variant="body1" color="error" style={{ textAlign: 'center' }}>{errorMessage}</Typography>
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
                                <Button variant="contained" color="primary" type="submit" size="large" disabled={!isValid}>
                                    Join
                                </Button>
                            </div>

                        </form>
                    </Paper>
                </Fade>

            </Container>
        </div>
    )
}

export default JoinPage;