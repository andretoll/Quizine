/* 
This is a context that is used to initialize and store the SignalR connection object. 
It exposes the connection. 
*/

import React, { createContext, useState, useContext, useEffect } from 'react';
import { HubConnectionBuilder, LogLevel, HttpTransportType } from '@microsoft/signalr';
import { Disconnect } from '../services/QuizService';

export const HubConnectionContext = createContext();

export const ConnectionProvider = ({ children }) => {

    const [connection, setConnection] = useState(null);

    useEffect(() => {

        console.info("Creating new connection...");

        const newConnection = new HubConnectionBuilder()
            .withUrl(`${process.env.REACT_APP_QUIZINE_API_BASE_URL}hubs/quiz`, {
                transport: HttpTransportType.WebSockets
            })
            .withAutomaticReconnect([0, 3000, 6000, 9000])
            .configureLogging(LogLevel.Error)
            .build();

        console.debug("Storing new connection...");
        setConnection(newConnection);

        let wakeLock;

        const requestWakeLock = async () => {
            try {
                console.info("Requesting wakelock...");
                wakeLock = await navigator.wakeLock?.request();
            } catch (error) {
                console.error(`Error while requesting wake lock: ${error.message}`);
            }
        };

        requestWakeLock();

        return () => {
            console.info("Releasing wakelock...");
            wakeLock?.release();
            wakeLock = null;
        }

    }, []);

    useEffect(() => {

        // Disconnect when unmounting context
        return () => {

            if (connection && connection.connectionState === "Connected") {
                console.info("Disconnecting...");
                Disconnect(connection);
                setConnection(null);
            }
        }
    }, [connection]);

    return (
        <HubConnectionContext.Provider value={{ connection }}>
            {children}
        </HubConnectionContext.Provider>
    )
}

export const useConnection = () => useContext(HubConnectionContext);