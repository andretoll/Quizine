import { useState, Fragment } from 'react';
import { useData } from '../contexts/CreateFormDataContext';
import { v4 as uuid } from 'uuid';
import Step1 from './create-steps/Step1';
import Step2 from './create-steps/Step2';
import Step3 from './create-steps/Step3';
import {
    Stepper,
    Step,
    StepLabel
} from '@material-ui/core';
import ConfirmStep from './create-steps/ConfirmStep';

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
    const sessionLifetime = props.sessionLifetime;

    const [activeStep, setActiveStep] = useState(0);

    function handlePreviousStep() {

        console.debug("Navigating to previous step...");

        setActiveStep(prevStep => prevStep - 1);
    }

    function handleNextStep() {
        
        console.debug("Navigating to next step...");

        setActiveStep(prevStep => prevStep + 1);
    }

    function handleSubmit() {
        
        console.debug("Sending data to parent component...");
        
        props.onSubmit(data);
    }

    function getStepContent(step) {

        switch (step) {
            case 0:
                return <Step1 onNextStep={handleNextStep} />
            case 1:
                return <Step2 onNextStep={handleNextStep} onPreviousStep={handlePreviousStep} categories={categories} difficulties={difficulties} />
            case 2:
                return <Step3 onNextStep={handleNextStep} onPreviousStep={handlePreviousStep} rules={rules} />
            case 3:
                return <ConfirmStep onNextStep={handleSubmit} onPreviousStep={handlePreviousStep} rules={rules} categories={categories} sessionLifetime={sessionLifetime} />
            default:
                break;
        }
    }

    return (
        <Fragment>
            <Stepper alternativeLabel activeStep={activeStep} style={{ background: 'transparent', padding: '0', margin: '20px 0' }}>
                {steps.map((label) => {
                    return (
                        <Step key={uuid()}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    )
                })}

            </Stepper>
            <div style={{ margin: '0 20px', display: 'flex', flex: '1' }}>
                {getStepContent(activeStep)}
            </div>
        </Fragment>
    )
}

export default CreateForm;