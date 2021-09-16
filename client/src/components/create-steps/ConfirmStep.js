import StepperNavigationActions from '../StepperNavigationActions';
import { useForm } from 'react-hook-form';
import { useData } from '../../contexts/CreateFormDataContext';
import QuizParameterList from '../QuizParametersList';
import WarningIcon from '@material-ui/icons/Warning';
import {
    makeStyles,
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
        return rules[data.rule];
    }

    return (
        <form onSubmit={handleSubmit(finishStep)} className={classes.form}>
            <div style={{ marginBottom: '15px' }}>
                <Fade in>
                    <div className={classes.summaryContainer}>
                        <Typography variant="h5" style={{ textAlign: 'center' }}>Summary</Typography>
                        <hr />
                        <QuizParameterList
                            title={data.title}
                            playerCount={data.playerCount}
                            questionCount={data.questionCount}
                            category={getCategoryValue()}
                            difficulty={data.difficulty}
                            questionTimeout={data.questionTimeout}
                            ruleset={getRuleValue()}
                        />
                    </div>
                </Fade>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <WarningIcon color="primary" style={{ marginRight: '10px' }} />
                <Typography variant="body2" color="primary">Sessions expires after {props.sessionLifetime} minutes.</Typography>
            </div>
            <StepperNavigationActions onPreviousStep={previousStep} nextActionText="Finish" />
        </form>
    )
}

export default ConfirmStep;