import { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useConfirm } from 'material-ui-confirm';
import { useConnection } from '../../contexts/HubConnectionContext';
import { sendNotification } from '../../services/NotificationService';
import { FetchAnswers, Join, PromptRematch, Rematch } from '../../services/QuizService';
import { useErrorModal } from '../../contexts/ErrorModalContext';
import ConfettiWrapper from '../wrappers/ConfettiWrapper';
import GoHome from '../GoHome';
import CheatSheet from '../quiz-results/CheatSheet';
import ResultsTable from '../quiz-results/ResultsTable';
import MenuIcon from '@material-ui/icons/MoreVert';
import RematchIcon from '@material-ui/icons/FlashOn';
import ListIcon from '@material-ui/icons/ListAlt';
import AddIcon from '@material-ui/icons/AddBox';
import {
    makeStyles,
    Typography,
    IconButton,
    Container,
    AppBar,
    Toolbar,
    Tooltip,
    Menu,
    MenuItem,
    FormControlLabel,
    FormGroup,
    Divider,
    Checkbox,
    ListItemIcon,
    ListItemText,
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({

    container: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
    },

    header: {
        display: 'flex',
        flex: '1',
        justifyContent: 'center',
        alignItems: 'flex-start',
        position: 'relative',
    },
}));

function QuizResults(props) {

    const username = props.username;
    const maxScore = props.maxScore;
    const sessionId = props.sessionId;

    const classes = useStyles();

    const { connection } = useConnection();
    const { openModal } = useErrorModal();
    const confirm = useConfirm();

    const [quizCompleted, setQuizCompleted] = useState(false);
    const [finalScore, setFinalScore] = useState([]);
    const [cheatSheet, setCheatSheet] = useState(null);

    const [anchorEl, setAnchorEl] = useState(null);
    const [confetti, setConfetti] = useState(true);
    const [cheatSheetModalOpen, setCheatSheetModalOpen] = useState(false);

    const history = useHistory();

    const joinRematch = useCallback((data) => {

        confirm({
            title: <Typography><span className="primary-color">{data?.username}</span> wants a rematch!</Typography>,
            description: 'Do you accept?',
            confirmationText: 'Yes',
            cancellationText: 'No',
            dialogProps: { PaperProps: { className: "secondary-background" } }
        }).then(() => {

            // Join session
            Join({ sessionId: data.sessionId, username: username })
                .then(response => {

                    if (response.status === 200) {
                        history.push(`/quiz/${data.sessionId}`, { sessionId: data.sessionId, username: username });
                        history.go();
                    } else {
                        console.error("Join failed. Status: ", response.status);
                        openModal({
                            title: 'Join failed',
                            message: "Failed to join.",
                            actionText: "Ok"
                        });
                    }
                })
                .catch(error => {
                    console.error(error);
                    openModal({
                        title: 'Join failed',
                        message: "Failed to join.",
                        actionText: "Ok",
                    });
                })

        }).catch(() => { });
    }, [confirm, history, openModal, username]);

    useEffect(() => {

        if (connection) {
            connection.on('Results', (response) => {
                console.debug("Received results");
                setQuizCompleted(response.sessionCompleted);
                setFinalScore(response.scores);
            });
            connection.on('QuizCompleted', () => {
                console.debug("Quiz completed");
                setQuizCompleted(true);
            });
            connection.on('RematchPrompted', (data) => {
                console.debug("Rematch prompted");
                joinRematch(data);
            });
        }
    }, [connection, joinRematch]);

    // When quiz has completed
    useEffect(() => {

        if (quizCompleted) {
            sendNotification("Quizine", "All players have submitted their results!", () => {
                window.focus();
            });
        }
    }, [quizCompleted])

    function getConfettiColors() {

        if (finalScore[0]?.username === username) {
            return ["#ffd700"];
        } else if (finalScore[1]?.username === username) {
            return ["#c0c0c0"];
        } else if (finalScore[2]?.username === username) {
            return ["#cd7f32"];
        }
    }

    function isPlayerTopThree() {

        for (let index = 0; index < finalScore.slice(0, 3).length; index++) {

            if (finalScore[index]?.username === username)
                return true;
        }

        return false;
    }

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    async function openCheatSheet() {
        await FetchAnswers(sessionId).then((response) => {

            if (response.status === 200) {
                response.json().then(result => {
                    setCheatSheet(result);
                    setCheatSheetModalOpen(prevValue => !prevValue);
                })
            } else {
                openModal({
                    title: `Error code ${response.status}`,
                    message: "Failed to retreive cheat sheet",
                    actionText: "Ok"
                });
            }
        }).catch((error) => {
            console.error(error);
        }).finally(() => {
            handleMenuClose();
        });
    }

    function createNew() {

        confirm({
            title: 'New quiz',
            description: 'The current session will be abandoned. Are you sure?',
            confirmationText: 'Yes',
            cancellationText: 'No',
            dialogProps: { PaperProps: { className: "secondary-background" } }
        }).then(async () => {
            history.push("/create");
        }).catch(() => { })
    }

    async function rematch() {

        handleMenuClose();

        confirm({
            title: 'Rematch',
            description: 'The current session will be abandoned. Are you sure?',
            confirmationText: 'Yes',
            cancellationText: 'No',
            dialogProps: { PaperProps: { className: "secondary-background" } }
        }).then(async () => {

            // Create rematch session
            await Rematch(sessionId)
                .then(response => {

                    if (response.status === 200) {

                        // Accept session ID
                        response.json().then(result => {

                            // Join session with ID
                            Join({ sessionId: result, username: username })
                                .then(response => {

                                    if (response.status === 200) {

                                        // Prompt others to join
                                        PromptRematch(connection, sessionId, result)
                                            .then(() => {
                                                handleMenuClose();

                                                // Navigate to new session
                                                history.push(`/quiz/${result}`, { sessionId: result, username: username });
                                                history.go();
                                            });
                                    }
                                });
                        })
                    }

                }).catch(error => {
                    console.error(error);
                    openModal({
                        title: 'Rematch failed',
                        message: "Failed to initiate rematch.",
                        actionText: "Ok"
                    });
                });

        }).catch(() => { });
    }

    return (
        <div className={classes.container}>
            <AppBar position="relative" color="secondary" style={{ padding: '15px 0' }}>
                <Container maxWidth="md">
                    <Toolbar>
                        <GoHome />
                        <Typography variant="h2" color="primary" className={classes.header}>Results</Typography>
                        <Tooltip title="Menu" arrow>
                            <IconButton onClick={handleMenuOpen}>
                                <MenuIcon />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            anchorEl={anchorEl}
                            getContentAnchorEl={null}
                            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                            transformOrigin={{ vertical: "top", horizontal: "right" }}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            PaperProps={{ className: "secondary-background" }}
                        >
                            <MenuItem onClick={rematch} disabled={!quizCompleted}>
                                <ListItemIcon>
                                    <RematchIcon />
                                </ListItemIcon>
                                <ListItemText>
                                    Rematch
                                </ListItemText>
                            </MenuItem>
                            <MenuItem onClick={createNew}>
                                <ListItemIcon>
                                    <AddIcon />
                                </ListItemIcon>
                                <ListItemText>
                                    New quiz
                                </ListItemText>
                            </MenuItem>
                            <Divider />
                            <MenuItem onClick={openCheatSheet}>
                                <ListItemIcon>
                                    <ListIcon />
                                </ListItemIcon>
                                <ListItemText>
                                    Cheat sheet
                                </ListItemText>
                            </MenuItem>
                            <Divider />
                            {isPlayerTopThree() &&
                                <MenuItem disabled={!quizCompleted}>
                                    <FormGroup row>
                                        <FormControlLabel label="Confetti" control={
                                            <Checkbox color="primary" checked={confetti} onChange={(event) => setConfetti(event.target.checked)} />
                                        }>
                                        </FormControlLabel>
                                    </FormGroup>
                                </MenuItem>
                            }
                        </Menu>
                    </Toolbar>
                </Container>
            </AppBar>
            <CheatSheet
                data={cheatSheet}
                open={cheatSheetModalOpen}
                onClose={() => setCheatSheetModalOpen(false)}
            />
            <div style={{ height: '100%', display: 'flex', flex: '1' }}>
                {quizCompleted && isPlayerTopThree() && confetti &&
                    <ConfettiWrapper colors={getConfettiColors()} />
                }
                {quizCompleted ?
                    <Container maxWidth="sm">
                        <ResultsTable finalScore={finalScore} username={username} maxScore={maxScore} />
                    </Container>
                    :
                    <div style={{ display: 'flex', height: '100%', margin: 'auto' }}>
                        <Typography variant="overline" className="loadingAnimation" style={{ minWidth: '250px' }}>Waiting for all players</Typography>
                    </div>
                }
            </div>

        </div>
    )
}

export default QuizResults;