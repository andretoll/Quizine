import ArrowRightIcon from '@material-ui/icons/ArrowForward';
import SkipIcon from '@material-ui/icons/SkipNext';
import QuizChoices from './QuizChoices';
import {
    makeStyles,
    Button,
} from '@material-ui/core';

const useStyles = makeStyles(_ => ({

    nextQuestionButton: {
        margin: '10px'
    },
}));

function QuizForm(props) {

    const classes = useStyles();

    const answers = props.answers;
    const onSubmit = props.onSubmit;

    function handleSkip() {
        onSubmit(null);
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
                        {props.lastQuestion ? 'Finish' : 'Next question'}
                    </Button>
                }
            </div>
            <QuizChoices
                answers={answers}
                correctAnswer={props.correctAnswer}
                onSubmit={onSubmit}
            />
        </div>
    )
}

export default QuizForm;