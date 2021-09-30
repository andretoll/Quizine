import { Fragment } from 'react';
import { v4 as uuid } from 'uuid';
import TrophyIcon from '@material-ui/icons/EmojiEvents';
import {
    makeStyles,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({

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

        '&.spinning': {
            '-webkit-animation': '$spinning 2s infinite linear ease-in',
            '-moz-animation': '$spinning 2s linear infinite',
            '-o-animation': '$spinning 2s linear infinite',
            animation: '$spinning 2s linear infinite',
        },

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
}));

function ResultsTable(props) {

    const finalScore = props.finalScore;
    const username = props.username;
    const maxScore = props.maxScore;

    const classes = useStyles();

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

    return (
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
                                            <div className={`${classes.trophyWrapper} ${getTrophyStyle(score)} ${score.username === username && 'spinning'}`}>
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
    )
}

export default ResultsTable;