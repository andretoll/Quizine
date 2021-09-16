import { useEffect, useState } from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import {
    useTheme,
    Typography
} from '@material-ui/core';

function CountdownTimerWrapper(props) {

    const questionTimeout = props.questionTimeout;
    const isPlaying = props.on;
    const onTimeout = props.onTimeout;

    const theme = useTheme();
    const [timer, setTimer] = useState(0);
    const [completed, setCompleted] = useState(false);

    useEffect(() => {

        if (isPlaying) {
            setTimeout(false);
            setTimer(prevState => prevState + 1);
        }

    }, [isPlaying]);

    useEffect(() => {

        if (completed) {
            onTimeout();
        }
    }, [completed, onTimeout])

    function renderTime({ remainingTime }) {

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
            strokeLinecap="square"
            trailStrokeWidth={2}
            trailColor={completed ? theme.palette.error.main : theme.palette.text.primary}
            colors={[[theme.palette.success.main, 0.33], [theme.palette.warning.main, 0.50], [theme.palette.error.main, 1]]}>
            {renderTime}
        </CountdownCircleTimer>
    )
}

export default CountdownTimerWrapper;