import { Fragment } from 'react';
import StarIcon from '@material-ui/icons/Star';
import StarEmptyIcon from '@material-ui/icons/StarBorder';
import {
    makeStyles,
    Grid,
    Typography,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({

    textLeft: {
        textAlign: 'center',

        [theme.breakpoints.up('sm')]: {
            textAlign: 'left',
        },
    },

    textRight: {
        textAlign: 'center',

        [theme.breakpoints.up('sm')]: {
            textAlign: 'right',
        },
    },
}));

function QuizCardHeader(props) {

    const category = props.category;
    const difficulty = props.difficulty;
    const questionIndex = props.questionIndex;
    const questionCount = props.questionCount;

    const classes = useStyles();

    function renderDifficulty() {

        switch (difficulty) {
            case 'easy':
                return (
                    <Fragment>
                        <StarIcon />
                        <StarEmptyIcon />
                        <StarEmptyIcon />
                    </Fragment>
                )
            case 'medium':
                return (
                    <Fragment>
                        <StarIcon />
                        <StarIcon />
                        <StarEmptyIcon />
                    </Fragment>
                )
            case 'hard':
                return (
                    <Fragment>
                        <StarIcon />
                        <StarIcon />
                        <StarIcon />
                    </Fragment>
                )
            default:
                break;
        }
    }

    return (
        <Fragment>
            <Grid container alignItems="center">
                <Grid item xs={12} sm={5} className={classes.textLeft} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <Typography variant="overline">{category}</Typography>
                </Grid>
                <Grid item xs={6} sm={2} style={{ textAlign: 'center' }}>
                    <Typography variant="overline">{questionIndex} / {questionCount}</Typography>
                </Grid>
                <Grid item xs={6} sm={5} className={classes.textRight}>
                    {renderDifficulty()}
                </Grid>
            </Grid>
        </Fragment>
    )
}

export default QuizCardHeader;