import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { makeStyles } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormLabel from '@material-ui/core/FormLabel';
import Fade from '@material-ui/core/Fade';
import Typography from '@material-ui/core/Typography';
import { useData } from '../services/CreateFormDataContext';

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

    rulesetDescription: {

    },
}));

function Step3(props) {

    const classes = useStyles();

    const rules = props.rules;

    const { setValues } = useData();
    const { register, handleSubmit, setValue, control, formState: { isValid } } = useForm({ mode: 'onChange' });

    const [description, setDescription] = useState(rules[0].description);

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
                    <div className={classes.rulesetDescription}>
                        <Typography variant="subtitle1" color="primary">
                            {description}
                        </Typography>
                    </div>
                </div>
            </Fade>
            <div>
                <Button variant="contained" color="primary" type="submit" size="large" disabled={!isValid}>
                    Next
                </Button>
            </div>
        </form>
    )
}

export default Step3;