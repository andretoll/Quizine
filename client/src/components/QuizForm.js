import { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({

    active: {
        background: 'green',
    },
}))

function QuizForm(props) {

    const classes = useStyles();

    const [selectedAnswer, setSelectedAnswer] = useState();

    const answers = props.answers;

    function handleOnClick(answer) {

        setSelectedAnswer(answer);
        props.onSubmit(answer);
    }

    return (
        <div>
            {answers.map((answer) => {
                const className = props.correctAnswer === answer.id ? classes.active : "";
                return (
                    <Button className={className} variant={selectedAnswer === answer.id ? 'outlined' : 'contained'} key={answer.id} onClick={() => handleOnClick(answer.id)}>{answer.value}</Button>
                )
            })}
            {props.correctAnswer &&
                <div>
                    {props.lastQuestion ?
                        <Button onClick={props.onFinal}>See results</Button>
                        : <Button onClick={props.onNext}>Next question</Button>
                    }

                </div>
            }
        </div>
    )
}

export default QuizForm;