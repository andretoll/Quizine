import { useState } from 'react';
import QRCode from 'qrcode.react';
import {
    makeStyles,
    Button,
    ClickAwayListener,
    Tooltip
} from '@material-ui/core';

const useStyles = makeStyles(_ => ({

    linksContainer: {
        textAlign: 'center',
        marginBottom: '30px',

        '& button': {
            width: '150px',
            margin: '10px',
        },
    },

    qrContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 'auto',
        width: '110px',
        height: '110px',
        background: '#fff',
    },
}))

function ClickTooltipWrapper(props) {

    const action = props.action;

    const [open, setOpen] = useState(false);

    const handleTooltipClose = () => {
        setOpen(false);
    };

    const handleTooltipOpen = () => {
        action();
        setOpen(true);
    };

    return (
        <ClickAwayListener onClickAway={handleTooltipClose}>
            <Tooltip
                title={props.tooltipTitle}
                open={open}
                onClose={handleTooltipClose}
                placement="right"
                arrow
                disableFocusListener
                disableHoverListener
                disableTouchListener
            >
                <Button variant="outlined" color="primary" onClick={handleTooltipOpen}>{props.actionTitle}</Button>
            </Tooltip>
        </ClickAwayListener>
    )
}

function ShareQuiz(props) {

    const classes = useStyles();

    function getLink() {
        return `${window.location.origin}/join#${props.sessionId}`;
    }

    return (
        <div>
            <div className={classes.linksContainer}>
                <ClickTooltipWrapper tooltipTitle="Copied!" actionTitle="Copy code" action={() => navigator.clipboard.writeText(props.sessionId)} />
                <ClickTooltipWrapper tooltipTitle="Copied!" actionTitle="Copy link" action={() => navigator.clipboard.writeText(getLink())} />
            </div>
            <div className={classes.qrContainer}>
                <QRCode renderAs="svg" value={getLink()} size={100} />
            </div>
        </div>
    )
}

export default ShareQuiz;