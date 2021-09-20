import { Link } from 'react-router-dom';
import HomeIcon from '@material-ui/icons/Home';
import {
    Tooltip,
    IconButton
} from '@material-ui/core';

function GoHome(props) {

    return (
        <Tooltip title="Back to start" arrow placement="right">
            <Link to="/start" {...props}>
                <IconButton>
                    <HomeIcon />
                </IconButton>
            </Link>
        </Tooltip>
    )
}

export default GoHome;