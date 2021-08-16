import CheckIcon from '@material-ui/icons/CheckCircleOutline';
import Typography from '@material-ui/core/Typography';

function PlayerList(props) {

    const expectedPlayers = props.expectedPlayers;
    const players = props.players;
    const username = props.username;

    return (
        <div style={{ display: 'flex' }}>
            <ul>
                {[...Array(expectedPlayers)].map((_, i) => {
                    return (
                        <li key={i}>
                            <Typography style={{ fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                                Player {i + 1}:
                            </Typography>
                        </li>
                    )
                })}
            </ul>
            <ul style={{ flex: '1', marginLeft: '10px' }}>
                {players.map((player) => {
                    return (
                        <li key={player} style={{ display: 'flex', alignItems: 'center' }}>
                            <CheckIcon style={{ color: 'green', marginRight: '5px' }} />
                            <Typography style={username === player ? { fontWeight: 'bold' } : {}}>
                                {player}
                            </Typography>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default PlayerList;