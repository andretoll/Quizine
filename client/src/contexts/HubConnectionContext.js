import React, { createContext, useState, useContext } from 'react';

export const HubConnectionContext = createContext();

export const ConnectionProvider = ({ children }) => {
    const [connection, setConnection] = useState();

    return <HubConnectionContext.Provider value={{ connection, setConnection }}>
        {children}
    </HubConnectionContext.Provider>
}

export const useConnection = () => useContext(HubConnectionContext)