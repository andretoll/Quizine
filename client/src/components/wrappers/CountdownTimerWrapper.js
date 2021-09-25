import { useEffect, useState } from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { useTimeoutCache } from '../../hooks/useTimeoutCache';
import {
    useTheme,
    Typography
} from '@material-ui/core';

function CountdownTimerWrapper(props) {

    const questionTimeout = props.questionTimeout;
    const isPlaying = props.on;
    const onTimeout = props.onTimeout;

    const theme = useTheme();
    const [timeoutCache, setTimeoutCache] = useTimeoutCache(questionTimeout);

    const [timer, setTimer] = useState(0);
    const [completed, setCompleted] = useState(false);
    const [remainingTime, setRemainingTime] = useState(timeoutCache);

    useEffect(() => {

        if (remainingTime > 0)
            setTimeoutCache(remainingTime);

    }, [remainingTime, setTimeoutCache]);

    useEffect(() => {

        if (isPlaying) {
            setCompleted(false);
            setTimer(prevState => prevState + 1);
        }

    }, [isPlaying]);


    function handleOnCompleted() {
        setCompleted(true);
        onTimeout();
    }

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
            initialRemainingTime={remainingTime}
            strokeWidth={3}
            onComplete={handleOnCompleted}
            strokeLinecap="square"
            trailStrokeWidth={2}
            trailColor={completed ? theme.palette.error.main : theme.palette.text.primary}
            colors={[[theme.palette.success.main, 0.33], [theme.palette.warning.main, 0.50], [theme.palette.error.main, 1]]}>
            {renderTime}
        </CountdownCircleTimer>
    )
}

export default CountdownTimerWrapper;