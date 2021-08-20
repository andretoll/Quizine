import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useForm } from 'react-hook-form';
import { makeStyles } from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import GoHome from '../components/GoHome';

const useStyles = makeStyles(theme => ({

    container: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: theme.palette.secondaryBackground.main,
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

    const [sessionId, setSessionId] = useState(null);

    const { register, handleSubmit, formState: { errors } } = useForm({ mode: 'onChange' });

    const hash = history.location.hash.replace('#', '');

    useEffect(() => {

        // If user was directed with a link, store sessionID
        if (hash) {
            setSessionId(hash);
        }

    }, [hash,]);

    // Handle form submission
    function onHandleSubmit(data) {

        // Get sessionID from URL or form
        const validSessionId = sessionId ? sessionId : data.sessionId;

        history.push(`/quiz/${validSessionId}`, { sessionId: validSessionId, username: data.username });
    }

    return (
        <div className={classes.container}>
            <Container className={classes.wrapper}>
                <Fade in timeout={1500}>
                    <Paper elevation={10} className={classes.content}>
                        <GoHome />
                        <Typography variant="h3" style={{ textAlign: 'center' }}>Join quiz</Typography>
                        <form onSubmit={handleSubmit(onHandleSubmit)} className={classes.form}>
                            {!sessionId &&
                                <FormControl margin="dense" fullWidth>
                                    <TextField label="Session ID" {...register("sessionId", { required: true })} />
                                    {errors.sessionId && <p>Session ID is required.</p>}
                                </FormControl>
                            }

                            <FormControl margin="dense" fullWidth>
                                <TextField label="Username" {...register("username", { required: true })} />
                                {errors.username && <p>Username is required.</p>}
                            </FormControl>
                            <div style={{ textAlign: 'center', marginTop: '30px ' }}>
                                <Button variant="contained" color="primary" type="submit" size="large">
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