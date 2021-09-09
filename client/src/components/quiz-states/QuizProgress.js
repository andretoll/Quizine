import { useEffect, useState, Fragment } from 'react';
import { useConnection } from '../../contexts/HubConnectionContext';
import { NextQuestion, SubmitAnswer } from '../../services/QuizService';
import QuizForm from '../QuizForm';
import StarIcon from '@material-ui/icons/Star';
import StarEmptyIcon from '@material-ui/icons/StarBorder';
import CountdownTimerWrapper from '../CountdownTimerWrapper';
import {
    makeStyles,
    Typography,
    Grid,
    Fade,
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
    },

    textLeft: {
        textAlign: 'center',

        [theme.breakpoints.up('sm')]: {
            textAlign: 'left',
        },
    },

    textRight: {
        textAlign: 'center',

        [theme.breakpoints.up('sm')]: {
            textAlign: 'right',
        },
    },
}));

function QuizProgress(props) {

    const sessionId = props.sessionId;
    const questionCount = props.questionCount;
    const questionTimeout = props.questionTimeout;
    const enableSkip = props.enableSkip;

    const classes = useStyles();

    const { connection } = useConnection();

    const [correctAnswer, setCorrectAnswer] = useState(null);
    const [quizContent, setQuizContent] = useState(null);

    // Quiz slider
    const [slide, setSlide] = useState(true);

    // Timer
    const [timerPlaying, setTimerPlaying] = useState(true);
    const [timerVisible, setTimerVisible] = useState(true);

    useEffect(() => {
        if (connection) {
            connection.on('NextQuestion', (response) => {
                console.info("Received next question");
                setCorrectAnswer(null);
                setSlide(true);         // Trigger slide animation (in)
                setTimerPlaying(true);  // Enable timer
                setTimerVisible(true);  // Show timer
                setQuizContent(response);
            });
            connection.on('ValidateAnswer', (response) => {
                console.info("Received correct answer");
                setCorrectAnswer(response);
            });
        }
    }, [connection]);

    function handleOnTimeout() {
        console.info("Question timed out. Submitting answer...");
        setTimerPlaying(false);
        SubmitAnswer(connection, sessionId, quizContent.id, null);
    }

    function handleOnSubmitAnswer(answer) {
        console.info("Submitting answer...");
        setTimerPlaying(false);
        setTimerVisible(false);
        SubmitAnswer(connection, sessionId, quizContent.id, answer?.id);
    }

    function handleOnNextQuestion() {

        // Trigger slide animation (out)
        setSlide(false);

        setTimeout(() => {
            console.info("Requesting next question...");
            NextQuestion(connection, sessionId); // Request next question
        }, 1000);
    }

    function renderDifficulty() {

        switch (quizContent?.difficulty) {
            case 'easy':
                return (
                    <Fragment>
                        <StarIcon />
                        <StarEmptyIcon />
                        <StarEmptyIcon />
                    </Fragment>
                )
            case 'medium':
                return (
                    <Fragment>
                        <StarIcon />
                        <StarIcon />
                        <StarEmptyIcon />
                    </Fragment>
                )
            case 'hard':
                return (
                    <Fragment>
                        <StarIcon />
                        <StarIcon />
                        <StarIcon />
                    </Fragment>
                )
            default:
                break;
        }
    }

    return (
        <div className={classes.container}>
            {quizContent &&
                <Container className={classes.quizContentWrapper} disableGutters maxWidth="md">
                    <Slide in={slide} timeout={500} direction={slide ? 'left' : 'right'}>
                        <Paper className={classes.quizContent} elevation={10}>
                            <div style={{ padding: '10px' }}>
                                <Grid container alignItems="center">
                                    <Grid item xs={12} sm={5} className={classes.textLeft} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        <Typography variant="overline">{quizContent?.category}</Typography>
                                    </Grid>
                                    <Grid item xs={6} sm={2} style={{ textAlign: 'center' }}>
                                        <Typography variant="overline">{quizContent?.questionIndex} / {questionCount}</Typography>
                                    </Grid>
                                    <Grid item xs={6} sm={5} className={classes.textRight}>
                                        {renderDifficulty()}
                                    </Grid>
                                </Grid>
                                <hr />
                                {questionTimeout > 0 &&
                                    <div className={classes.timerContainer}>
                                        <Fade in={timerVisible} timeout={500}>
                                            <div>
                                                <CountdownTimerWrapper questionTimeout={questionTimeout} on={timerPlaying} onTimeout={handleOnTimeout} />
                                            </div>
                                        </Fade>
                                    </div>
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