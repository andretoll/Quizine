import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useLocation } from "react-router-dom";
import { Connect, NextQuestion, GetResults } from '../services/QuizService';
import { useConnection } from '../contexts/HubConnectionContext';
import { useSnackbar } from '../contexts/SnackbarContext';
import { useErrorModal } from '../contexts/ErrorModalContext';
import useTitle from '../hooks/useTitle';
import QuizError from '../components/quiz-states/QuizError';
import QuizConnecting from '../components/quiz-states/QuizConnecting';
import QuizWaiting from '../components/quiz-states/QuizWaiting';
import QuizProgress from '../components/quiz-states/QuizProgress';
import QuizResults from '../components/quiz-states/QuizResults';
import PromptWrapper from '../components/PromptWrapper';
import {
    makeStyles,
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
    const [eventsSubscribedTo, setEventsSubscribedTo] = useState(false);
    const { notifySuccess, notifyError } = useSnackbar();
    const { openModal, closeModal } = useErrorModal();

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
    const [ruleset, setRuleset] = useState();

    // UI state
    const [content, setContent] = useState(contentStates.CONNECTING);
    const [errorMessage, setErrorMessage] = useState(null);

    const history = useHistory();
    const location = useLocation();

    useTitle(quizTitle ? quizTitle : '');

    useEffect(() => {

        if (connection && connection.state === 'Disconnected') {
            console.info("Starting socket connection...");
            start();
        }

        async function start() {

            try {
                await connection.start().then(_ => {
                    console.info("Connecting to session...");
                    Connect(connection, sessionId, username).catch((error) => {
                        console.log(error);
                        reportError("Failed to connect to session (Error code 2).")
                    });
                });
            } catch (error) {
                console.log(error);
                reportError("Error connecting to server (Error code 1).");
            }
        }

    }, [connection, sessionId, username])

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

        if (connection && !eventsSubscribedTo) {
            // When connection is lost
            connection.onreconnecting(error => {
                console.error(error);
                openModal({
                    title: "Lost connection",
                    message: "Lost connection to the server. Reconnecting...",
                    actionText: "Cancel",
                    action: () => {
                        history.push("/");
                    }
                });
            });
            // When connection is restored
            connection.onreconnected(response => {
                console.info(response);
                closeModal();
                notifySuccess("Reconnected to the server.");
            });
            // When reconnection fails
            connection.onclose(error => {
                console.error(error)
                closeModal();
                reportError("Unable to reconnect to the session. Connection permanently lost (Error code 3).")
            });
            connection.on('ConfirmConnect', (response) => {

                if (response.connected) {
                    console.info("Connection confirmed!");

                    setQuizTitle(response.quizTitle);
                    setExpectedPlayers(response.expectedUsers);
                    setQuestionTimeout(response.questionTimeout);
                    setQuestionCount(response.questionCount);
                    setEnableSkip(response.enableSkip);
                    setMaxScore(response.maxScore);
                    setPlayers(response.users);
                    setRuleset(response.rule);
                    setContent(contentStates.WAITING);
                } else {
                    console.warn("Connection rejected: ", response.errorMessage);
                    history.replace(`${location.state.url}`, { errorMessage: response.errorMessage });
                }

                console.trace(response);
            });
            connection.on('UserConnected', (response) => {
                console.info("Another user connected");

                setPlayers(response.users);
                notifySuccess(`${response.username} joined!`);
            });
            connection.on('ConfirmDisconnect', (response) => {
                console.info("Another user disconnected");

                setPlayers(response.users);
                notifyError(`${response.username} disconnected.`);
            });
            connection.on('ConfirmStart', (_) => {
                console.info("Start confirmed!");

                setContent(contentStates.IN_PROGRESS);
                NextQuestion(connection, sessionId);
            });

            setEventsSubscribedTo(true);
        }

    }, [connection, sessionId, notifyError, notifySuccess, eventsSubscribedTo, history, location, username, openModal, closeModal]);

    // Report error
    function reportError(message) {
        console.error(message);
        setContent(contentStates.ERROR);
        setErrorMessage(message);
    }

    // See results
    function handleOnFinal() {
        console.info("Getting results...");
        setContent(contentStates.RESULTS);
        GetResults(connection, sessionId);
    }

    // Controls the content to be displayed
    function getContent(state) {

        switch (state) {
            case contentStates.ERROR:
                return (
                    <div className={classes.centeredContent}>
                        <QuizError errorMessage={errorMessage} />
                    </div>
                )
            case contentStates.CONNECTING:
                return (
                    <div className={classes.centeredContent}>
                        <QuizConnecting
                            sessionId={sessionId}
                            username={username}
                            reportError={reportError}
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
                            questionCount={questionCount}
                            questionTimeout={questionTimeout}
                            ruleset={ruleset}
                            reportError={reportError}
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
            <PromptWrapper
                title="Progress will be lost."
                message="Leaving this page will result in a disconnect and all progress will be lost. Continue?"
                when={content !== contentStates.ERROR && content !== contentStates.CONNECTING}
            />
            {getContent(content)}
        </div>
    )
}

export default QuizPage;