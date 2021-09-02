import StepperNavigationActions from '../StepperNavigationActions';
import { useForm } from 'react-hook-form';
import { useData } from '../../contexts/CreateFormDataContext';
import {
    makeStyles,
    Paper,
    Typography,
    Fade,
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({

    form: {
        display: 'flex',
        flex: '1',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    summaryContainer: {
        width: '100%',
    },

    summaryWrapper: {
        background: theme.palette.secondary.dark,
        padding: '15px',
    },

    summaryItemContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignContent: 'center',
        margin: '5px 0'
    },

    summaryItemTitle: {
        textAlign: 'left',
        marginRight: '5px',
    },

    summaryItemValue: {
        color: theme.palette.primary.light,
        textAlign: 'right',
    },
}));

function ConfirmStep(props) {

    const previousStep = props.onPreviousStep;
    const finishStep = props.onNextStep;
    const rules = props.rules;
    const categories = props.categories;

    const classes = useStyles();

    const { data } = useData();
    const { handleSubmit } = useForm();

    function getCategoryValue() {
        return categories.find(({ id }) => id === data.category).name;
    }

    function getRuleValue() {
        return rules[data.rule].rule;
    }

    function getQuestionTimeoutValue() {
        return data.questionTimeout === 0 ?
            'Disabled'
            :
            `${data.questionTimeout}s`;
    }

    return (
        <form onSubmit={handleSubmit(finishStep)} className={classes.form}>
            <Fade in>
                <div className={classes.summaryContainer}>
                    <Paper className={classes.summaryWrapper} variant="outlined">
                        <Typography variant="h5" style={{ textAlign: 'center' }}>Summary</Typography>
                        <hr />
                        <div className={classes.summaryItemContainer}>
                            <Typography className={classes.summaryItemTitle}>Title</Typography>
                            <Typography className={classes.summaryItemValue}>{data.title}</Typography>
                        </div>
                        <div className={classes.summaryItemContainer}>
                            <Typography className={classes.summaryItemTitle}>Players</Typography>
                            <Typography className={classes.summaryItemValue}>{data.playerCount}</Typography>
                        </div>
                        <div className={classes.summaryItemContainer}>
                            <Typography className={classes.summaryItemTitle}>Questions</Typography>
                            <Typography className={classes.summaryItemValue}>{data.questionCount}</Typography>
                        </div>
                        <div className={classes.summaryItemContainer}>
                            <Typography className={classes.summaryItemTitle}>Category</Typography>
                            <Typography className={classes.summaryItemValue}>{getCategoryValue()}</Typography>
                        </div>
                        <div className={classes.summaryItemContainer}>
                            <Typography className={classes.summaryItemTitle}>Difficulty</Typography>
                            <Typography className={classes.summaryItemValue}>{data.difficulty}</Typography>
                        </div>
                        <div className={classes.summaryItemContainer}>
                            <Typography className={classes.summaryItemTitle}>Timeout</Typography>
                            <Typography className={classes.summaryItemValue}>{getQuestionTimeoutValue()}</Typography>
                        </div>
                        <div className={classes.summaryItemContainer}>
                            <Typography className={classes.summaryItemTitle}>Ruleset</Typography>
                            <Typography className={classes.summaryItemValue}>{getRuleValue()}</Typography>
                        </div>
                    </Paper>
                </div>
            </Fade>
            <StepperNavigationActions onPreviousStep={previousStep} nextActionText="Finish" />
        </form>
    )
}

export default ConfirmStep;