import { useEffect, useState } from 'react';
import { useConnection } from '../../contexts/HubConnectionContext';
import { SubmitAnswer } from '../../services/QuizService';
import QuizRaceForm from '../quiz-progress/QuizRaceForm';
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
}));

function QuizRaceProgress(props) {

    const sessionId = props.sessionId;
    const questionCount = props.questionCount;
    const onFinal = props.onFinal;

    const classes = useStyles();

    const { connection } = useConnection();

    const [eventsSubscribedTo, setEventsSubscribedTo] = useState(false);
    const [correctAnswer, setCorrectAnswer] = useState(null);
    const [quizContent, setQuizContent] = useState(null);
    const [nextQuestionDelay, setNextQuestionDelay] = useState();
    const [correctAnswerBy, setCorrectAnswerBy] = useState();

    // Quiz slider
    const [slide, setSlide] = useState(false);

    useEffect(() => {
        if (connection && !eventsSubscribedTo) {
            connection.on('NextQuestion', (response) => {
                console.info("Received next question");
                setSlide(false);
                setCorrectAnswer(null);

                setTimeout(() => {
                    setCorrectAnswerBy(null);
                    setNextQuestionDelay(null);
                    setSlide(true);         // Trigger slide animation (in)
                    setQuizContent(response);
                }, 500);
            });
            connection.on('ValidateAnswer', (response) => {
                console.info("Received correct answer");
                setCorrectAnswer(response.answerId);
                setCorrectAnswerBy(response.answeredBy);
            });
            connection.on('NextQuestionIncoming', (response) => {
                console.info("Received next question incoming");
                setNextQuestionDelay(response);
            });
            connection.on('TriggerResults', (_) => {
                console.info("Received trigger results");
                onFinal();
            });

            setEventsSubscribedTo(true);
        }
    }, [connection, eventsSubscribedTo, onFinal]);

    function handleOnSubmitAnswer(answer) {
        console.info("Submitting answer...");
        SubmitAnswer(connection, sessionId, quizContent.id, answer?.id);
    }

    return (
        <div className={classes.container}>
            {quizContent &&
                <Container className={classes.quizContentWrapper} disableGutters maxWidth="md">
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
                            </div>
                            <div style={{ padding: '10px' }}>
                                <Typography variant="body1" className={classes.questionText}>{quizContent?.question}</Typography>
                            </div>
                            <QuizRaceForm
                                answers={quizContent?.answers}
                                correctAnswer={correctAnswer}
                                nextQuestionDelay={nextQuestionDelay}
                                correctAnswerBy={correctAnswerBy}
                                username={props.username}
                                onSubmit={handleOnSubmitAnswer}
                            />
                        </Paper>
                    </Slide>

                </Container>
            }
        </div>
    )
}

export default QuizRaceProgress;