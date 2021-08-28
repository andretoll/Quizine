import { useEffect, useState, Fragment } from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { makeStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Slide from '@material-ui/core/Slide';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import StarIcon from '@material-ui/icons/Star';
import StarEmptyIcon from '@material-ui/icons/StarBorder';
import QuizForm from './QuizForm';

const useStyles = makeStyles(theme => ({

    container: {
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.7)',
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

    textRight: {

        [theme.breakpoints.up('sm')]: {
            textAlign: 'right',
        },
    },
}))

function Quiz(props) {

    const classes = useStyles();

    const content = props.content;

    // Quiz slider
    const [slide, setSlide] = useState(true);

    // Timer
    const [timer, setTimer] = useState(0);
    const [timerPlaying, setTimerPlaying] = useState(true);
    const [remainingTime, setRemainingTime] = useState();

    const onSubmitFunction = props.onSubmit;

    function getDifficultyContent() {

        switch (content.difficulty) {
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

    // On next question
    function onNext() {

        // Trigger slide animation (out)
        setSlide(false);

        setTimeout(() => {
            props.onNext(); // Request next question
            setSlide(true); // Trigger slide animation (in)
            setTimer(prevState => prevState + 1); // Activate new timer
            setTimerPlaying(true); // Set timer status
        }, 1000);
    }

    // On submitting answer manually, pause timer
    function onSubmit(answer) {

        setTimerPlaying(false);
        onSubmitFunction(answer);
    }

    // Send incorrect answer on timeout
    useEffect(() => {

        if (remainingTime === 0)
            onSubmitFunction(null);

    }, [remainingTime, onSubmitFunction]);

    // Render time and update remaining time
    function renderTime({ remainingTime }) {
        setRemainingTime(remainingTime);

        return (
            <div>
                <Typography variant="h5">{remainingTime}</Typography>
            </div>
        );
    }

    return (
        <div className={classes.container}>
            <Container className={classes.quizContentWrapper} disableGutters maxWidth="md">
                <Slide in={slide} timeout={500} direction={slide ? 'left' : 'right'}>
                    <Paper className={classes.quizContent} elevation={10}>
                        <div style={{ padding: '10px' }}>
                            <Grid container alignItems="center">
                                <Grid item xs={12} sm={5} style={{ whiteSpace: 'no-wrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    <Typography variant="overline">{content.category}</Typography>
                                </Grid>
                                <Grid item xs={4} sm={2}>
                                    <Typography variant="overline">{content.questionIndex} / {props.questionCount}</Typography>
                                </Grid>
                                <Grid item xs={4} sm={5} className={classes.textRight}>
                                    {getDifficultyContent()}
                                </Grid>
                            </Grid>
                            <hr />
                            {props.questionTimeout > 0 &&
                                <div className={classes.timerContainer}>
                                    <Fade in={timerPlaying} timeout={500}>
                                        <div>
                                            <CountdownCircleTimer
                                                key={timer}
                                                size={60}
                                                isPlaying={timerPlaying}
                                                duration={props.questionTimeout}
                                                strokeWidth={3}
                                                trailColor={remainingTime === 0 ? '#A30000' : '#d9d9d9'}
                                                strokeLinecap="square"
                                                colors={[["#26a300", 0.33], ["#F7B801", 0.33], ["#A30000"]]}>
                                                {renderTime}
                                            </CountdownCircleTimer>
                                        </div>
                                    </Fade>
                                </div>
                            }
                        </div>
                        <div style={{ padding: '10px' }}>
                            <Typography variant="body1" className={classes.questionText}>{content.question}</Typography>
                        </div>
                        <QuizForm
                            answers={content.answers}
                            correctAnswer={props.correctAnswer}
                            enableSkip={props.enableSkip}
                            onSubmit={onSubmit}
                            onNext={onNext}
                            onFinal={props.onFinal}
                            lastQuestion={content.lastQuestion} />
                    </Paper>
                </Slide>

            </Container>
        </div>
    )
}

export default Quiz;