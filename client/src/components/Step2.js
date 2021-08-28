import { useState, useEffect } from 'react';
import { useData } from '../services/CreateFormDataContext';
import { useForm, Controller } from 'react-hook-form';
import { makeStyles } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Slider from '@material-ui/core/Slider';
import FormLabel from '@material-ui/core/FormLabel';
import Fade from '@material-ui/core/Fade';

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

function Step2(props) {

    const classes = useStyles();

    const categories = props.categories;
    const difficulties = props.difficulties;

    const { setValues } = useData();
    const { register, handleSubmit, setValue, control, formState: { isValid } } = useForm({ mode: 'onChange' });

    const [questionCount, setQuestionCount] = useState(10);
    const [questionTimeout, setQuestionTimeout] = useState(30);

    // Register custom fields
    useEffect(() => {
        register("questionCount", { required: true, value: 10 });
        register("questionTimeout", { required: true, value: 30 });
    }, [register])

    function onSubmit(data) {
        setValues(data);
        props.onNextStep();
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
            <Fade in>
                <div style={{width: '100%'}}>
                    <FormControl fullWidth className={classes.formControl}>
                        <FormLabel>
                            Questions: {questionCount}
                        </FormLabel>
                        <Slider
                            onChange={(_, value) => {
                                setQuestionCount(value);
                                setValue("questionCount", value);
                            }}
                            defaultValue={10}
                            min={1}
                            max={50}
                            step={1}
                        />
                    </FormControl>
                    <FormControl fullWidth className={classes.formControl}>
                        <FormLabel>
                            Timeout: {questionTimeout > 0 ? `${questionTimeout} seconds` : `Disabled`}
                        </FormLabel>
                        <Slider
                            onChange={(_, value) => {
                                setQuestionTimeout(value);
                                setValue("questionTimeout", value);
                            }}
                            defaultValue={30}
                            min={0}
                            max={120}
                            step={5}
                        />
                    </FormControl>
                    <FormControl fullWidth className={classes.formControl}>
                        <FormLabel>
                            Categories
                        </FormLabel>
                        <Controller
                            defaultValue={categories[0]?.id}
                            render={({ field }) => (
                                <Select {...field}>
                                    {categories.map((category) => {
                                        return (
                                            <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                                        )
                                    })}
                                </Select>
                            )}
                            name="category"
                            control={control}
                        />
                    </FormControl>
                    <FormControl fullWidth className={classes.formControl}>
                        <FormLabel>
                            Difficulty
                        </FormLabel>
                        <Controller
                            defaultValue={difficulties[0]}
                            render={({ field }) => (
                                <Select {...field}>
                                    {difficulties.map((difficulty) => {
                                        return (
                                            <MenuItem key={difficulty} value={difficulty}>{difficulty}</MenuItem>
                                        )
                                    })}
                                </Select>
                            )}
                            name="difficulty"
                            control={control}
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

export default Step2;