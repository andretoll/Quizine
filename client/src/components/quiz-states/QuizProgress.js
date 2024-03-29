import { useEffect, useState } from 'react';
import { useConnection } from '../../contexts/HubConnectionContext';
import { useTimeoutCache } from '../../hooks/useTimeoutCache';
import { NextQuestion, SubmitAnswer } from '../../services/QuizService';
import CountdownTimerWrapper from '../wrappers/CountdownTimerWrapper';
import QuizForm from '../quiz-progress/QuizForm';
import QuizCardHeader from '../quiz-progress/QuizCardHeader';
import {
    makeStyles,
    Typography,
    Slide,
    Paper,
    Container,
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({

    container: {
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },

    quizContentWrapper: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',

        [theme.breakpoints.down('xs')]: {
            height: '100%',
        },
    },

    quizContent: {
        minHeight: '500px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: theme.palette.gradient.main,

        [theme.breakpoints.down('xs')]: {
            height: '100%',
            borderRadius: '0',
        },
    },

    questionText: {
        fontSize: '1.2em',
        textAlign: 'center',

        [theme.breakpoints.up('md')]: {
            fontSize: '1.5em',
        },
    },

    timerContainer: {
        padding: '20px',
        display: 'flex',
        justifyContent: 'center',
        height: '60px',
    },

    pointsPopup: {
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        '-webkit-animation': '$points 3s ease-out',
        '-moz-animation': '$points 3s ease-out',
        '-o-animation': '$points 3s ease-out',
        animation: '$points 3s ease-out',
        opacity: '0',
    },

    "@keyframes points": {
        "from": {
            opacity: '1',
            transform: 'translate(-50%, 0px)',
        },
        "to": {
            opacity: '0',
            transform: 'translate(-50%, -100px)',
        }
    },

    "@-webkit-keyframes points": {
        "from": {
            opacity: '1',
            transform: 'translate(-50%, 0px)',
        },
        "to": {
            opacity: '0',
            transform: 'translate(-50%, -100px)',
        }
    },
}));

function QuizProgress(props) {

    const sessionId = props.sessionId;
    const questionCount = props.questionCount;
    const questionTimeout = props.questionTimeout;
    const enableSkip = props.enableSkip;

    const classes = useStyles();

    const { connection } = useConnection();
    const [, setTimeoutCache] = useTimeoutCache(questionTimeout);

    const [eventsSubscribedTo, setEventsSubscribedTo] = useState(false);
    const [correctAnswer, setCorrectAnswer] = useState(null);
    const [quizContent, setQuizContent] = useState(null);
    const [pointsGained, setPointsGained] = useState(null);

    // Quiz slider
    const [slide, setSlide] = useState(true);

    // Timer
    const [timerPlaying, setTimerPlaying] = useState(true);

    useEffect(() => {
        if (connection && !eventsSubscribedTo) {
            setEventsSubscribedTo(true);

            connection.on('NextQuestion', (response) => {
                console.debug("Received next question");
                setCorrectAnswer(null);
                setPointsGained(null);
                setSlide(true);             // Trigger slide animation (in)
                setTimerPlaying(false);     // Disable timer (reset)
                setTimerPlaying(true);      // Enable timer (reset)
                setQuizContent(response);
            });
            connection.on('ValidateAnswer', (response) => {
                console.debug("Received correct answer");
                setCorrectAnswer(response.answerId);
                setPointsGained(response.points);
                setTimeoutCache(questionTimeout); // Reset timer despite cache
            });
        }
    }, [connection, questionTimeout, setTimeoutCache, eventsSubscribedTo]);

    function handleOnTimeout() {
        console.debug("Question timed out. Submitting answer...");
        SubmitAnswer(connection, sessionId, quizContent.id, null);
    }

    function handleOnSubmitAnswer(answer) {
        console.debug("Submitting answer...");
        setTimerPlaying(false);
        SubmitAnswer(connection, sessionId, quizContent.id, answer?.id);
    }

    function handleOnNextQuestion() {

        // Trigger slide animation (out)
        setSlide(false);

        // Request next question with timeout
        setTimeout(() => {
            console.debug("Requesting next question...");
            NextQuestion(connection, sessionId); 
        }, 1000);
    }

    function getPointsGained() {

        if (pointsGained < 0) {
            return (
                <Typography variant="h3" color="error">
                    {pointsGained}
                </Typography>
            )
        } else if (pointsGained > 0) {
            return (
                <Typography variant="h3" color="primary">
                    +{pointsGained}
                </Typography>
            )
        }
    }

    return (
        <div className={classes.container}>
            {quizContent &&
                <Container className={classes.quizContentWrapper} disableGutters maxWidth="md">
                    {pointsGained ?
                        <div className={classes.pointsPopup}>
                            {getPointsGained()}
                        </div>
                        : null
                    }
                    <Slide in={slide} timeout={500} direction={slide ? 'left' : 'right'}>
                        <Paper className={classes.quizContent} elevation={10}>
                            <div style={{ padding: '10px' }}>
                                <QuizCardHeader
                                    category={quizContent?.category}
                                    difficulty={quizContent?.difficulty}
                                    questionIndex={quizContent?.questionIndex}
                                    questionCount={questionCount}
                                />
                                <hr />
                                {questionTimeout ?
                                    <div className={classes.timerContainer}>
                                        {timerPlaying &&
                                            <CountdownTimerWrapper questionTimeout={questionTimeout} on={timerPlaying} onTimeout={handleOnTimeout} />
                                        }
                                    </div>
                                    :
                                    null
                                }
                            </div>
                            <div style={{ padding: '10px' }}>
                                <Typography variant="body1" className={classes.questionText}>{quizContent?.question}</Typography>
                            </div>
                            <QuizForm
                                answers={quizContent?.answers}
                                correctAnswer={correctAnswer}
                                enableSkip={enableSkip}
                                onSubmit={handleOnSubmitAnswer}
                                onNext={handleOnNextQuestion}
                                onFinal={props.onFinal}
                                lastQuestion={quizContent?.lastQuestion} />
                        </Paper>
                    </Slide>

                </Container>
            }
        </div>
    )
}

export default QuizProgress;