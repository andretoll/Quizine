import CodeIcon from '@material-ui/icons/CropFreeOutlined';
import LinkIcon from '@material-ui/icons/LinkOutlined';
import QRCode from 'qrcode.react';
import {
    makeStyles,
    Typography,
    Button
} from '@material-ui/core';

const useStyles = makeStyles(_ => ({

    linkContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
    },

    linkWrapper: {
        display: 'flex',
        alignItems: 'center',
        marginRight: '10px',
        overflowWrap: 'anywhere',

        '& svg': {
            marginRight: '10px',
        }
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

function ShareQuiz(props) {

    const classes = useStyles();

    function getLink() {
        return `${window.location.origin}/join#${props.sessionId}`;
    }

    return (
        <div>
            <div className={classes.linkContainer}>
                <Typography className={classes.linkWrapper} variant="body1">
                    <CodeIcon />
                    <span style={{ textDecoration: 'underline' }}>{props.sessionId}</span>
                </Typography>
                <Button variant="outlined" color="primary" onClick={() => { navigator.clipboard.writeText(props.sessionId) }}>Copy</Button>
            </div>
            <div className={classes.linkContainer}>
                <Typography className={classes.linkWrapper} variant="body1">
                    <LinkIcon />
                    <span style={{ textDecoration: 'underline' }}>{getLink()}</span>
                </Typography>
                <Button variant="outlined" color="primary" onClick={() => { navigator.clipboard.writeText(getLink()) }}>Copy</Button>
            </div>
            <div className={classes.qrContainer}>
                <QRCode renderAs="svg" value={getLink()} size={100} />
            </div>
        </div>
    )
}

export default ShareQuiz;