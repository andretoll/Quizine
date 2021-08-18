import { useEffect, useState, Fragment } from 'react';
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
        justifyContent: 'space-between',
    },

    quizContentWrapper: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
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
}))

function Quiz(props) {

    const classes = useStyles();

    const [slide, setSlide] = useState(false);

    const content = props.content;

    useEffect(() => {

        // Trigger slide animation
        setSlide(true);
    }, []);

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

        // Trigger slide animation, and call parent function
        setSlide(false);
        setTimeout(() => {
            props.onNext();
            setSlide(true);
        }, 1000);
    }

    return (
        <div className={classes.container}>
            <div style={{ height: '100px', background: 'black' }}>
                TIME
            </div>
            <Container className={classes.quizContentWrapper} disableGutters maxWidth="md">
                <Slide in={slide} timeout={500} direction={slide ? 'left' : 'right'}>
                    <Paper className={classes.quizContent} elevation={5}>
                        <div style={{ padding: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography style={{fontSize: '1.1em'}} variant="overline">{content.category}</Typography>
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
                            onSubmit={props.onSubmit}
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