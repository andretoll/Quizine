import { useState } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TrophyIcon from '@material-ui/icons/EmojiEvents';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles(theme => ({

    container: {
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
        background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.5) 10%, transparent 70%)',
    },

    header: {
        letterSpacing: '10px',
        textTransform: 'uppercase',
        background: theme.palette.secondary.main,
        padding: '20px',

        [theme.breakpoints.down('md')]: {
            display: 'flex',
            justifyContent: 'space-between',
        }
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
    },

    trophyContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '75px',
        height: '75px',
        margin: '0 auto',
        border: '5px double transparent',
        color: 'transparent',
        borderRadius: '50%',
        marginBottom: '20px',

        '& svg': {
            fontSize: '3em',

            [theme.breakpoints.down('xs')]: {
                fontSize: '1.5em',
            },
        },

        [theme.breakpoints.down('xs')]: {
            width: '50px',
            height: '50px',
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
}));

function Results(props) {

    const quizCompleted = props.quizCompleted;
    const finalScore = props.finalScore;
    const username = props.username;

    const classes = useStyles();

    const [tabValue, setTabValue] = useState(0);

    function getTrophyStyle(score) {

        if (!quizCompleted)
            return '';

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

    function handleTabChange(_, newValue) {
        setTabValue(newValue);
    }

    return (
        <div className={classes.container}>
            <div className={classes.header}>
                <Typography variant="h3">Results</Typography>
                <Link to="/">
                    <Button variant="text" color="primary">Go Home</Button>
                </Link>
            </div>
            <Tabs value={tabValue} onChange={handleTabChange} indicatorColor="primary" className={classes.tabs}>
                <Tab tabIndex={0} label="Top players" />
                <Tab tabIndex={1} label="All players" />
            </Tabs>
            <div className={classes.tabItemContainer}>
                {tabValue === 0 &&
                    <Container>
                        <Grid container className={classes.cardsContainer} spacing={1}>
                            {finalScore.slice(0, 3).map((score) => {

                                return (
                                    <Grid key={score.username} item className={classes.scoreWrapper} xs={12} sm={12} md={4}>
                                        <Paper className={classes.scoreContainer} variant="outlined">
                                            <div className={`${getTrophyStyle(score)} ${classes.trophyContainer}`} style={{margin: 'auto'}}>
                                                <TrophyIcon />
                                            </div>
                                            <hr className={getTrophyStyle(score)} />
                                            <Typography variant="h4" color={score.username === username ? 'primary' : 'inherit'} style={{overflow: 'hidden', textOverflow: 'ellipsis'}}>{score.username}</Typography>
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

export default Results;