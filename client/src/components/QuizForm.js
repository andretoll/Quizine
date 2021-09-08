import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import ArrowRightIcon from '@material-ui/icons/ArrowForward';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import SkipIcon from '@material-ui/icons/SkipNext';
import { 
    makeStyles,
    Button,
    Grid
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({

    nextQuestionButton: {
        margin: '10px'
    },

    answerButton: {
        borderRadius: '0',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        fontSize: '1.3em',
        letterSpacing: '1px',
        lineHeight: 'normal',
        height: '60px',
        textTransform: 'none',

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
        '-webkit-animation': '$ellipsis 1s infinite',
        '-moz-animation': '$ellipsis 1s infinite',
        '-o-animation': '$ellipsis 1s infinite',
        animation: '$ellipsis 1s infinite',

        '&:hover': {
            background: '#228b22',
        }
    },

    incorrect: {
        background: '#cd5c5c',

        '&:hover': {
            background: '#cd5c5c',
        }
    },

    "@keyframes ellipsis": {
        "50%": {
            background: '#61b861',
        }
    },
    "@-webkit-keyframes ellipsis": {
        "50%, 100%": {
            background: theme.palette.secondary.main,
        }
    }
}))

function QuizForm(props) {

    const classes = useStyles();

    const [selectedAnswer, setSelectedAnswer] = useState();

    const answers = props.answers;

    function handleOnClick(answer) {

        if (props.correctAnswer)
            return;

        setSelectedAnswer(answer?.id);
        props.onSubmit(answer);
    }

    function handleSkip() {
        handleOnClick(null);
    }

    return (
        <div>
            <div style={{ textAlign: 'right', height: '60px' }}>
                {props.enableSkip && !props.correctAnswer &&
                    <Button
                        className={classes.nextQuestionButton}
                        variant="outlined"
                        size="large"
                        color="primary"
                        endIcon={<SkipIcon />}
                        onClick={handleSkip}>
                        Skip
                    </Button>
                }
                {props.correctAnswer &&
                    <Button
                        className={classes.nextQuestionButton}
                        variant="contained"
                        size="large"
                        color={props.lastQuestion ? 'primary' : 'secondary'}
                        endIcon={<ArrowRightIcon />}
                        onClick={props.lastQuestion ? props.onFinal : props.onNext}>
                        {props.lastQuestion ? 'See results' : 'Next question'}
                    </Button>
                }
            </div>
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

export default QuizForm;