import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import SuccessIcon from '@material-ui/icons/Check';
import ShareQuiz from '../components/ShareQuiz';
import CreateForm from '../components/CreateForm';
import GoHome from '../components/GoHome';

const useStyles = makeStyles(theme => ({

    container: {
        minHeight: '100vh',
        background: theme.palette.primaryBackground.main,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },

    content: {
        background: theme.palette.secondary.main,
        padding: '20px',
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
    LOADING: 0,
    FORM: 1,
    IN_PROGRESS: 2,
    SUCCESS: 3
})

function CreatePage() {

    const classes = useStyles();

    const [categories, setCategories] = useState([]);
    const [rules, setRules] = useState([]);
    const [errorMessage, setErrorMessage] = useState();
    const [content, setContent] = useState(contentStates.LOADING);
    const [sessionId, setSessionId] = useState();
    const [hostName, setHostName] = useState();

    useEffect(() => {
        console.log(process.env.REACT_APP_QUIZINE_API_BASE_URL);
        fetchCategories();
        fetchRules();
    }, []);

    useEffect(() => {

        if (categories.length > 0 && rules.length > 0)
            setContent(contentStates.FORM);

    }, [categories, rules])

    // Gets the available categories from the server
    async function fetchCategories() {

        try {
            await fetch(`${process.env.REACT_APP_QUIZINE_API_BASE_URL}quiz/categories`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                response.json().then(result => {

                    // Add 'any' category
                    result.trivia_categories.unshift({ id: 0, name: 'Any' });
                    setCategories(result.trivia_categories);
                })
            }).catch(error => {
                console.log(error);
                setErrorMessage("Failed to fetch categories. Refresh to try again.");
            })
        } catch (error) {
            console.log(error);
            setErrorMessage("Failed to fetch categories. Refresh to try again.");
        }
    }

    // Gets the available categories from the server
    async function fetchRules() {

        try {

            await fetch(`${process.env.REACT_APP_QUIZINE_API_BASE_URL}quiz/rules`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                response.json().then(result => {
                    setRules(result);
                })
            }).catch(error => {
                console.log(error);
                setErrorMessage("Failed to fetch rules. Refresh to try again.");
            })
        } catch (error) {
            console.log(error);
            setErrorMessage("Failed to fetch rules. Refresh to try again.");
        }
    }

    // Handle form submission
    async function handleOnSubmit(data) {
        
        try {
            setErrorMessage(null);
            setContent(contentStates.IN_PROGRESS);

            // Create session and accept sessionID
            await fetch(`${process.env.REACT_APP_QUIZINE_API_BASE_URL}quiz/create`, {
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

    // Controls the content to be displayed
    function getContent(state) {

        switch (state) {
            case contentStates.LOADING:
                return (
                    <div style={{ margin: '40px 0', textAlign: 'center' }}>
                        <CircularProgress color="secondary" />
                        <Typography variant="h6">Loading...</Typography>
                    </div>
                )
            case contentStates.FORM:
                return (
                    <CreateForm onSubmit={handleOnSubmit} categories={categories} rules={rules} />
                )
            case contentStates.IN_PROGRESS:
                return (
                    <div style={{ margin: '40px 0', textAlign: 'center' }}>
                        <CircularProgress color="secondary" />
                        <Typography variant="h6">Generating session...</Typography>
                    </div>
                )
            case contentStates.SUCCESS:
                return (
                    <div className={classes.successContainer}>
                        <div className={classes.successIconWrapper}>
                            <SuccessIcon />
                        </div>
                        <Typography style={{ textAlign: 'center', margin: '20px 0' }} variant="h4">Quiz created!</Typography>
                        <ShareQuiz sessionId={sessionId} />
                        <div style={{ textAlign: 'center', marginTop: '50px' }}>
                            <Link to={{
                                pathname: `/quiz/${sessionId}`,
                                state: { sessionId: sessionId, username: hostName }
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
        <div className={classes.container}>
            <Container className={classes.wrapper} maxWidth="sm">
                <Fade in timeout={1500}>
                    <Paper elevation={10} className={classes.content}>
                        <GoHome />
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