import { useEffect, useState } from 'react';
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
import {
    makeStyles,
    Grid,
    Paper,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    IconButton,
    Container,
    CircularProgress,
    AppBar,
    Toolbar,
    Tooltip,
    Menu,
    MenuItem,
    Switch,
    FormControlLabel,
    FormGroup,
    Divider,
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({

    container: {
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },

    tabs: {
        margin: '20px auto',

        [theme.breakpoints.down('xs')]: {
            margin: '10px auto',
        }
    },

    tabItemContainer: {
        display: 'flex',
        flex: '1',
        justifyContent: 'center',
        alignItems: 'flex-start',
        position: 'relative',

        [theme.breakpoints.up('md')]: {
            marginTop: '50px',
        }
    },

    cardsContainer: {
        alignItems: 'center',
        justifyContent: 'center',

        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
        },
    },

    cardWrapper: {
        flex: '0 0 auto',

        '&.active': {
            zIndex: '3',

            '& .spinning': {
                '-webkit-animation': '$spinning 2s infinite linear ease-in',
                '-moz-animation': '$spinning 2s linear infinite',
                '-o-animation': '$spinning 2s linear infinite',
                animation: '$spinning 2s linear infinite',
            }
        },
    },

    card: {
        padding: '30px 15px',
        textAlign: 'center',
        width: '300px',
        background: theme.palette.gradient.main,

        [theme.breakpoints.down('sm')]: {
            padding: '15px',
        },

        '&.active': {
            boxShadow: '-5px 5px 10px 0 rgba(0 0 0 / 30%)',

            [theme.breakpoints.up('xs')]: {
                '-webkit-animation': '$float 1s ease-in-out infinite',
                '-moz-animation': '$float 1s ease-in-out infinite',
                '-o-animation': '$float 1s ease-in-out infinite',
                animation: '$float 1s ease-in-out infinite',
            }
        },
    },

    trophyWrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '75px',
        height: '75px',
        margin: '10px auto',
        border: '5px double transparent',
        color: 'transparent',
        borderRadius: '50%',

        '& svg': {
            fontSize: '3em',

            [theme.breakpoints.down('xs')]: {
                fontSize: '1.5em',
            },
        },

        [theme.breakpoints.down('xs')]: {
            width: '50px',
            height: '50px',
            margin: '5px auto',
        },
    },

    gold: {
        color: '#ffd700',
        borderColor: '#ffd700',
    },
    silver: {
        color: '#c0c0c0',
        borderColor: '#c0c0c0',
    },
    bronze: {
        color: '#cd7f32',
        borderColor: '#cd7f32',
    },

    "@keyframes spinning": {
        "to": {
            transform: 'rotateY(360deg)',
        },
    },
    "@-webkit-keyframes spinning": {
        "to": {
            transform: 'rotateY(360deg)',
        }
    },

    "@keyframes float": {
        "0%": {
            transform: "translatey(0px)",
        },
        "50%": {
            transform: "translatey(-5px)",
        },
        "100%": {
            transform: "translatey(0px)",
        }
    },

    "@-webkit-keyframes float": {
        "0%": {
            transform: "translatey(0px)",
        },
        "50%": {
            transform: "translatey(-5px)",
        },
        "100%": {
            transform: "translatey(0px)",
        }
    },
}));

function QuizResults(props) {

    const username = props.username;
    const maxScore = props.maxScore;
    const expectedPlayers = props.expectedPlayers;
    const sessionId = props.sessionId;

    const classes = useStyles();

    const { connection } = useConnection();
    const { openModal, closeModal } = useErrorModal();

    const [quizCompleted, setQuizCompleted] = useState(false);
    const [finalScore, setFinalScore] = useState([]);
    const [cheatSheet, setCheatSheet] = useState(null);

    const [tabValue, setTabValue] = useState(0);
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

    function handleTabChange(_, newValue) {
        setTabValue(newValue);
    }

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
            <AppBar position="relative" color="secondary">
                <Toolbar>
                    <GoHome />
                    <Tabs value={tabValue} onChange={handleTabChange} indicatorColor="primary" className={classes.tabs}>
                        <Tab tabIndex={0} label="Top 3" />
                        <Tab tabIndex={1} label="Standings" />
                    </Tabs>
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
                        PaperProps={{ className: "secondary-background-light" }}
                    >
                        <MenuItem onClick={openCheatSheet}>Cheat Sheet</MenuItem>
                        <MenuItem onClick={() => history.push("/create")}>New Quiz</MenuItem>
                        <Divider />
                        <MenuItem disabled={!quizCompleted}>
                            <FormGroup row>
                                <FormControlLabel label="Confetti" control={
                                    <Switch color="primary" checked={confetti} onChange={(event) => setConfetti(event.target.checked)} />
                                }>
                                </FormControlLabel>
                            </FormGroup>
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
            <CheatSheet
                data={cheatSheet}
                open={cheatSheetModalOpen}
                onClose={() => setCheatSheetModalOpen(false)}
            />
            <Typography style={{ textAlign: 'center', margin: '20px 0' }} variant="h2">{quizCompleted ? 'Final Results' : `Awaiting ${expectedPlayers - finalScore.length} player(s)...`}</Typography>
            <div className={classes.tabItemContainer}>
                {quizCompleted && isPlayerTopThree() && confetti &&
                    <ConfettiWrapper colors={getConfettiColors()} />
                }
                {tabValue === 0 &&
                    <Container>

                        <Grid container className={classes.cardsContainer} spacing={1}>
                            {finalScore.slice(0, 3).map((score) => {

                                return (
                                    <Grid key={uuid()} item className={`${classes.cardWrapper} ${score.username === username && 'active'}`} xs={12} sm={12} md={4}>
                                        <Paper
                                            className={`${classes.card} ${score.username === username && 'active'}`}
                                            variant="elevation"
                                        >
                                            <div className={`${getTrophyStyle(score)} ${classes.trophyWrapper}`}>
                                                {quizCompleted ? <TrophyIcon className="spinning" /> : <CircularProgress color="inherit" />}
                                            </div>
                                            <Typography variant="h4" color={score.username === username ? 'primary' : 'inherit'} noWrap>{score.username}</Typography>
                                            <div>
                                                <Typography variant="h4">{score.points} pts</Typography>
                                            </div>
                                        </Paper>
                                    </Grid>
                                )
                            })}
                        </Grid>
                    </Container>

                }
                {tabValue === 1 &&
                    <Container maxWidth="sm">
                        <Paper className="secondary-background" elevation={10}>
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
                                        {finalScore.map((score) => {

                                            return (
                                                <TableRow key={uuid()}>
                                                    <TableCell className={score.username === username ? 'primary-color' : ''} align="center">
                                                        {finalScore.indexOf(score) + 1}
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
                }
            </div>

        </div>
    )
}

export default QuizResults;