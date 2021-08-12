import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import SuccessIcon from '@material-ui/icons/Check';
import Form from '../components/Form';

const useStyles = makeStyles(theme => ({

    container: {
        minHeight: '100vh',
        paddingTop: '100px',
        paddingBottom: '100px',
        background: theme.palette.primaryBackground.main,
    },

    wrapper: {
        maxWidth: '600px',
    },

    successIconWrapper: {
        display: 'flex',
        margin: 'auto',
        justifyContent: 'center',
        alignItems: 'center',
        border: `10px double ${theme.palette.primary.main}`,
        borderRadius: '50%',
        height: '120px',
        width: '120px',

        '& svg': {
            color: theme.palette.primary.main,
            fontSize: '5em'
        },
    }
}))

const contentStates = Object.freeze({
    FORM: 1,
    IN_PROGRESS: 2,
    SUCCESS: 3
})

function CreatePage() {

    const classes = useStyles();

    const [errorMessage, setErrorMessage] = useState();
    const [content, setContent] = useState(contentStates.FORM);
    const [sessionId, setSessionId] = useState();
    const [hostName, setHostName] = useState();

    async function handleOnSubmit(data) {

        try {
            setErrorMessage(null);
            setContent(contentStates.IN_PROGRESS);

            await fetch('https://localhost:5001/quiz/create', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                response.json().then(result => {

                    setSessionId(result);
                    setHostName(data.hostName);
                    setContent(contentStates.SUCCESS);
                });
            }
            )
        }
        catch (e) {
            setContent(contentStates.FORM);
            setErrorMessage("Could not connect to server. Try again.");
        }
    }

    function getContent(contentStates) {

        switch (contentStates) {
            case 1:
                return (
                    <Form onSubmit={handleOnSubmit} />
                )
            case 2:
                return (
                    <div style={{ margin: '40px 0', textAlign: 'center' }}>
                        <CircularProgress color="secondary" />
                        <Typography variant="h6">Generating session...</Typography>
                    </div>
                )
            case 3:
                return (
                    <div className={classes.successContainer}>
                        <div className={classes.successIconWrapper}>
                            <SuccessIcon />
                        </div>
                        <Typography color="primary" style={{ textAlign: 'center', margin: '10px' }} variant="h4">Quiz created!</Typography>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
                            <Typography color="primary" style={{ textAlign: 'center', marginRight: '10px' }} variant="h6">Code: <span style={{textDecoration: 'underline'}}>{sessionId}</span></Typography>
                            <Button variant="outlined" color="primary" onClick={() => {navigator.clipboard.writeText(sessionId)}}>Copy</Button>
                        </div>
                        <div style={{ textAlign: 'center', marginTop: '50px' }}>
                            <Link to={{
                                pathname: `/quiz/${sessionId}`,
                                state: { sessionId: sessionId, username: hostName }
                            }}>
                                <Button variant="contained" color="primary" size="large">Start</Button>
                            </Link>
                        </div>
                    </div>
                )
            default:
                return null;
        }
    }

    return (
        <div className={classes.container}>
            <Container className={classes.wrapper}>
                <Fade in timeout={1500}>
                    <Paper elevation={10} style={{ padding: '30px' }}>
                        {content < 3 && <Typography variant="h3" style={{ textAlign: 'center' }}>Create quiz</Typography>}
                        <Typography style={{ textAlign: 'center' }} color="error">{errorMessage}</Typography>
                        {getContent(content)}
                    </Paper>
                </Fade>
            </Container>
        </div>
    )
}

export default CreatePage;