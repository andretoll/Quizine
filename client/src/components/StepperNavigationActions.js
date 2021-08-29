import { Button } from '@material-ui/core';

function StepperNavigationActions(props) {

    const previousStep = props.onPreviousStep;
    const nextActionDisabled = props.nextActionDisabled;
    const nextActionText = props.nextActionText;

    return (
        <div>
            <Button variant="text" color="primary" size="large" disabled={!previousStep} onClick={previousStep} style={{marginRight: '10px'}}>
                Previous
            </Button>
            <Button variant="contained" color="primary" type="submit" size="large" disabled={nextActionDisabled}>
                {nextActionText}
            </Button>
        </div>
    )
}

export default StepperNavigationActions;