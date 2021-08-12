import { useState, useRef } from 'react';
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

    formControl: {
        margin: '15px 0',
    }
}))

const difficulties = [
    "Any",
    "Easy",
    "Medium",
    "Hard",
]

const categories = [
    {
        "label": "Any category",
        "value": 0
    },
    {
        "label": "Animals",
        "value": 27
    },
    {
        "label": "General knowledge",
        "value": 9
    },
    {
        "label": "History",
        "value": 23
    },
    {
        "label": "Mythology",
        "value": 20
    },
    {
        "label": "Science & Nature",
        "value": 17
    },
    {
        "label": "Sports",
        "value": 21
    },
]

function Form(props) {

    const classes = useStyles();

    const [playerCount, setPlayerCount] = useState(2);
    const [questionCount, setQuestionCount] = useState(10);

    const { register, handleSubmit, control, formState: { errors } } = useForm({ mode: 'onChange' });
    const myForm = useRef(null);

    return (
        <form onSubmit={handleSubmit(props.onSubmit)} className={classes.form} ref={myForm}>
            <FormControl margin="dense" fullWidth className={classes.formControl}>
                <TextField size="small" color="primary" label="Hostname" {...register("hostName", { required: true })} />
                {errors.title && <p>A man needs a name.</p>}
            </FormControl>
            <FormControl margin="dense" fullWidth className={classes.formControl}>
                <TextField size="small" color="primary" label="Title" {...register("title", { required: true })} />
                {errors.title && <p>Quiz needs a title!</p>}
            </FormControl>
            <FormControl margin="dense" fullWidth className={classes.formControl}>
                <FormLabel>
                    Number of players: {playerCount}
                </FormLabel>
                <Controller
                    name="playerCount"
                    control={control}
                    defaultValue={2}
                    render={() => (
                        <Slider
                            onChange={(_, value) => {
                                setPlayerCount(value);
                            }}
                            valueLabelDisplay="auto"
                            defaultValue={2}
                            min={1}
                            max={4}
                            step={1}
                        />
                    )}
                />
            </FormControl>
            <FormControl margin="dense" fullWidth className={classes.formControl}>
                <FormLabel>
                    Number of questions: {questionCount}
                </FormLabel>
                <Controller
                    name="questionCount"
                    control={control}
                    defaultValue={10}
                    render={() => (
                        <Slider
                            onChange={(_, value) => {
                                setQuestionCount(value);
                            }}
                            valueLabelDisplay="auto"
                            defaultValue={10}
                            min={1}
                            max={50}
                            step={1}
                        />
                    )}
                />
            </FormControl>
            <FormControl margin="dense" fullWidth className={classes.formControl}>
                <FormLabel>
                    Categories
                </FormLabel>
                <Controller
                    defaultValue={categories[0].value}
                    render={({ field }) => (
                        <Select {...field}>
                            {categories.map((category) => {
                                return (
                                    <MenuItem key={category.value} value={category.value}>{category.label}</MenuItem>
                                )
                            })}
                        </Select>
                    )}
                    name="category"
                    control={control}
                />
            </FormControl>
            <FormControl margin="dense" fullWidth className={classes.formControl}>
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
            <div style={{ textAlign: 'center' }}>
                <Button variant="contained" color="primary" type="submit" size="large">
                    Create
                </Button>
            </div>
        </form>
    )
}

export default Form;