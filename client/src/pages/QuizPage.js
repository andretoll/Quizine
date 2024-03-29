import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useLocation } from "react-router-dom";
import { Connect, NextQuestion, GetResults, Disconnect } from '../services/QuizService';
import { useConnection } from '../contexts/HubConnectionContext';
import { useSnackbar } from '../contexts/SnackbarContext';
import { useErrorModal } from '../contexts/ErrorModalContext';
import useTitle from '../hooks/useTitle';
import { useTimeoutCache } from '../hooks/useTimeoutCache';
import QuizError from '../components/quiz-states/QuizError';
import QuizConnecting from '../components/quiz-states/QuizConnecting';
import QuizWaiting from '../components/quiz-states/QuizWaiting';
import QuizProgress from '../components/quiz-states/QuizProgress';
import QuizRaceProgress from '../components/quiz-states/QuizRaceProgress';
import QuizResults from '../components/quiz-states/QuizResults';
import PromptWrapper from '../components/wrappers/PromptWrapper';
import {
    makeStyles,
} from '@material-ui/core';

const useStyles = makeStyles(_ => ({

    container: {
        background: 'rgba(0 0 0 / 25%)',
        overflow: 'hidden',
    },

    centeredContent: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        position: 'relative',
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
    const { openModal, closeModal } = useErrorModal();
    const [, setCachedTimeout] = useTimeoutCache();

    // Quiz state
    const [eventsSubscribedTo, setEventsSubscribedTo] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const [username, setUsername] = useState(null);
    const [quizTitle, setQuizTitle] = useState(null);
    const [expectedPlayers, setExpectedPlayers] = useState(0);
    const [players, setPlayers] = useState([]);
    const [questionTimeout, setQuestionTimeout] = useState(0);
    const [questionCount, setQuestionCount] = useState(0);
    const [maxScore, setMaxScore] = useState(0);
    const [enableSkip, setEnableSkip] = useState(false);
    const [ruleset, setRuleset] = useState(null);
    const [category, setCategory] = useState(null);
    const [difficulty, setDifficulty] = useState(null);

    // UI state
    const [content, setContent] = useState(contentStates.CONNECTING);
    const [errorMessage, setErrorMessage] = useState(null);

    const history = useHistory();
    const location = useLocation();

    useTitle(quizTitle ? quizTitle : '');

    useEffect(() => {

        if (connection && connection.state === 'Disconnected') {
            console.debug("Starting socket connection...");
            start();
        }

        async function start() {

            try {
                await connection.start().then(_ => {
                    console.debug("Connecting to session...");
                    Connect(connection, sessionId).catch((error) => {
                        console.error(error);
                        reportError("Failed to connect to session (Error code 2).")
                    });
                });
            } catch (error) {
                console.error(error);
                reportError("Error connecting to server (Error code 1).");
            }
        }

    }, [connection, sessionId])

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
            
            setEventsSubscribedTo(true);

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
            connection.onreconnected(_ => {
                console.info("Successfully reconnected to server");
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
                    console.debug("Connection confirmed!");

                    setQuizTitle(response.quizTitle);
                    setExpectedPlayers(response.expectedUsers);
                    setQuestionTimeout(response.questionTimeout);
                    setQuestionCount(response.questionCount);
                    setEnableSkip(response.enableSkip);
                    setMaxScore(response.maxScore);
                    setPlayers(response.users);
                    setRuleset(response.rule);
                    setCategory(response.category);
                    setDifficulty(response.difficulty);

                    switch (response.state) {
                        case 0:
                            setContent(contentStates.WAITING);
                            break;
                        case 1:
                            setContent(contentStates.IN_PROGRESS);
                            NextQuestion(connection, sessionId);
                            break;
                        case 2:
                            setContent(contentStates.RESULTS);
                            GetResults(connection, sessionId);
                            break;
                        default:
                            setContent(contentStates.WAITING);
                            break;
                    }

                } else {
                    console.warn("Connection rejected: ", response.errorMessage);
                    reportError(response.errorMessage);
                }
            });
            connection.on('UserConnected', (response) => {
                console.debug("Another user connected");

                setPlayers(response.users);
                notifySuccess(`${response.username} joined!`);
            });
            connection.on('ConfirmDisconnect', (response) => {
                console.debug("Another user disconnected");

                setPlayers(response.users);
                notifyError(`${response.username} disconnected.`);
            });
            connection.on('ConfirmStart', (response) => {
                if (response) {
                    console.debug("Start confirmed!");
                    setCachedTimeout(null); // Reset timeout cache
                    setContent(contentStates.IN_PROGRESS);
                    NextQuestion(connection, sessionId);
                } else {
                    reportError("Failed to start session (Error code 4).");
                }
            });
            connection.on('ReportError', (_) => {
                console.debug("Session expired");

                Disconnect(connection);
                reportError("Session has expired.");
            });
        }

    }, [connection, 
        sessionId, 
        notifyError, 
        notifySuccess, 
        eventsSubscribedTo, 
        history, 
        location, 
        username, 
        openModal, 
        closeModal,
        setCachedTimeout
    ]);

    // Report error
    function reportError(message) {
        console.error(message);
        setContent(contentStates.ERROR);
        setErrorMessage(message);
    }

    // See results
    function handleOnFinal() {
        console.debug("Getting results...");
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
                            category={category}
                            difficulty={difficulty}
                            reportError={reportError}
                        />
                    </div>
                )
            case contentStates.IN_PROGRESS:
                switch (ruleset.rule.toLowerCase()) {
                    case "race":
                        return (
                            <QuizRaceProgress
                                sessionId={sessionId}
                                questionCount={questionCount}
                                username={username}
                                onFinal={handleOnFinal}
                            />
                        )
                    default:
                        return (
                            <QuizProgress
                                sessionId={sessionId}
                                questionCount={questionCount}
                                questionTimeout={questionTimeout}
                                enableSkip={enableSkip}
                                onFinal={handleOnFinal}
                            />
                        )
                }
            case contentStates.RESULTS:
                return (
                    <QuizResults
                        maxScore={maxScore}
                        username={username}
                        sessionId={sessionId}
                    />
                )
            default:
                return null;
        }
    }

    return (
        <div className={classes.container}>
            {content === contentStates.WAITING || content === contentStates.IN_PROGRESS ?
                <PromptWrapper
                    title="Progress will be lost."
                    message="Leaving this page will result in a disconnect and all progress will be lost. Continue?"
                    when={content !== contentStates.ERROR && content !== contentStates.CONNECTING}
                />
                :
                null
            }
            {getContent(content)}
        </div>
    )
}

export default QuizPage;