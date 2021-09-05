import { HubConnectionBuilder, LogLevel, HttpTransportType } from '@microsoft/signalr';
import { Disconnect } from '../services/QuizService';
import React, { createContext, useState, useContext, useEffect } from 'react';

export const HubConnectionContext = createContext();

export const ConnectionProvider = ({ children }) => {
    const [connection, setConnection] = useState(null);

    useEffect(() => {

        console.debug("Creating new connection...");

        const newConnection = new HubConnectionBuilder()
            .withUrl(`${process.env.REACT_APP_QUIZINE_API_BASE_URL}hubs/quiz`, {
                skipNegotiation: true,
                transport: HttpTransportType.WebSockets
            })
            .withAutomaticReconnect([0, 3000, 6000, 9000])
            .configureLogging(LogLevel.Error)
            .build();

        console.debug("Storing new connection...");
        setConnection(newConnection);
    }, []);

    useEffect(() => {

        // Disconnect when unmounting context
        return function cleanup() {

            if (connection && connection.connectionState === "Connected") {
                console.debug("Disconnecting...");
                Disconnect(connection);
            }
        }
    }, [connection]);

    return <HubConnectionContext.Provider value={{ connection }}>
        {children}
    </HubConnectionContext.Provider>
}

export const useConnection = () => useContext(HubConnectionContext)