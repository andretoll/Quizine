import { useState, useEffect } from 'react';
import QuizChoices from './QuizChoices';
import {
    makeStyles,
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
}));

function QuizRaceForm(props) {

    const classes = useStyles();

    const answers = props.answers;
    const correctAnswerBy = props.correctAnswerBy;
    const username = props.username;
    const lastQuestion = props.lastQuestion;

    const [nextQuestionCountdown, setNextQuestionCountdown] = useState(props.nextQuestionDelay);

    useEffect(() => {

        if (props.nextQuestionDelay > 0)
            startCountdown(props.nextQuestionDelay);

    }, [props.nextQuestionDelay]);

    function startCountdown(initial) {
        let timeleft = initial;
        setNextQuestionCountdown(timeleft);
        console.debug(timeleft);
        timeleft--;

        setInterval(() => {
            if (timeleft >= 0) {
                console.debug(timeleft);
                setNextQuestionCountdown(timeleft);
                timeleft--;
            }
        }, 1000);
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
            <QuizChoices
                answers={answers}
                correctAnswer={props.correctAnswer}
                onSubmit={props.onSubmit}
            />
        </div>
    )
}

export default QuizRaceForm;