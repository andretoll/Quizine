import { Fragment, useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useConnection } from '../../contexts/HubConnectionContext';
import { sendNotification } from '../../services/NotificationService';
import { useHistory } from 'react-router';
import { useErrorModal } from '../../contexts/ErrorModalContext';
import ConfettiWrapper from '../wrappers/ConfettiWrapper';
import GoHome from '../GoHome';
import CheatSheet from '../CheatSheet';
import TrophyIcon from '@material-ui/icons/EmojiEvents';
import MenuIcon from '@material-ui/icons/MoreVert';
import RematchIcon from '@material-ui/icons/FlashOn';
import ListIcon from '@material-ui/icons/ListAlt';
import AddIcon from '@material-ui/icons/AddBox';
import {
    makeStyles,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
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

    tableContainer: {
        background: theme.palette.gradient.main,
        margin: '50px 0'
    },

    trophyWrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'transparent',
        position: 'relative',

        '& svg': {
            fontSize: '1.7em',
        },
    },

    gold: {
        color: '#ffd700',
    },
    silver: {
        color: '#c0c0c0',
    },
    bronze: {
        color: '#cd7f32',
    },
}));

function QuizResults(props) {

    const username = props.username;
    const maxScore = props.maxScore;
    const sessionId = props.sessionId;

    const classes = useStyles();

    const { connection } = useConnection();
    const { openModal, closeModal } = useErrorModal();

    const [quizCompleted, setQuizCompleted] = useState(false);
    const [finalScore, setFinalScore] = useState([]);
    const [cheatSheet, setCheatSheet] = useState(null);

    const [anchorEl, setAnchorEl] = useState(null);
    const [confetti, setConfetti] = useState(true);
    const [cheatSheetModalOpen, setCheatSheetModalOpen] = useState(false);

    const history = useHistory();

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
        }
    }, [connection]);

    // When quiz has completed
    useEffect(() => {

        if (quizCompleted) {
            sendNotification("Quizine", "All players have submitted their results!", () => {
                window.focus();
            });
        }
    }, [quizCompleted])

    function getTrophyStyle(score) {

        const index = finalScore.indexOf(score);
        switch (index) {
            case 0:
                return classes.gold;
            case 1:
                return classes.silver;
            case 2:
                return classes.bronze;
            default:
                break;
        }
    }

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

    function openCheatSheet() {
        fetch(`${process.env.REACT_APP_QUIZINE_API_BASE_URL}quiz/answers`, {
            method: 'POST',
            body: JSON.stringify(sessionId),
            headers: {
                'Content-Type': 'application/json',
                'ApiKey': process.env.REACT_APP_QUIZINE_API_KEY
            }
        }).then((response) => {

            if (response.status === 200) {
                response.json().then(result => {
                    setCheatSheet(result);
                    setCheatSheetModalOpen(prevValue => !prevValue);
                })
            } else {
                openModal({
                    title: `Error code ${response.status}`,
                    message: "Failed to retreive cheat sheet",
                    actionText: "Ok",
                    action: () => {
                        closeModal();
                    }
                });
            }
        }).catch((error) => {
            console.error(error);
        }).finally(() => {
            handleMenuClose();
        });
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
                            <MenuItem onClick={() => history.push("/create")}>
                                <ListItemIcon>
                                    <RematchIcon />
                                </ListItemIcon>
                                <ListItemText>
                                    Rematch
                                </ListItemText>
                            </MenuItem>
                            <MenuItem onClick={() => history.push("/create")}>
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
            <div style={{ height: '100%' }}>
                {quizCompleted && isPlayerTopThree() && confetti &&
                    <ConfettiWrapper colors={getConfettiColors()} />
                }
                {quizCompleted ?
                    <Container maxWidth="sm">
                        <Paper elevation={10} className={classes.tableContainer}>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center" width="10%">Place</TableCell>
                                            <TableCell align="left">Player</TableCell>
                                            <TableCell align="center" width="10%">Points</TableCell>
                                            <TableCell align="center" width="30%">Max. points</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {finalScore.map((score, index) => {
                                            return (
                                                <TableRow key={uuid()}>
                                                    <TableCell className={score.username === username ? 'primary-color' : ''} align="center">
                                                        {index < 3 ?
                                                            <div className={`${classes.trophyWrapper} ${getTrophyStyle(score)}`}>
                                                                <TrophyIcon />
                                                            </div>
                                                            :
                                                            <Fragment>
                                                                {index + 1}
                                                            </Fragment>
                                                        }
                                                    </TableCell>
                                                    <TableCell className={score.username === username ? 'primary-color' : ''} align="left">
                                                        {score.username}
                                                    </TableCell>
                                                    <TableCell className={score.username === username ? 'primary-color' : ''} align="center">
                                                        {score.points}
                                                    </TableCell>
                                                    <TableCell className={score.username === username ? 'primary-color' : ''} align="center">
                                                        {maxScore}
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Container>
                    :
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <Typography variant="overline" className="loadingAnimation" style={{ minWidth: '250px' }}>Waiting for all players</Typography>
                    </div>
                }
            </div>

        </div>
    )
}

export default QuizResults;