import { Link } from 'react-router-dom';
import HomeIcon from '@material-ui/icons/Home';
import {
    Tooltip,
    IconButton
} from '@material-ui/core';

function GoHome() {

    return (
        <Tooltip title="Go home" arrow placement="right">
            <Link to="/">
                <IconButton>
                    <HomeIcon />
                </IconButton>
            </Link>
        </Tooltip>
    )
}

export default GoHome;