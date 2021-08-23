import { useEffect, useState } from "react";
import { useHistory } from 'react-router';
import { useLocation } from "react-router-dom";
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { makeStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import ShareIcon from '@material-ui/icons/Share';
import ShareQuiz from '../components/ShareQuiz';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import { Connect, Disconnect, Start, SubmitAnswer, NextQuestion, GetResults } from '../services/QuizService';
import PlayerList from '../components/PlayerList';
import Quiz from '../components/Quiz';
import Results from '../components/Results';

const useStyles = makeStyles(theme => ({

    container: {
        background: theme.palette.gradient.main,
    },

    centeredContent: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
    },

    loadingAnimation: {

        '&:after': {
            overflow: 'hidden',
            display: 'inline-block',
            verticalAlign: 'bottom',
            '-webkit-animation': '$ellipsis steps(14, end) 900ms infinite',
            '-moz-animation': '$ellipsis steps(14, end) 900ms infinite',
            '-o-animation': '$ellipsis steps(14, end) 900ms infinite',
            animation: '$ellipsis steps(14, end) 900ms infinite',
            content: '"\\2026"',
            width: '0px'
        }
    },

    "@keyframes ellipsis": {
        "to": {
            width: '1.25em',
        }
    },
    "@-webkit-keyframes ellipsis": {
        "to": {
            width: '1.25e',
        }
    }
}))

const contentStates = Object.freeze({
    CONNECTING: 1,
    ERROR: 2,
    WAITING: 3,
    IN_PROGRESS: 4,
    RESULTS: 5
})

function QuizPage() {

    const classes = useStyles();

    // SignalR connection state
    const [connection, setConnection] = useState(null);

    // Quiz state
    const [sessionId, setSessionId] = useState();
    const [quizTitle, setQuizTitle] = useState();
    const [username, setUsername] = useState();
    const [expectedPlayers, setExpectedPlayers] = useState();
    const [players, setPlayers] = useState([]);
    const [questionTimeout, setQuestionTimeout] = useState();
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [finalScore, setFinalScore] = useState([]);

    // Quiz current state
    const [correctAnswer, setCorrectAnswer] = useState(null);
    const [quizContent, setQuizContent] = useState(null);

    // UI state
    const [content, setContent] = useState(contentStates.CONNECTING);
    const [shareDialogOpen, setShareDialogOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    const history = useHistory();
    const location = useLocation();

    useEffect(() => {

        // Redirect to /join if state is undefined
        if (!location.state) {
            history.push("/join");
            return;
        }
        // Else, set sessionID and username stored in the state
        else {
            setSessionId(location.state.sessionId);
            setUsername(location.state.username);
        }

    }, [location, history])

    useEffect(() => {

        // Create new connection
        const newConnection = new HubConnectionBuilder()
            .withUrl(`${process.env.REACT_APP_QUIZINE_API_BASE_URL}hubs/quiz`)
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Error)
            .build();

        setConnection(newConnection);
    }, []);

    useEffect(() => {

        if (connection) {
            connection.start()
                .then(_ => {

                    // Connect to quiz
                    Connect(connection, sessionId, username);

                    // Subscribe to all events
                    connection.on('ConfirmConnect', (response) => {

                        if (response.connected) {
                            setQuizTitle(response.quizTitle);
                            setExpectedPlayers(response.expectedUsers);
                            setPlayers(response.users);
                            setQuestionTimeout(response.questionTimeout);
                            setContent(contentStates.WAITING);
                        } else {
                            reportError(response.errorMessage);
                        }
                    });
                    connection.on('ConfirmDisconnect', (response) => {
                        setPlayers(response.users);
                    });
                    connection.on('ConfirmStart', (_) => {
                        NextQuestion(connection, sessionId);
                        setContent(contentStates.IN_PROGRESS);
                    });
                    connection.on('NextQuestion', (response) => {
                        setCorrectAnswer(null);
                        setQuizContent(response);
                    })
                    connection.on('ValidateAnswer', (response) => {
                        setCorrectAnswer(response);
                    })
                    connection.on('Results', (response) => {
                        setQuizCompleted(response.sessionCompleted);
                        setFinalScore(response.scores);
                    })
                    connection.onclose(function () {
                        reportError("Lost server connection.");
                    })
                })
                .catch(e => {
                    console.log(e);
                    reportError("Failed to connect to server.");
                });

            window.addEventListener("beforeunload", handleBeforeUnload);

            function handleBeforeUnload(e) {

                var confirmationMessage = 'Leaving this page will remove you from the ongoing quiz session.';

                (e || window.event).returnValue = confirmationMessage;
                return confirmationMessage;
            }

            return () => {
                window.removeEventListener("beforeunload", handleBeforeUnload);
                if (connection && connection.connectionState === "Connected") {
                    Disconnect(connection);
                }
            }
        }

    }, [connection, sessionId, username]);

    // Report error
    function reportError(message) {
        console.log(message);
        setContent(contentStates.ERROR);
        setErrorMessage(message);
    }

    // Open share dialog
    function handleOnOpenShareDialog() {
        setShareDialogOpen(true);
    }

    // Close share dialog
    function handleOnCloseShareDialog() {
        setShareDialogOpen(false);
    }

    // Start quiz
    function handleOnStart() {

        const ready = ((expectedPlayers === players.length) || (expectedPlayers !== players.length && window.confirm("Not all players connected. Continue?")));

        if (ready) {
            try {
                Start(connection, sessionId);
            } catch (error) {
                console.log(error);
                reportError("Failed to start quiz.");
            }
        }
    }

    // Submit answer
    function handleOnSubmitAnswer(answer) {

        try {
            SubmitAnswer(connection, sessionId, quizContent.id, answer?.id);
        } catch (error) {
            console.log(error);
        }
    }

    // Next question
    function handleNextQuestion() {

        try {
            NextQuestion(connection, sessionId);
        } catch (error) {
            console.log(error);
        }
    }

    // See results
    function handleOnFinal() {

        try {
            GetResults(connection, sessionId);
            setContent(contentStates.RESULTS);
        } catch (error) {
            console.log(error);
        }
    }

    // Get message during waiting state
    function getWaitingMessage() {

        if (expectedPlayers !== players.length) {
            return (
                <Typography variant="h6" className={classes.loadingAnimation}>
                    Waiting for other players
                </Typography>
            );
        } else if (players[0] !== username) {
            return (
                <Typography variant="h6" className={classes.loadingAnimation}>
                    Waiting for host to start
                </Typography>
            )
        }
    }

    // Controls the content to be displayed
    function getContent(state) {

        switch (state) {
            case contentStates.ERROR:
                return (
                    <div className={classes.centeredContent}>
                        <Typography variant="h1" color="error">
                            {errorMessage}
                        </Typography>
                    </div>
                )
            case contentStates.CONNECTING:
                return (
                    <div className={classes.centeredContent}>
                        <Container maxWidth="sm">
                            <Paper elevation={10}>
                                <div style={{ padding: '20px' }}>
                                    <Typography variant="h6" className={classes.loadingAnimation}>Connecting</Typography>
                                </div>
                            </Paper>
                        </Container>
                    </div>
                )
            case contentStates.WAITING:
                return (
                    <div className={classes.centeredContent}>
                        <Container maxWidth="sm">
                            <Paper elevation={10} className="secondary-background">
                                <div style={{ padding: '20px' }}>
                                    <div className="primary-color" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="h3" style={{ textAlign: 'center' }} gutterBottom>{quizTitle}</Typography>
                                        <IconButton onClick={handleOnOpenShareDialog} style={{ height: 'fit-content' }}>
                                            <ShareIcon />
                                        </IconButton>
                                        <Dialog open={shareDialogOpen} onClose={handleOnCloseShareDialog}>
                                            <DialogTitle>Share Quiz</DialogTitle>
                                            <DialogContent dividers>
                                                <DialogContentText>
                                                    Share the quiz to your friends (or rivals) so that they may join this EPIC battle!
                                                </DialogContentText>
                                                <ShareQuiz sessionId={sessionId} />
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                    {getWaitingMessage()}
                                    <hr />
                                    <PlayerList expectedPlayers={expectedPlayers} players={players} username={username} />
                                    <hr />
                                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                                        {players[0] === username &&
                                            <Button onClick={handleOnStart} variant={(expectedPlayers === players.length) ? 'contained' : 'outlined'} color="primary">
                                                Start
                                            </Button>
                                        }
                                    </div>
                                </div>
                            </Paper>
                        </Container>
                    </div>
                )
            case contentStates.IN_PROGRESS:
                return (
                    <div>
                        {quizContent &&
                            <Quiz
                                questionTimeout={questionTimeout}
                                content={quizContent}
                                correctAnswer={correctAnswer}
                                onSubmit={handleOnSubmitAnswer}
                                onNext={handleNextQuestion}
                                onFinal={handleOnFinal}
                            />
                        }
                    </div>
                )
            case contentStates.RESULTS:
                return (
                    <Results quizCompleted={quizCompleted} finalScore={finalScore} username={username} />
                )
            default:
                return null;
        }
    }

    return (
        <div className={classes.container}>
            {getContent(content)}
        </div>
    )
}

export default QuizPage;