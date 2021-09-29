import { v4 as uuid } from 'uuid';
import CheckIcon from '@material-ui/icons/CheckCircle';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(_ => ({

    root: {
        display: 'flex',
    },
}));

function PlayerList(props) {

    const classes = useStyles();

    const expectedPlayers = props.expectedPlayers;
    const players = props.players;
    const username = props.username;

    return (
        <div className={classes.root}>
            <ul>
                {[...Array(expectedPlayers)].map((_, i) => {
                    return (
                        <li key={uuid()} style={{ margin: '10px 0' }}>
                            <Typography style={{ textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                                Player {i + 1}:
                            </Typography>
                        </li>
                    )
                })}
            </ul>
            <ul style={{ flex: '1', marginLeft: '10px' }}>
                {players.map((player) => {
                    return (
                        <li key={uuid()} style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
                            <CheckIcon className={username === player ? 'primary-color' : ''} style={{ marginRight: '5px' }} />
                            <Typography className={username === player ? 'primary-color' : ''}>
                                {player}
                            </Typography>
                        </li>
                    )
                })}
                {[...Array(expectedPlayers - players.length)].map(() => {
                    return (
                        <li key={uuid()} style={{ margin: '10px 0' }}>
                            <Typography className="loadingAnimation">Waiting for player</Typography>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default PlayerList;