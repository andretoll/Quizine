import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

function GoHome() {

    return (
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', margin: '10px 0' }}>
            <ArrowBackIcon style={{ marginRight: '10px' }} />
            <Typography>Home</Typography>
        </Link>
    )
}

export default GoHome;