import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

function ShareQuiz(params) {

    function getLink() {
        return `${window.location.origin}/join#${params.sessionId}`;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
                <Typography color="primary" style={{ textAlign: 'center', marginRight: '10px' }} variant="h6">Code: <span style={{ textDecoration: 'underline' }}>{params.sessionId}</span></Typography>
                <Button variant="outlined" color="primary" onClick={() => { navigator.clipboard.writeText(params.sessionId) }}>Copy</Button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                <Typography color="primary" style={{ textAlign: 'center', marginRight: '10px' }} variant="h6">Link: <span style={{ textDecoration: 'underline' }}>{getLink()}</span></Typography>
                <Button variant="outlined" color="primary" onClick={() => { navigator.clipboard.writeText(getLink()) }}>Copy</Button>
            </div>
        </div>
    )
}

export default ShareQuiz;