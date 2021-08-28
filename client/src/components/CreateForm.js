import { useState, Fragment } from 'react';
import { useData } from '../services/CreateFormDataContext';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import { 
    Stepper,
    Step,
    StepLabel,
    Button
} from '@material-ui/core';

const steps = [
    "General",
    "Questions",
    "Rules"
]

function CreateForm(props) {

    const { data } = useData();

    // Data from parent
    const categories = props.categories;
    const difficulties = props.difficulties;
    const rules = props.rules;

    const [activeStep, setActiveStep] = useState(0);

    function handleNextStep() {
        setActiveStep(prevStep => prevStep + 1);
    }

    function handleSubmit() {
        props.onSubmit(data);
    }

    function getStepContent(step) {

        switch (step) {
            case 0:
                return <Step1 onNextStep={handleNextStep} />
            case 1:
                return <Step2 onNextStep={handleNextStep} categories={categories} difficulties={difficulties} />
            case 2:
                return <Step3 onNextStep={handleSubmit} rules={rules} />
            default:
                break;
        }
    }

    return (
        <Fragment>
            <Stepper alternativeLabel activeStep={activeStep} style={{ background: 'transparent', padding: '0', margin: '20px 0' }}>
                {steps.map((label) => {
                    return (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    )
                })}

            </Stepper>
            <div style={{margin: '0 20px', display: 'flex', flex: '1'}}>
                {getStepContent(activeStep)}
            </div>
        </Fragment>
    )
}

export default CreateForm;