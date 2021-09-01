import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useLocation } from "react-router-dom";
import { NextQuestion, GetResults, Disconnect } from '../services/QuizService';
import { useConnection } from '../contexts/HubConnectionContext';
import { useSnackbar } from '../contexts/SnackbarContext';
import useTitle from '../hooks/useTitle';
import QuizConnecting from '../components/quiz-states/QuizConnecting';
import QuizWaiting from '../components/quiz-states/QuizWaiting';
import QuizProgress from '../components/quiz-states/QuizProgress';
import QuizResults from '../components/quiz-states/QuizResults';
import {
    makeStyles,
    Typography,
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({

    container: {
        background: theme.palette.background.main,
    },

    centeredContent: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
    },
}));

const contentStates = Object.freeze({
    ERROR: 0,
    CONNECTING: 1,
    WAITING: 2,
    IN_PROGRESS: 3,
    RESULTS: 4
})

function QuizPage() {

    const classes = useStyles();

    const { connection } = useConnection();
    const { notifySuccess, notifyError } = useSnackbar();

    // Quiz state
    const [sessionId, setSessionId] = useState();
    const [username, setUsername] = useState();
    const [quizTitle, setQuizTitle] = useState();
    const [expectedPlayers, setExpectedPlayers] = useState();
    const [players, setPlayers] = useState([]);
    const [questionTimeout, setQuestionTimeout] = useState();
    const [questionCount, setQuestionCount] = useState();
    const [maxScore, setMaxScore] = useState();
    const [enableSkip, setEnableSkip] = useState();

    // UI state
    const [content, setContent] = useState(contentStates.CONNECTING);
    const [errorMessage, setErrorMessage] = useState(null);

    const history = useHistory();
    const location = useLocation();

    useTitle(quizTitle);

    useEffect(() => {

        // Request permission to send notifications
        Notification.requestPermission();

        // Prevent browser sleeping
        var lockResolver;
        if (navigator && navigator.locks && navigator.locks.request) {
            const promise = new Promise((res) => {
                lockResolver = res;
            });

            navigator.locks.request('unique_lock_name', { mode: "shared" }, () => {
                return promise;
            });
        }

        // Allow browser sleeping on unmount
        return () => {
            lockResolver();
        }

    }, []);

    useEffect(() => {

        if (connection) {
            window.addEventListener("beforeunload", handleBeforeUnload);
        }

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

    }, [connection]);

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

        if (connection) {
            connection.on('ConfirmConnect', (response) => {

                if (response.connected) {
                    setContent(contentStates.WAITING);
                    setQuizTitle(response.quizTitle);
                    setExpectedPlayers(response.expectedUsers);
                    setQuestionTimeout(response.questionTimeout);
                    setQuestionCount(response.questionCount);
                    setEnableSkip(response.enableSkip);
                    setMaxScore(response.maxScore);
                    setPlayers(response.users);
                } else {
                    reportError(response.errorMessage);
                }
            });
            connection.on('UserConnected', (response) => {
                notifySuccess(`${response.username} joined!`);
            });
            connection.on('ConfirmDisconnect', (response) => {
                setPlayers(response.users);
                notifyError(`${response.username} disconnected.`);
            });
            connection.on('ConfirmStart', (_) => {
                setContent(contentStates.IN_PROGRESS);
                NextQuestion(connection, sessionId);
            });
        }

    }, [connection, sessionId, notifyError, notifySuccess]);

    // Report error
    function reportError(message) {
        console.log(message);
        setContent(contentStates.ERROR);
        setErrorMessage(message);
    }

    // See results
    function handleOnFinal() {
        setContent(contentStates.RESULTS);
        GetResults(connection, sessionId);
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
                        <QuizConnecting
                            sessionId={sessionId}
                            username={username}
                        />
                    </div>
                )
            case contentStates.WAITING:
                return (
                    <div className={classes.centeredContent}>
                        <QuizWaiting
                            sessionId={sessionId}
                            username={username}
                            quizTitle={quizTitle}
                            expectedPlayers={expectedPlayers}
                            players={players}
                        />
                    </div>
                )
            case contentStates.IN_PROGRESS:
                return (
                    <QuizProgress
                        sessionId={sessionId}
                        questionCount={questionCount}
                        questionTimeout={questionTimeout}
                        enableSkip={enableSkip}
                        onFinal={handleOnFinal}
                    />
                )
            case contentStates.RESULTS:
                return (
                    <QuizResults
                        maxScore={maxScore}
                        username={username}
                        expectedPlayers={players.length}
                    />
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