import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import { 
    makeStyles,
    Button,
    Grid
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({

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
        '-webkit-animation': '$ellipsis 1s infinite',
        '-moz-animation': '$ellipsis 1s infinite',
        '-o-animation': '$ellipsis 1s infinite',
        animation: '$ellipsis 1s infinite',

        '&:hover': {
            background: theme.palette.success.main,
        }
    },

    incorrect: {
        background: theme.palette.error.light,

        '&:hover': {
            background: theme.palette.error.light,
        }
    },

    "@keyframes ellipsis": {
        "50%": {
            background: theme.palette.success.light,
        }
    },
    "@-webkit-keyframes ellipsis": {
        "50%, 100%": {
            background: theme.palette.secondary.main,
        }
    }
}));

function QuizChoices(props) {

    const answers = props.answers;
    const correctAnswer = props.correctAnswer;
    const onSubmit = props.onSubmit;

    const classes = useStyles();

    const [selectedAnswer, setSelectedAnswer] = useState();

    function handleOnClick(answer) {

        if (correctAnswer)
            return;

        setSelectedAnswer(answer?.id);
        onSubmit(answer);
    }

    return (
        <Grid container>
            {answers.map((answer) => {
                const disabledClass = correctAnswer ? classes.disabled : '';
                const correctAnswerClass = correctAnswer === answer.id ? classes.correct : '';
                const incorrectAnswerClass = correctAnswer && selectedAnswer === answer.id && selectedAnswer !== correctAnswer ? classes.incorrect : '';
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
    )
}

export default QuizChoices;