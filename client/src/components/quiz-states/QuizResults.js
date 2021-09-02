import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useConnection } from '../../contexts/HubConnectionContext';
import { sendNotification } from '../../services/NotificationService';
import TrophyIcon from '@material-ui/icons/EmojiEvents';
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
    Button,
    Container,
    CircularProgress,
    AppBar,
    Toolbar
} from '@material-ui/core';
import ConfettiWrapper from '../ConfettiWrapper';

const useStyles = makeStyles(theme => ({

    container: {
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.5) 10%, transparent 70%)',
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

    scoreWrapper: {
        flex: '0 0 auto',
    },

    scoreContainer: {
        padding: '30px 15px',
        textAlign: 'center',
        width: '300px',
        background: theme.palette.secondary.main,

        [theme.breakpoints.down('sm')]: {
            padding: '15px',
        },

        '&.active': {
            transform: 'scale(1.03)',

            '& .spinning': {
                '-webkit-animation': '$spinning 2s infinite linear ease-in',
                '-moz-animation': '$spinning 2s linear infinite',
                '-o-animation': '$spinning 2s linear infinite',
                animation: '$spinning 2s linear infinite',
            }
        },
    },

    trophyContainer: {
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
    }
}));

function QuizResults(props) {

    const username = props.username;
    const maxScore = props.maxScore;
    const expectedPlayers = props.expectedPlayers;

    const classes = useStyles();

    const { connection } = useConnection();

    const [quizCompleted, setQuizCompleted] = useState(false);
    const [finalScore, setFinalScore] = useState([]);

    const [tabValue, setTabValue] = useState(0);

    useEffect(() => {

        if (connection) {
            connection.on('Results', (response) => {
                setQuizCompleted(response.sessionCompleted);
                setFinalScore(response.scores);
            });
            connection.on('QuizCompleted', () => {
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

    return (
        <div className={classes.container}>
            <AppBar position="relative" color="secondary">
                <Toolbar>
                    <Typography style={{ flexGrow: '1' }} variant="h5">{quizCompleted ? 'Final results' : `Awaiting ${expectedPlayers - finalScore.length} player(s)...`}</Typography>
                    <Link to="/">
                        <Button variant="text" color="primary">Go Home</Button>
                    </Link>
                </Toolbar>
            </AppBar>
            <Tabs value={tabValue} onChange={handleTabChange} indicatorColor="primary" className={classes.tabs}>
                <Tab tabIndex={0} label="Top 3" />
                <Tab tabIndex={1} label="Standings" />
            </Tabs>
            <div className={classes.tabItemContainer}>
                {tabValue === 0 &&
                    <Container>
                        {quizCompleted && isPlayerTopThree() &&
                            <ConfettiWrapper colors={getConfettiColors()} />
                        }
                        <Grid container className={classes.cardsContainer} spacing={1}>
                            {finalScore.slice(0, 3).map((score) => {

                                return (
                                    <Grid key={score.username} item className={classes.scoreWrapper} xs={12} sm={12} md={4}>
                                        <Paper
                                            className={`${classes.scoreContainer} ${score.username === username && 'active'}`}
                                            variant={score.username === username ? 'elevation' : 'outlined'}
                                            elevation={6}
                                        >
                                            <div className={`${getTrophyStyle(score)} ${classes.trophyContainer}`}>
                                                {quizCompleted ? <TrophyIcon className="spinning" /> : <CircularProgress color="inherit" />}
                                            </div>
                                            <Typography variant="h4" color={score.username === username ? 'primary' : 'inherit'} style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{score.username}</Typography>
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
                                            <TableCell align="center" width="20%">Max. points</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {finalScore.map((score) => {

                                            return (
                                                <TableRow key={score.username}>
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