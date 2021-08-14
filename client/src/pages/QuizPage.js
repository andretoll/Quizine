import { useEffect, useState } from "react";
import { useHistory } from 'react-router';
import { useLocation } from "react-router-dom";
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { makeStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import ShareIcon from '@material-ui/icons/Share';
import ShareQuiz from '../components/ShareQuiz';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import PlayerList from "../components/PlayerList";

const useStyles = makeStyles(theme => ({

    container: {
        background: theme.palette.gradient.main,
    },

    centeredContent: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
    },

    loadingAnimation: {

        '&:after': {
            overflow: 'hidden',
            display: 'inline-block',
            verticalAlign: 'bottom',
            '-webkit-animation': '$ellipsis steps(14, end) 900ms infinite',
            animation: '$ellipsis steps(14, end) 900ms infinite',
            content: '"\\2026"',
            width: '0px'
        }
    },

    "@keyframes ellipsis": {
        "to": {
            width: '1.25em',
        }
    },
    "@-webkit-keyframes ellipsis": {
        "to": {
            width: '1.25e',
        }
    }
}))

const contentStates = Object.freeze({
    CONNECTING: 1,
    ERROR: 2,
    WAITING: 3,
    IN_PROGRESS: 4,
    RESULTS: 5
})

function QuizPage() {

    const classes = useStyles();

    const [connection, setConnection] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [username, setUsername] = useState();
    const [expectedPlayers, setExpectedPlayers] = useState();
    const [players, setPlayers] = useState([]);
    const [quizTitle, setQuizTitle] = useState();
    const [content, setContent] = useState(contentStates.CONNECTING);
    const [shareDialogOpen, setShareDialogOpen] = useState(false);

    const history = useHistory();
    const location = useLocation();
    const sessionId = location.state.sessionId;

    useEffect(() => {

        const newConnection = new HubConnectionBuilder()
            .withUrl('https://localhost:5001/hubs/quiz')
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Error)
            .build();

        setConnection(newConnection);
    }, []);

    useEffect(() => {

        if (!location.state)
            history.push("/join");

        if (connection) {
            connection.start()
                .then(_ => {

                    setUsername(location.state.username);

                    connection.on('ConfirmConnect', (response) => {

                        if (response.connected) {
                            setQuizTitle(response.quizTitle);
                            setExpectedPlayers(response.expectedUsers);
                            setPlayers(response.users);
                            setContent(contentStates.IN_PROGRESS);
                        } else {
                            reportError(response.errorMessage);
                        }
                    });

                    connection.send('Connect', location.state.sessionId, location.state.username);

                    connection.on('ConfirmDisconnect', (response) => {
                        setPlayers(response.users);
                    });

                    connection.on('ConfirmStart', (response) => {
                        
                        if (response) {
                            setContent(contentStates.IN_PROGRESS);
                        }
                    });

                    connection.onclose(function (e) {
                        reportError("Lost server connection.");
                    })
                })
                .catch(e => {
                    console.log(e);
                    reportError("Failed to connect to server.");
                });
        }

        window.onpopstate = ((e) => {

            if (connection && connection.connectionState === "Connected")
                connection.send('Disconnect');
        });

    }, [connection, history, location]);

    function reportError(message) {
        console.log(message);
        setContent(contentStates.ERROR);
        setErrorMessage(message);
    }

    function handleOnOpenShareDialog() {
        setShareDialogOpen(true);
    }

    function handleOnCloseShareDialog() {
        setShareDialogOpen(false);
    }

    function handleOnStart() {

        const ready = ((expectedPlayers === players.length) || (expectedPlayers !== players.length && window.confirm("Not all players connected. Continue?")));

        if (ready) {
            try {
                connection.send('Start', sessionId);
            } catch (error) {
                console.log(error);
                reportError("Failed to start quiz.");
            }
        }
    }

    function getContent(state) {

        switch (state) {
            case contentStates.ERROR:
                return (
                    <div className={classes.centeredContent}>
                        <Typography variant="h1" color="error">
                            {errorMessage}
                        </Typography>
                    </div>
                )
            case contentStates.CONNECTING:
                return (
                    <div className={classes.centeredContent}>
                        <Container maxWidth="sm">
                            <Paper elevation={10}>
                                <div style={{ padding: '20px' }}>
                                    <Typography variant="h6" className={classes.loadingAnimation}>Connecting</Typography>
                                </div>
                            </Paper>
                        </Container>
                    </div>
                )
            case contentStates.WAITING:
                return (
                    <div className={classes.centeredContent}>
                        <Container maxWidth="sm">
                            <Paper elevation={10}>
                                <div style={{ padding: '20px' }}>
                                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                        <Typography variant="h3" style={{ textAlign: 'center' }} gutterBottom>{quizTitle}</Typography>
                                        <IconButton onClick={handleOnOpenShareDialog} style={{height: 'fit-content'}}>
                                            <ShareIcon />
                                        </IconButton>
                                        <Dialog open={shareDialogOpen} onClose={handleOnCloseShareDialog}>
                                            <DialogTitle>Share Quiz</DialogTitle>
                                            <DialogContent dividers> 
                                                <DialogContentText>
                                                    Share the quiz to your friends (or rivals) so that they may join this EPIC battle!
                                                </DialogContentText>
                                                <ShareQuiz sessionId={sessionId} />
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                    {expectedPlayers !== players.length && <Typography variant="h6" className={classes.loadingAnimation}>Waiting for other players</Typography>}
                                    <hr />
                                    <PlayerList expectedPlayers={expectedPlayers} players={players} username={username} />
                                    <hr />
                                    <div style={{textAlign: 'center'}}>
                                        {players[0] === username && <Button onClick={handleOnStart} variant="contained" color="primary">Start</Button>}
                                    </div>
                                </div>
                            </Paper>
                        </Container>
                    </div>
                )
            case contentStates.IN_PROGRESS:
                return (
                    <div>In progress!</div>
                )
            case contentStates.RESULTS:
                return (
                    <div>Results</div>
                )
            default:
                return null;
        }
    }

    return (
        <div className={classes.container}>
            {getContent(content)}
        </div>
    )
}

export default QuizPage;