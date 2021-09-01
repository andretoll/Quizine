import { useEffect, useState } from 'react';
import { HubConnectionBuilder, LogLevel, HttpTransportType } from '@microsoft/signalr';
import { useConnection } from '../../contexts/HubConnectionContext';
import { Connect } from '../../services/QuizService';
import {
    Container,
    Paper,
    Typography,
    Button
} from '@material-ui/core';

function QuizConnecting(props) {

    const sessionId = props.sessionId;
    const username = props.username;

    const [errorMessage, setErrorMessage] = useState();

    const { connection, setConnection } = useConnection();

    useEffect(() => {

        const newConnection = new HubConnectionBuilder()
            .withUrl(`${process.env.REACT_APP_QUIZINE_API_BASE_URL}hubs/quiz`, {
                skipNegotiation: true,
                transport: HttpTransportType.WebSockets
            })
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Critical)
            .build();

        setConnection(newConnection);
    }, [setConnection]);

    useEffect(() => {

        if (connection) {
            start();
        }

        async function start() {

            try {
                setErrorMessage(null);
                await connection.start().then(_ => {
                    Connect(connection, sessionId, username);
                });
            } catch (error) {
                console.log(error);
                setErrorMessage("Error connecting to server.");
            }
        }

    }, [connection, sessionId, username])

    async function reconnect() {

        try {
            setErrorMessage(null);
            await connection.start().then(_ => {
                Connect(connection, sessionId, username);
            });
        } catch (error) {
            console.log(error);
            setErrorMessage("Error connecting to server.");
        }
    }

    return (

        <Container maxWidth="sm">
            <Paper elevation={10} className="secondary-background">
                <div style={{ padding: '20px' }}>
                    {errorMessage ?
                        <div style={{ textAlign: 'center' }}>
                            <Typography variant="overline" color="error">{errorMessage}</Typography>
                            <Button variant="text" onClick={reconnect}>Retry</Button>
                        </div>
                        :
                        <Typography variant="h6" className="loadingAnimation">Connecting</Typography>
                    }
                </div>
            </Paper>
        </Container>
    )
}

export default QuizConnecting;