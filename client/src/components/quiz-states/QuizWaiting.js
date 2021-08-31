import { useContext, useEffect, useState } from 'react';
import { useConfirm } from 'material-ui-confirm';
import { Start } from '../../services/QuizService';
import { sendNotification } from '../../services/NotificationService';
import { HubConnectionContext } from '../../contexts/HubConnectionContext';
import ShareQuiz from '../ShareQuiz';
import PlayerList from '../PlayerList';
import ShareIcon from '@material-ui/icons/Share';
import {
    Container,
    Paper,
    Typography,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    Button
} from '@material-ui/core';

function QuizWaiting(props) {

    const sessionId = props.sessionId;
    const username = props.username;
    const quizTitle = props.quizTitle;
    const expectedPlayers = props.expectedPlayers;
    const players = props.players;

    const { connection } = useContext(HubConnectionContext);
    const confirm = useConfirm();

    const [shareDialogOpen, setShareDialogOpen] = useState(false);

    // When any new player joins
    useEffect(() => {

        if (expectedPlayers > 1 && players.length === expectedPlayers) {
            sendNotification("Quizine", "All players are ready to go!", () => {
                window.focus();
            });
        }
    }, [players, expectedPlayers])

    function handleOnStart() {

        const allReady = expectedPlayers === players.length;

        if (connection) {
            try {
                if (!allReady) {
                    confirm({
                        title: 'Confirm?',
                        description: 'Not all players are ready. Start quiz anyway?',
                        confirmationText: 'Yes',
                        cancellationText: 'No',
                        dialogProps: { PaperProps: { className: "secondary-background" } }
                    }).then(() => {
                        Start(connection, sessionId);
                    }).catch(() => { });
                } else {
                    Start(connection, sessionId);
                }
            } catch (error) {
                //TODO: Show error message
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

        if (expectedPlayers !== players.length) {
            return (
                <Typography variant="h6" className="loadingAnimation">
                    Waiting for other players
                </Typography>
            );
        } else if (players[0] !== username) {
            return (
                <Typography variant="h6" className="loadingAnimation">
                    Waiting for Player 1 to start
                </Typography>
            )
        }
    }

    return (
        <Container maxWidth="sm">
            <Paper elevation={10} className="secondary-background">
                <div style={{ padding: '20px' }}>
                    <div className="primary-color" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="h3" style={{ textAlign: 'center' }} gutterBottom>{quizTitle}</Typography>
                        <IconButton onClick={(handleOnOpenShareDialog)} style={{ height: 'fit-content' }}>
                            <ShareIcon />
                        </IconButton>
                        <Dialog open={shareDialogOpen} onClose={handleOnCloseShareDialog} PaperProps={{className: 'secondary-background'}}>
                            <DialogTitle>Share Quiz</DialogTitle>
                            <DialogContent dividers>
                                <DialogContentText>
                                    Share the quiz to your friends (or rivals) so that they may join this EPIC battle!
                                </DialogContentText>
                                <ShareQuiz sessionId={sessionId} />
                            </DialogContent>
                        </Dialog>
                    </div>
                    {getWaitingMessage()}
                    <hr />
                    <PlayerList expectedPlayers={expectedPlayers} players={players} username={username} />
                    <hr />
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        {players[0] === username &&
                            <Button onClick={handleOnStart} variant={(expectedPlayers === players.length) ? 'contained' : 'outlined'} color="primary">
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