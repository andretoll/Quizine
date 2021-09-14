import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { v4 as uuid } from 'uuid';
import { useData } from '../../contexts/CreateFormDataContext';
import StepperNavigationActions from '../StepperNavigationActions';
import {
    makeStyles,
    FormControl,
    Select,
    MenuItem,
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
            color: theme.palette.error.main,
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
    const previousStep = props.onPreviousStep;

    const { setValues, data } = useData();
    const { handleSubmit, setValue, control, formState: { isValid } } = useForm({ mode: 'onChange' });

    const [questionCount, setQuestionCount] = useState(data.questionCount ? data.questionCount : 10);

    useEffect(() => {
        setValue("questionCount", questionCount);
    }, [questionCount, setValue]);

    function onSubmit(formData) {

        // Append category name
        const categoryName = categories.find(x => x.id === formData.category).name;
        formData = { ...formData, categoryName };
        
        setValues(formData);
        props.onNextStep();
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
            <Fade in>
                <div style={{ width: '100%' }}>
                    <FormControl fullWidth className={classes.formControl}>
                        <FormLabel style={{marginBottom: '5px'}}>
                            Questions: {questionCount}
                        </FormLabel>
                        <Controller
                            control={control}
                            name="questionCount"
                            render={() => (
                                <Slider
                                    value={questionCount}
                                    onChange={(_, value) => {
                                        setQuestionCount(value);
                                    }}
                                    min={1}
                                    max={50}
                                    step={1}
                                />
                            )} />

                    </FormControl>
                    <FormControl fullWidth className={classes.formControl}>
                        <FormLabel>
                            Categories
                        </FormLabel>
                        <Controller
                            defaultValue={data.category ? data.category : categories[0]?.id}
                            render={({ field }) => (
                                <Select {...field}>
                                    {categories.map((category) => {
                                        return (
                                            <MenuItem key={uuid()} value={category.id}>{category.name}</MenuItem>
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
                            defaultValue={data.difficulty ? data.difficulty : difficulties[0]}
                            render={({ field }) => (
                                <Select {...field}>
                                    {difficulties.map((difficulty) => {
                                        return (
                                            <MenuItem key={uuid()} value={difficulty}>{difficulty}</MenuItem>
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
            <StepperNavigationActions onPreviousStep={previousStep} nextActionDisabled={!isValid} nextActionText="Next" />
        </form>
    )
}

export default Step2;