import { useState, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { DataProvider } from '../contexts/CreateFormDataContext';
import useTitle from '../hooks/useTitle';
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
        height: '100px',
        width: '100px',

        '& svg': {
            color: theme.palette.primary.main,
            fontSize: '5em'
        },
    }
}))

const contentStates = Object.freeze({
    LOADING: 0,
    FORM: 1,
    IN_PROGRESS: 2,
    SUCCESS: 3
})

const difficulties = [
    "Any",
    "Easy",
    "Medium",
    "Hard",
]

function CreatePage() {

    const classes = useStyles();

    const [categories, setCategories] = useState([]);
    const [rules, setRules] = useState([]);
    const [errorMessage, setErrorMessage] = useState();
    const [content, setContent] = useState(contentStates.LOADING);
    const [sessionId, setSessionId] = useState();
    const [hostname, setHostname] = useState();

    useTitle("Create");

    // On first render
    useEffect(() => {
        fetchCategories();
        fetchRules();
    }, []);

    // On categories or rules state update
    useEffect(() => {

        if (categories.length > 0 && rules.length > 0)
            setContent(contentStates.FORM);

    }, [categories, rules])

    // Gets the available categories from the server
    async function fetchCategories() {

        console.info("Fetching categories...");

        await fetch(`${process.env.REACT_APP_QUIZINE_API_BASE_URL}quiz/categories`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'ApiKey': process.env.REACT_APP_QUIZINE_API_KEY
            }
        }).then(response => {
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

        await fetch(`${process.env.REACT_APP_QUIZINE_API_BASE_URL}quiz/rules`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'ApiKey': process.env.REACT_APP_QUIZINE_API_KEY
            }
        }).then(response => {
            response.json().then(result => {

                console.info("Successfully fetched rules.");

                setRules(result);
            })
        }).catch(error => {
            console.error(error);
            setErrorMessage("Failed to connect to the server. Refresh to try again");
        })
    }

    // Handle form submission
    async function handleOnSubmit(data) {

        console.info("Submitting quiz parameters...");
        console.trace(data);

        setErrorMessage(null);
        setContent(contentStates.IN_PROGRESS);

        // Create session and accept sessionID
        await fetch(`${process.env.REACT_APP_QUIZINE_API_BASE_URL}quiz/create`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'ApiKey': process.env.REACT_APP_QUIZINE_API_KEY
            }
        }).then(response => {
            if (response.status === 200) {
                response.json().then(result => {

                    console.info("Successfully submitted quiz paramters.");

                    setSessionId(result);
                    setHostname(data.hostname);
                    setContent(contentStates.SUCCESS);
                });
            } else {
                setErrorMessage(`Error ${response.status}: Server rejected request.`);
                setContent(contentStates.FORM);
            }
        }).catch(_ => {
            setErrorMessage("Could not connect to the server. Please try again later.");
            setContent(contentStates.FORM);
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
                    <CreateForm onSubmit={handleOnSubmit} categories={categories} difficulties={difficulties} rules={rules} />
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
                            <Link to={{
                                pathname: `/quiz/${sessionId}`,
                                state: { sessionId: sessionId, username: hostname }
                            }}>
                                <Button variant="contained" color="primary" size="large">Join</Button>
                            </Link>
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
                            <div>
                                <GoHome />
                            </div>
                            {content !== contentStates.SUCCESS && <Typography variant="h3" style={{ textAlign: 'center' }}>Create quiz</Typography>}
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