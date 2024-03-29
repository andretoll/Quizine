import { useEffect, useState } from 'react';
import { useConfirm } from 'material-ui-confirm';
import { Start } from '../../services/QuizService';
import { sendNotification, requestNotificationsPermission, getNotificationsPermission } from '../../services/NotificationService';
import { useConnection } from '../../contexts/HubConnectionContext';
import ShareQuiz from '../ShareQuiz';
import PlayerList from '../PlayerList';
import QuizParametersList from '../QuizParametersList';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import NotificationsOffIcon from '@material-ui/icons/NotificationsOff';
import ShareIcon from '@material-ui/icons/Share';
import {
    makeStyles,
    Container,
    Paper,
    Typography,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
    Tooltip
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({

    notificationsActive: {
        pointerEvents: 'none',
        color: theme.palette.primary.main,
    },
}));

function QuizWaiting(props) {

    const classes = useStyles();

    const sessionId = props.sessionId;
    const username = props.username;
    const quizTitle = props.quizTitle;
    const expectedPlayers = props.expectedPlayers;
    const players = props.players;
    const questionCount = props.questionCount;
    const questionTimeout = props.questionTimeout;
    const ruleset = props.ruleset;
    const category = props.category;
    const difficulty = props.difficulty;
    const reportError = props.reportError;

    const { connection } = useConnection();
    const confirm = useConfirm();

    const [shareDialogOpen, setShareDialogOpen] = useState(false);
    const [notificationsPermission, setNotificationsPermission] = useState(getNotificationsPermission());

    // When any new player joins
    useEffect(() => {

        // When all players have joined, send notifications
        if (expectedPlayers > 1 && players.length === expectedPlayers) {
            sendNotification("Quizine", "All players are ready to go!", () => {
                window.focus();
            });
        }
    }, [players, expectedPlayers]);

    // Request permission for notifications
    function handleNotificationsPermission() {

        try {

            requestNotificationsPermission().then((response) => {
                console.info("Request notifications: " + response);
                setNotificationsPermission(response);
            }).catch((error) => {
                console.error(error);
            });
        } catch (error) {
            console.error("Unexpected error when requesting permission to push notifications")
        }
    }

    function handleOnStart() {

        const allReady = expectedPlayers === players.length;

        if (connection) {

            // Not all players have joined
            if (!allReady) {
                confirm({
                    title: 'Confirm?',
                    description: 'Not all players are ready. Start quiz anyway?',
                    confirmationText: 'Yes',
                    cancellationText: 'No',
                    dialogProps: { PaperProps: { className: "secondary-background" } }
                }).then(() => {
                    console.info("Starting session...");
                    Start(connection, sessionId).catch((error) => {
                        console.error(error);
                        reportError("Failed to start session (Error code 2).")
                    });
                }).catch(() => { });
            }
            // All players have joined
            else {
                console.info("Starting session...");
                Start(connection, sessionId).catch((error) => {
                    console.error(error);
                    reportError("Failed to start session (Error code 2).")
                });
            }
        }
    }

    // Open share dialog
    function handleOnOpenShareDialog() {
        setShareDialogOpen(true);
    }

    // Close share dialog
    function handleOnCloseShareDialog() {
        setShareDialogOpen(false);
    }

    // Get message during waiting state
    function getWaitingMessage() {

        if (players[0] !== username && expectedPlayers === players.length) {
            return (
                <Typography variant="h6" className="loadingAnimation" style={{ marginTop: '15px' }}>
                    Waiting for <span className="primary-color">{players[0]}</span> to start
                </Typography>
            )
        }
    }

    function getNotificationsTooltipText() {

        switch (notificationsPermission) {
            case 'default':
                return 'Enable notifications.';
            case 'granted':
                return 'Notifications enabled.';
            case 'denied':
                return 'Notifications blocked.';
            default:
                break;
        }
    }

    return (
        <Container maxWidth="sm">
            <Paper elevation={10} className="secondary-background">
                <div style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="h3" style={{ textAlign: 'center' }} gutterBottom>{quizTitle}</Typography>
                        <div>
                            <Tooltip title={getNotificationsTooltipText()} arrow>
                                <span>
                                    <IconButton onClick={handleNotificationsPermission} className={notificationsPermission === 'granted' ? classes.notificationsActive : ''} disabled={notificationsPermission === 'denied'}>
                                        {notificationsPermission === 'granted' ?
                                            <NotificationsActiveIcon />
                                            :
                                            <NotificationsOffIcon />
                                        }
                                    </IconButton>
                                </span>
                            </Tooltip>
                            <Tooltip title="Share quiz" arrow>
                                <IconButton onClick={(handleOnOpenShareDialog)} style={{ height: 'fit-content' }}>
                                    <ShareIcon />
                                </IconButton>
                            </Tooltip>
                        </div>
                        <Dialog open={shareDialogOpen} onClose={handleOnCloseShareDialog} PaperProps={{ className: 'secondary-background' }}>
                            <DialogTitle>Share Quiz</DialogTitle>
                            <DialogContent dividers style={{ padding: '50px' }}>
                                <ShareQuiz sessionId={sessionId} />
                            </DialogContent>
                        </Dialog>
                    </div>
                    <div>
                        <QuizParametersList
                            questionCount={questionCount}
                            questionTimeout={questionTimeout}
                            ruleset={ruleset}
                            category={category}
                            difficulty={difficulty}
                        />
                    </div>
                    <hr />
                    <PlayerList expectedPlayers={expectedPlayers} players={players} username={username} />
                    <hr />
                    {getWaitingMessage()}
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        {players[0] === username &&
                            <Button onClick={handleOnStart} variant={(expectedPlayers === players.length) ? 'contained' : 'outlined'} color="primary" size="large">
                                Start
                            </Button>
                        }
                    </div>
                </div>
            </Paper>
        </Container>
    )
}

export default QuizWaiting;