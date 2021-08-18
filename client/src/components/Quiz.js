import { useEffect, useState, Fragment } from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { makeStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Slide from '@material-ui/core/Slide';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import StarIcon from '@material-ui/icons/Star';
import StarEmptyIcon from '@material-ui/icons/StarBorder';
import QuizForm from './QuizForm';

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

        [theme.breakpoints.down('xs')]: {
            height: '100%',
        },
    },

    timerContainer: {
        padding: '20px',
        display: 'flex',
        justifyContent: 'center',
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
    function onSubmit() {

        setTimerPlaying(false);
        onSubmitFunction();
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
                <Typography variant="h3">{remainingTime}</Typography>
            </div>
        );
    }

    return (
        <div className={classes.container}>
            {props.questionTimeout > 0 &&
                <div className={classes.timerContainer}>
                    <Slide in={timerPlaying} timeout={500}>
                        <div>
                            <CountdownCircleTimer
                                key={timer}
                                size={100}
                                isPlaying={timerPlaying}
                                duration={props.questionTimeout}
                                strokeWidth={5}
                                strokeLinecap="square"
                                colors={[["#26a300", 0.33], ["#F7B801", 0.33], ["#A30000"]]}>
                                {renderTime}
                            </CountdownCircleTimer>
                        </div>
                    </Slide>
                </div>
            }

            <Container className={classes.quizContentWrapper} disableGutters maxWidth="md">
                <Slide in={slide} timeout={500} direction={slide ? 'left' : 'right'}>
                    <Paper className={classes.quizContent} elevation={5}>
                        <div style={{ padding: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography style={{ fontSize: '1.1em' }} variant="overline">{content.category}</Typography>
                                <Typography variant="overline" style={{ display: 'flex', alignItems: 'center' }}>{getDifficultyContent()}</Typography>
                            </div>
                            <hr />
                        </div>
                        <div style={{ padding: '20px' }}>
                            <Typography variant="h5" style={{ textAlign: 'center' }}>{content.question}</Typography>
                        </div>
                        <QuizForm
                            answers={content.answers}
                            correctAnswer={props.correctAnswer}
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