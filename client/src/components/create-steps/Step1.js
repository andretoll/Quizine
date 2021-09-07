import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useData } from '../../contexts/CreateFormDataContext';
import StepperNavigationActions from '../StepperNavigationActions';
import {
    makeStyles,
    FormControl,
    TextField,
    Slider,
    FormLabel,
    Fade
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
    }
}));

function Step1(props) {

    const classes = useStyles();

    const { setValues, data } = useData();
    const { register, handleSubmit, setValue, control, formState: { errors, isValid } } = useForm({
        mode: 'onChange',
        defaultValues: {
            "hostname": data.hostname ? data.hostname : '',
            "title": data.title ? data.title : '',
        }
    });

    const [playerCount, setPlayerCount] = useState(data.playerCount ? data.playerCount : 2);

    useEffect(() => {
        register("hostname", { required: true, maxLength: 15, validate: isOnlyWhitespace });
        register("title", { required: true, maxLength: 15, validate: isOnlyWhitespace });
    }, [register])

    useEffect(() => {
        if (playerCount)
            setValue("playerCount", playerCount);
    }, [playerCount, setValue]);

    function onSubmit(data) {
        setValues(data);
        props.onNextStep();
    }

    function isOnlyWhitespace(value) {
        return !!value.trim();
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
            <Fade in>
                <div style={{ width: '100%' }}>
                    <FormControl fullWidth className={classes.formControl}>
                        <Controller
                            control={control}
                            name="hostname"
                            render={({ field: { onChange, value } }) => (
                                <TextField autoComplete="off" size="small" color="primary" label="Username" onChange={onChange} value={value} />
                            )} />
                        {errors.hostname && errors.hostname.type === "required" && <p>Username is required.</p>}
                        {errors.hostname && errors.hostname.type === "maxLength" && <p>Username must consist of less than 15 characters.</p>}
                        {errors.hostname && errors.hostname.type === "validate" && <p>Invalid username.</p>}
                    </FormControl>
                    <FormControl fullWidth className={classes.formControl}>
                        <Controller
                            control={control}
                            name="title"
                            render={({ field: { onChange, value } }) => (
                                <TextField autoComplete="off" size="small" color="primary" label="Title" onChange={onChange} value={value} />
                            )} />
                        {errors.title && errors.title.type === "required" && <p>Title is required.</p>}
                        {errors.title && errors.title.type === "maxLength" && <p>Title must consist of less than 15 characters.</p>}
                        {errors.title && errors.title.type === "validate" && <p>Invalid title.</p>}
                    </FormControl>
                    <FormControl fullWidth className={classes.formControl}>
                        <FormLabel style={{marginBottom: '5px'}}>
                            Players: {playerCount}
                        </FormLabel>
                        <Controller
                            control={control}
                            name="playerCount"
                            render={() => (
                                <Slider
                                    value={playerCount}
                                    onChange={(_, value) => {
                                        setPlayerCount(value);
                                    }}
                                    min={1}
                                    max={8}
                                    step={1} />
                            )} />

                    </FormControl>
                </div>
            </Fade>
            <StepperNavigationActions nextActionDisabled={!isValid} nextActionText="Next" />
        </form>
    )
}

export default Step1;