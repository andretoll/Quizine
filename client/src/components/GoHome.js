import { useHistory } from 'react-router';
import { 
    Tooltip,
    IconButton
} from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';

function GoHome() {

    const history = useHistory();

    return (
        <Tooltip title="Go home" arrow>
            <IconButton onClick={() => { history.push("/") }}>
                <HomeIcon />
            </IconButton>
        </Tooltip>
    )
}

export default GoHome;