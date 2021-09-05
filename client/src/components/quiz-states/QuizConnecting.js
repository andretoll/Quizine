import {
    Container,
    Paper,
    Typography,
} from '@material-ui/core';

function QuizConnecting() {

    return (

        <Container maxWidth="sm">
            <Paper elevation={10} className="secondary-background">
                <div style={{ padding: '20px' }}>
                    <Typography variant="h6" className="loadingAnimation">Connecting</Typography>
                </div>
            </Paper>
        </Container>
    )
}

export default QuizConnecting;