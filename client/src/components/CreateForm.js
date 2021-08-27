import { useState, Fragment } from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import { useData } from '../services/CreateFormDataContext';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';

const difficulties = [
    "Any",
    "Easy",
    "Medium",
    "Hard",
]

const steps = [
    "General",
    "Questions",
    "Rules"
]

function CreateForm(props) {

    const { data } = useData();

    // Data from parent
    const categories = props.categories;
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
                return <Step3 onNextStep={handleNextStep} rules={rules} />
            case 3:
                return (
                    <div style={{ display: 'flex', flex: '1', alignItems: 'flex-end', justifyContent: 'center' }}>
                        <Button onClick={handleSubmit} variant="contained" size="large" color="primary">Finish</Button>
                    </div>
                )
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