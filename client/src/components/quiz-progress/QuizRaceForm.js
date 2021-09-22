import { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import {
    makeStyles,
    Button,
    Grid,
    Typography,
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({

    nextQuestionContainer: {
        textAlign: 'center',
    },

    nextQuestionWrapper: {
        padding: '10px',
        background: theme.palette.secondary.main,
    },

    answerButton: {
        borderRadius: '0',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        fontSize: '1.3em',
        letterSpacing: '1px',
        lineHeight: 'normal',
        height: '60px',
        textTransform: 'none',
        color: '#fff',

        [theme.breakpoints.up('sm')]: {
            fontSize: '1.5em',
            height: '80px',
        },
    },

    disabled: {
        pointerEvents: 'none',
        background: theme.palette.secondary.dark,
    },

    correct: {
        '-webkit-animation': '$blink 1s ease-in-out infinite',
        '-moz-animation': '$blink 1s ease-in-outinfinite',
        '-o-animation': '$blink 1s ease-in-out infinite',
        animation: '$blink 1s ease-in-out infinite',

        '&:hover': {
            background: '#228b22',
        }
    },

    incorrect: {
        background: theme.palette.error.main,

        '&:hover': {
            background: '#cd5c5c',
        }
    },

    "@keyframes blink": {
        "50%": {
            background: '#61b861',
        }
    },
    "@-webkit-keyframes blink": {
        "to": {
            background: '#61b861',
        }
    }
}))

function QuizRaceForm(props) {

    const classes = useStyles();

    const correctAnswerBy = props.correctAnswerBy;
    const username = props.username;
    const lastQuestion = props.lastQuestion;

    const [selectedAnswer, setSelectedAnswer] = useState();
    const [nextQuestionCountdown, setNextQuestionCountdown] = useState(props.nextQuestionDelay);

    const answers = props.answers;

    useEffect(() => {

        if (props.nextQuestionDelay > 0)
            startCountdown(props.nextQuestionDelay);

    }, [props.nextQuestionDelay]);

    function startCountdown(initial) {
        let timeleft = initial;
        setNextQuestionCountdown(timeleft);
        console.trace(timeleft);
        timeleft--;

        setInterval(() => {
            if (timeleft >= 0) {
                console.trace(timeleft);
                setNextQuestionCountdown(timeleft);
                timeleft--;
            }
        }, 1000);
    }

    function handleOnClick(answer) {

        if (props.correctAnswer)
            return;

        setSelectedAnswer(answer?.id);
        props.onSubmit(answer);
    }

    return (
        <div>
            {nextQuestionCountdown > 0 &&
                <div className={classes.nextQuestionContainer}>
                    <div className={classes.nextQuestionWrapper}>
                        {correctAnswerBy &&
                            <Typography variant="h5" color={correctAnswerBy === username ? 'primary' : 'error'}>{correctAnswerBy === username ? 'You' : correctAnswerBy} answered correctly!</Typography>
                        }
                        {lastQuestion ?
                            <Typography variant="body1">Quiz ends in <span className="primary-color">{nextQuestionCountdown}</span> seconds...</Typography>
                            :
                            <Typography variant="body1">Next question in <span className="primary-color">{nextQuestionCountdown}</span> seconds...</Typography>
                        }
                    </div>
                </div>
            }
            <Grid container>
                {answers.map((answer) => {
                    const disabledClass = props.correctAnswer ? classes.disabled : null;
                    const correctAnswerClass = props.correctAnswer === answer.id ? classes.correct : null;
                    const incorrectAnswerClass = props.correctAnswer && selectedAnswer === answer.id && selectedAnswer !== props.correctAnswer ? classes.incorrect : null;
                    var icon;

                    if (correctAnswerClass) {
                        icon = <CheckIcon style={{ fontSize: '1.5em' }} />
                    } else if (incorrectAnswerClass) {
                        icon = <ClearIcon style={{ fontSize: '1.5em' }} />
                    }

                    return (
                        <Grid item xs={12} sm={6} key={uuid()}>
                            <Button
                                startIcon={icon}
                                className={`${classes.answerButton} ${disabledClass} ${correctAnswerClass} ${incorrectAnswerClass}`}
                                fullWidth
                                variant="contained"
                                color="secondary"
                                onClick={() => handleOnClick(answer)}>
                                {answer.value}
                            </Button>
                        </Grid>
                    )
                })}
            </Grid>
        </div>
    )
}

export default QuizRaceForm;