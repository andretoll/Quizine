import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { HubConnectionBuilder } from '@microsoft/signalr';

function QuizPage() {

    const [connection, setConnection] = useState(null);
    const [players, setPlayers] = useState([]);

    const sessionId = useLocation().state.sessionId;
    const username = useLocation().state.username;

    useEffect(() => {
        const newConnection = new HubConnectionBuilder()
            .withUrl('https://localhost:5001/hubs/quiz')
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(_ => {

                    connection.send('Connect', sessionId, username);

                    connection.on('ConfirmConnect', (response) => {
                        
                        console.log(response);
                        if (response.connected) {
                            setPlayers(response.users);
                        } else {
                            alert(response.errorMessage);
                        }
                    });

                    connection.on('ConfirmDisconnect', (response) => {

                        console.log(response);
                        setPlayers(response.users);
                    });
                })
                .catch(e => console.log('Connection failed: ', e));
        }
    }, [connection, sessionId, username]);

    return (
        <div>
            <div>SessionID: {sessionId}</div>
            <ul>
                {players.map((player) => {
                    return (
                        <li key={player}>{player}</li>
                    )
                })}
            </ul>
        </div>
    )
}

export default QuizPage;