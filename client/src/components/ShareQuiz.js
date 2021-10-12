import { useState } from 'react';
import QRCode from 'qrcode.react';
import {
    FacebookShareButton,
    FacebookIcon,
    FacebookMessengerShareButton,
    FacebookMessengerIcon,
    TwitterShareButton,
    TwitterIcon
} from 'react-share';
import {
    makeStyles,
    Button,
    ClickAwayListener,
    Tooltip,
    Fab
} from '@material-ui/core';

const useStyles = makeStyles(_ => ({

    socialMediaIconWrapper: {
        background: 'transparent',
        transition: 'transform 0.5s',
        margin: '0 5px',

        '&:hover': {
            background: 'transparent',
            transform: 'translateY(-5px)',
        },
    },

    linksContainer: {
        textAlign: 'center',
        marginBottom: '30px',

        '& button': {
            width: '120px',
            margin: '5px',
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

    const [open, setOpen] = useState(false);

    const handleTooltipClose = () => {
        setOpen(false);
    };

    const handleTooltipOpen = () => {
        props.action();
        setOpen(true);
    };

    return (
        <ClickAwayListener onClickAway={handleTooltipClose}>
            <Tooltip
                title={props.tooltipTitle}
                open={open}
                onClose={handleTooltipClose}
                placement="bottom"
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
            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                <FacebookShareButton url={getLink()} quote="Join my quiz!">
                    <Tooltip title="Share on Facebook" arrow placement="top">
                        <Fab className={classes.socialMediaIconWrapper}>
                            <FacebookIcon round size={50} />
                        </Fab>
                    </Tooltip>
                </FacebookShareButton>
                <FacebookMessengerShareButton url={getLink()} appId="352855076618818">
                    <Tooltip title="Share on Messenger" arrow placement="top">
                        <Fab className={classes.socialMediaIconWrapper}>
                            <FacebookMessengerIcon round size={50} />
                        </Fab>
                    </Tooltip>
                </FacebookMessengerShareButton>
                <TwitterShareButton url={getLink()} title="Join my quiz!">
                    <Tooltip title="Share on Twitter" arrow placement="top">
                        <Fab className={classes.socialMediaIconWrapper}>
                            <TwitterIcon round size={50} />
                        </Fab>
                    </Tooltip>
                </TwitterShareButton>
            </div>
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