/* 
This is a context that is used to store data of any object. 
It exposes the data and a function to update the data. 
*/

import React, { createContext, useState, useContext } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {

    const [data, setData] = useState({});

    const setValues = (values) => {

        console.debug("Setting form data...", values);

        setData(prevData => ({
            ...prevData,
            ...values
        }))
    }

    return (
        <DataContext.Provider value={{ data, setValues }}>
            {children}
        </DataContext.Provider>
    )
}

export const useData = () => useContext(DataContext);