import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useData } from '../services/CreateFormDataContext';
import StepperNavigationActions from './StepperNavigationActions';
import {
    makeStyles,
    FormControl,
    Select,
    MenuItem,
    FormLabel,
    Fade,
    Typography
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({

    form: {
        display: 'flex',
        flex: '1',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',

        '& p': {
            color: theme.palette.error.dark,
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

    const { setValues } = useData();
    const { register, handleSubmit, setValue, control, formState: { isValid } } = useForm({ mode: 'onChange' });

    const [description, setDescription] = useState(rules[0].description);

    const previousStep = props.onPreviousStep;

    // Register custom fields
    useEffect(() => {
        register("rule", { required: true });
    }, [register])

    function onSubmit(data) {
        setValues(data);
        props.onNextStep();
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
            <Fade in>
                <div style={{ width: '100%' }}>
                    <FormControl fullWidth className={classes.formControl}>
                        <FormLabel>
                            Ruleset
                        </FormLabel>
                        <Controller
                            defaultValue={0}
                            render={({ field }) => (
                                <Select {...field} onChange={(event) => {
                                    setDescription(rules[event.target.value].description);
                                    setValue("rule", event.target.value);
                                }}>
                                    {rules.map((rule, index) => {
                                        return (
                                            <MenuItem key={rule.rule} value={index}>{rule.rule}</MenuItem>
                                        )
                                    })}
                                </Select>
                            )}
                            name="rule"
                            control={control}
                        />
                    </FormControl>
                    <div>
                        <Typography variant="subtitle1" color="primary">
                            {description}
                        </Typography>
                    </div>
                </div>
            </Fade>
            <StepperNavigationActions onPreviousStep={previousStep} nextActionDisabled={!isValid} nextActionText="Finish" />
        </form>
    )
}

export default Step3;