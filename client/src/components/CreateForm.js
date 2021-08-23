import { useState, useRef, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { makeStyles } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Slider from '@material-ui/core/Slider';
import MenuItem from '@material-ui/core/MenuItem';
import FormLabel from '@material-ui/core/FormLabel';

const useStyles = makeStyles(theme => ({

    form: {
        alignContent: 'center',

        '& p': {
            color: theme.palette.error.dark,
            margin: '5px',
        },
    },

    formControlWrapper: {
        overflowX: 'hidden',
        overflowY: 'auto',
        padding: '0 20px',

        [theme.breakpoints.down('sm')]: {
            maxHeight: '450px',
        },
    },

    formControl: {
        margin: '10px 0',
    }
}))

const difficulties = [
    "Any",
    "Easy",
    "Medium",
    "Hard",
]

function CreateForm(props) {

    const classes = useStyles();

    // Data from parent
    const categories = props.categories;
    const rules = props.rules;

    // Used for labeling
    const [playerCount, setPlayerCount] = useState(2);
    const [questionCount, setQuestionCount] = useState(10);
    const [questionTimeout, setQuestionTimeout] = useState(30);

    const { register, setValue, handleSubmit, control, formState: { errors } } = useForm({ mode: 'onChange' });
    const myForm = useRef(null);

    // Register custom fields
    useEffect(() => {
        register("playerCount", { required: true, value: 2 });
        register("questionCount", { required: true, value: 10 });
        register("questionTimeout", { required: true, value: 30 });
    }, [register])

    function isOnlyWhitespace(value) {
        return !!value.trim();
    }

    return (
        <form onSubmit={handleSubmit(props.onSubmit)} className={classes.form} ref={myForm}>
            <div className={classes.formControlWrapper}>
                <FormControl fullWidth className={classes.formControl}>
                    <TextField size="small" color="primary" label="Username" {...register("hostName", { required: true, maxLength: 15, validate: isOnlyWhitespace })} />
                    {errors.hostName && errors.hostName.type === "required" && <p>Username is required.</p>}
                    {errors.hostName && errors.hostName.type === "maxLength" && <p>Username must consist of less than 15 characters.</p>}
                    {errors.hostName && errors.hostName.type === "validate" && <p>Invalid username.</p>}
                </FormControl>
                <FormControl fullWidth className={classes.formControl}>
                    <TextField size="small" color="primary" label="Title" {...register("title", { required: true, validate: isOnlyWhitespace })} />
                    {errors.title && errors.title.type === "required" && <p>Title is required.</p>}
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
                        Difficuly
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
                <FormControl fullWidth className={classes.formControl}>
                    <FormLabel>
                        Rules
                    </FormLabel>
                    <Controller
                        defaultValue={rules ? rules[0] : null}
                        render={({ field }) => (
                            <Select {...field}>
                                {rules.map((rule) => {
                                    return (
                                        <MenuItem key={rule} value={rule}>{rule}</MenuItem>
                                    )
                                })}
                            </Select>
                        )}
                        name="rule"
                        control={control}
                    />
                </FormControl>
            </div>
            <div style={{ textAlign: 'center' }}>
                <Button variant="contained" color="primary" type="submit" size="large">
                    Create
                </Button>
            </div>
        </form>
    )
}

export default CreateForm;