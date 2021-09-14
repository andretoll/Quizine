import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useData } from '../../contexts/CreateFormDataContext';
import { v4 as uuid } from 'uuid';
import StepperNavigationActions from '../StepperNavigationActions';
import {
    makeStyles,
    FormControl,
    Select,
    MenuItem,
    FormLabel,
    Fade,
    Typography,
    Slider,
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({

    form: {
        display: 'flex',
        flex: '1',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',

        '& p': {
            color: theme.palette.error.main,
            margin: '5px',
        },
    },

    formControl: {
        margin: '10px 0',
    },
}));

function Step3(props) {

    const classes = useStyles();

    const rules = props.rules;
    const previousStep = props.onPreviousStep;

    const { setValues, data } = useData();
    const { handleSubmit, setValue, watch, control, formState: { isValid } } = useForm({ mode: 'onChange' });
    const ruleWatch = watch("rule", 0);

    const [questionTimeout, setQuestionTimeout] = useState(data.questionTimeout !== undefined ? data.questionTimeout : 30);

    useEffect(() => {
        setValue("questionTimeout", questionTimeout);
    }, [questionTimeout, setValue]);

    function onSubmit(data) {
        setValues(data);
        props.onNextStep();
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
            <Fade in>
                <div style={{ width: '100%' }}>
                    <div style={{ marginBottom: '20px' }}>
                        <FormControl fullWidth className={classes.formControl}>
                            <FormLabel>
                                Ruleset
                            </FormLabel>
                            <Controller
                                defaultValue={data.rule ? data.rule : 0}
                                render={({ field }) => (
                                    <Select {...field}>
                                        {rules.map((rule, index) => {
                                            return (
                                                <MenuItem key={uuid()} value={index}>{rule.rule}</MenuItem>
                                            )
                                        })}
                                    </Select>
                                )}
                                name="rule"
                                control={control}
                            />
                        </FormControl>
                        <div>
                            <Typography variant="subtitle2" color="textSecondary">
                                {rules[ruleWatch]?.description}
                            </Typography>
                        </div>
                    </div>
                    <FormControl fullWidth className={classes.formControl}>
                        <FormLabel style={{ marginBottom: '5px' }}>
                            Time per question: {questionTimeout > 0 ? `${questionTimeout} seconds` : `Unlimited`}
                        </FormLabel>
                        <Controller
                            control={control}
                            name="questionTimeout"
                            render={() => (
                                <Slider
                                    disabled={!rules[ruleWatch]?.enableTimeout}
                                    onChange={(_, value) => {
                                        setQuestionTimeout(value);
                                    }}
                                    value={questionTimeout}
                                    min={0}
                                    max={120}
                                    step={5}
                                />
                            )} />
                    </FormControl>
                </div>
            </Fade>
            <StepperNavigationActions onPreviousStep={previousStep} nextActionDisabled={!isValid} nextActionText="Next" />
        </form>
    )
}

export default Step3;