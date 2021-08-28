import { useState, useEffect } from 'react';
import { useData } from '../services/CreateFormDataContext';
import { useForm } from 'react-hook-form';
import { 
    makeStyles,
    FormControl,
    Button,
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

    const { setValues } = useData();
    const { register, handleSubmit, setValue, formState: { errors, isValid } } = useForm({ mode: 'onChange' });

    const [playerCount, setPlayerCount] = useState(2);

    // Register custom fields
    useEffect(() => {
        register("playerCount", { required: true, value: 2 });
    }, [register])

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
                <div style={{width: '100%'}}>
                    <FormControl fullWidth className={classes.formControl}>
                        <TextField autoComplete="off" size="small" color="primary" label="Username" {...register("hostname", { required: true, maxLength: 15, validate: isOnlyWhitespace })} />
                        {errors.hostname && errors.hostname.type === "required" && <p>Username is required.</p>}
                        {errors.hostname && errors.hostname.type === "maxLength" && <p>Username must consist of less than 15 characters.</p>}
                        {errors.hostname && errors.hostname.type === "validate" && <p>Invalid username.</p>}
                    </FormControl>
                    <FormControl fullWidth className={classes.formControl}>
                        <TextField autoComplete="off" size="small" color="primary" label="Title" {...register("title", { required: true, maxLength: 15, validate: isOnlyWhitespace })} />
                        {errors.title && errors.title.type === "required" && <p>Title is required.</p>}
                        {errors.title && errors.title.type === "maxLength" && <p>Title must consist of less than 15 characters.</p>}
                        {errors.title && errors.title.type === "validate" && <p>Invalid title.</p>}
                    </FormControl>
                    <FormControl fullWidth className={classes.formControl}>
                        <FormLabel>
                            Players: {playerCount}
                        </FormLabel>
                        <Slider
                            onChange={(_, value) => {
                                setPlayerCount(value);
                                setValue("playerCount", value);
                            }}
                            defaultValue={2}
                            min={1}
                            max={8}
                            step={1}
                        />
                    </FormControl>
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

export default Step1;