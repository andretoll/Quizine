import { useState, useEffect, Fragment } from 'react';
import { useHistory } from 'react-router';
import { DataProvider } from '../contexts/CreateFormDataContext';
import useTitle from '../hooks/useTitle';
import { Create, FetchCategories, FetchRules, FetchSessionLifetime, Join } from '../services/QuizService';
import ShareQuiz from '../components/ShareQuiz';
import CreateForm from '../components/CreateForm';
import GoHome from '../components/GoHome';
import SuccessIcon from '@material-ui/icons/Check';
import {
    makeStyles,
    Container,
    Typography,
    Fade,
    Paper,
    CircularProgress,
    Button,
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({

    container: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },

    content: {
        display: 'flex',
        flexDirection: 'column',
        background: theme.palette.secondary.main,
        padding: '15px',
        minHeight: '600px',
    },

    successIconWrapper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: `10px double ${theme.palette.primary.main}`,
        borderRadius: '50%',
        height: '90px',
        width: '90px',

        '& svg': {
            color: theme.palette.primary.main,
            fontSize: '4.5em',
        },
    }
}));

const contentStates = Object.freeze({
    LOADING: 0,
    FORM: 1,
    IN_PROGRESS: 2,
    SUCCESS: 3
});

const difficulties = [
    "Any",
    "Easy",
    "Medium",
    "Hard",
];

function CreatePage() {

    const classes = useStyles();

    const [categories, setCategories] = useState([]);
    const [rules, setRules] = useState([]);
    const [sessionLifetime, setSessionLifetime] = useState(0);
    const [errorMessage, setErrorMessage] = useState(null);
    const [content, setContent] = useState(contentStates.LOADING);
    const [sessionId, setSessionId] = useState(null);
    const [hostname, setHostname] = useState(null);
    const [inProgress, setInProgress] = useState(false);

    const history = useHistory();

    useTitle("Create");

    // On first render
    useEffect(() => {
        fetchCategories();
        fetchRules();
        fetchSessionLifetime();
    }, []);

    // On categories or rules state update
    useEffect(() => {

        if (categories.length > 0 && rules.length > 0)
            setContent(contentStates.FORM);

    }, [categories, rules])

    // Gets the available categories from the server
    async function fetchCategories() {

        console.info("Fetching categories...");

        await FetchCategories().then(response => {
            response.json().then(result => {

                console.info("Successfully fetched categories.");

                // Add 'any' category
                result.trivia_categories.unshift({ id: 0, name: 'Any' });
                setCategories(result.trivia_categories);
            })
        }).catch(error => {
            console.error(error);
            setErrorMessage("Failed to connect to the server. Refresh to try again.");
        })
    }

    // Gets the available rules from the server
    async function fetchRules() {

        console.info("Fetching rules...");

        await FetchRules().then(response => {
            response.json().then(result => {

                console.info("Successfully fetched rules.");

                setRules(result);
            })
        }).catch(error => {
            console.error(error);
            setErrorMessage("Failed to connect to the server. Refresh to try again");
        })
    }

    // Gets the session lifetime from the server
    async function fetchSessionLifetime() {

        console.info("Fetching session lifetime...");

        await FetchSessionLifetime().then(response => {
            response.json().then(result => {

                console.info("Successfully fetched session lifetime.");

                setSessionLifetime(result);
            })
        }).catch(error => {
            console.error(error);
            setErrorMessage("Failed to connect to the server. Refresh to try again.");
        })
    }

    // Handle form submission
    async function handleOnSubmit(data) {

        console.info("Creating quiz...");

        setErrorMessage(null);
        setContent(contentStates.IN_PROGRESS);

        // Create session and accept sessionID
        await Create(data).then(response => {
            if (response.status === 200) {
                response.json().then(result => {

                    console.info("Successfully created quiz.");

                    setSessionId(result);
                    setHostname(data.hostname);
                    setContent(contentStates.SUCCESS);
                });
            } else {
                setErrorMessage(`Error ${response.status}: Server rejected request.`);
                setContent(contentStates.FORM);
            }
        }).catch(error => {
            console.error(error);
            setErrorMessage("Could not connect to the server. Please try again later.");
            setContent(contentStates.FORM);
        });
    }

    async function joinSession() {

        console.info("Joining quiz...");
        setInProgress(true);

        // Join quiz and navigate to session
        await Join({ sessionId: sessionId, username: hostname }).then(response => {
            if (response.status === 200) {
                history.push(`/quiz/${sessionId}`, { sessionId: sessionId, username: hostname });
            } else {
                response.text().then(result => {
                    setErrorMessage(result);
                });
            }
        }).catch(error => {
            console.error(error);
            setErrorMessage("Failed to connect to the server.");
            setContent(contentStates.FORM);
        }).finally(_ => {
            setInProgress(false);
        });
    }

    // Controls the content to be displayed
    function getContent(state) {

        switch (state) {
            case contentStates.LOADING:
                return (
                    <div style={{ margin: '40px 0', textAlign: 'center' }}>
                        {!errorMessage &&
                            <Fragment>
                                <CircularProgress color="primary" />
                                <Typography variant="h6">Loading...</Typography>
                            </Fragment>
                        }
                    </div>
                )
            case contentStates.FORM:
                return (
                    <CreateForm
                        onSubmit={handleOnSubmit}
                        categories={categories}
                        difficulties={difficulties}
                        rules={rules}
                        sessionLifetime={sessionLifetime}
                    />
                )
            case contentStates.IN_PROGRESS:
                return (
                    <div style={{ margin: '40px 0', textAlign: 'center' }}>
                        <CircularProgress color="primary" />
                        <Typography variant="h6">Generating session...</Typography>
                    </div>
                )
            case contentStates.SUCCESS:
                return (
                    <div style={{ display: 'flex', flex: '1', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <div className={classes.successIconWrapper}>
                            <SuccessIcon />
                        </div>
                        <Typography style={{ textAlign: 'center', margin: '20px 0' }} variant="h3">Quiz created!</Typography>
                        <ShareQuiz sessionId={sessionId} />
                        <div style={{ textAlign: 'center', marginTop: '30px' }}>
                            {inProgress ?
                                <CircularProgress />
                                :
                                <Button variant="contained" color="primary" size="large" onClick={joinSession}>Join</Button>
                            }
                        </div>
                    </div>
                )
            default:
                return null;
        }
    }

    return (
        <DataProvider>
            <div className={classes.container}>
                <Container maxWidth="sm">
                    <Fade in timeout={1500}>
                        <Paper elevation={10} className={classes.content}>
                            <div style={{ display: 'flex', alignItems: 'center', height: '60px' }}>
                                <GoHome style={{ position: 'absolute' }} />
                                {content !== contentStates.SUCCESS && <Typography variant="h3" style={{ textAlign: 'center', flex: '1' }}>Create quiz</Typography>}
                            </div>
                            <Typography style={{ textAlign: 'center', marginTop: '10px' }} color="error" gutterBottom>{errorMessage}</Typography>
                            {getContent(content)}
                        </Paper>
                    </Fade>
                </Container>
            </div>
        </DataProvider>
    )
}

export default CreatePage;