import { useEffect, useState } from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import {
    Typography
} from '@material-ui/core';

function CountdownTimerWrapper(props) {

    const questionTimeout = props.questionTimeout;
    const isPlaying = props.on;
    const onTimeout = props.onTimeout;

    const [timer, setTimer] = useState(0);
    const [remainingTime, setRemainingTime] = useState();
    const [completed, setCompleted] = useState(false);

    useEffect(() => {

        if (isPlaying) {
            setTimer(prevState => prevState + 1);
        }

    }, [isPlaying]);

    useEffect(() => {

        if (completed) {
            onTimeout();
            setCompleted(false);
        }
    }, [completed, onTimeout])

    function renderTime({ remainingTime }) {
        setRemainingTime(remainingTime);

        return (
            <div>
                <Typography variant="h5">{remainingTime}</Typography>
            </div>
        );
    }

    return (
        <CountdownCircleTimer
            key={timer}
            size={60}
            isPlaying={isPlaying}
            duration={questionTimeout}
            strokeWidth={3}
            onComplete={() => setCompleted(true)}
            trailColor={remainingTime === 0 ? '#A30000' : '#d9d9d9'}
            strokeLinecap="square"
            colors={[["#26a300", 0.33], ["#F7B801", 0.33], ["#A30000"]]}>
            {renderTime}
        </CountdownCircleTimer>
    )
}

export default CountdownTimerWrapper;