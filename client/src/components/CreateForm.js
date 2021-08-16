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

function CreateForm(props) {

    const classes = useStyles();

    // Categories from parent
    const categories = props.categories;

    // Used for labeling
    const [playerCount, setPlayerCount] = useState(2);
    const [questionCount, setQuestionCount] = useState(10);

    const { register, setValue, handleSubmit, control, formState: { errors } } = useForm({ mode: 'onChange' });
    const myForm = useRef(null);

    // Register custom fields
    useEffect(() => {
        register("playerCount", { required: true, value: 2 });
        register("questionCount", { required: true, value: 10 });
    }, [register])

    return (
        <form onSubmit={handleSubmit(props.onSubmit)} className={classes.form} ref={myForm}>
            <FormControl margin="dense" fullWidth className={classes.formControl}>
                <TextField size="small" color="primary" label="Username" {...register("hostName", { required: true })} />
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
                <Slider
                    onChange={(_, value) => {
                        setPlayerCount(value);
                        setValue("playerCount", value);
                    }}
                    valueLabelDisplay="auto"
                    defaultValue={2}
                    min={1}
                    max={4}
                    step={1}
                />
            </FormControl>
            <FormControl margin="dense" fullWidth className={classes.formControl}>
                <FormLabel>
                    Number of questions: {questionCount}
                </FormLabel>
                <Slider
                    onChange={(_, value) => {
                        setQuestionCount(value);
                        setValue("questionCount", value);
                    }}
                    valueLabelDisplay="auto"
                    defaultValue={10}
                    min={1}
                    max={50}
                    step={1}
                />
            </FormControl>
            <FormControl margin="dense" fullWidth className={classes.formControl}>
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

export default CreateForm;