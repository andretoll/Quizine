/* 
This is a context that is used to display messages in snackbar components. 
It exposes functions to trigger snackbars. 
*/

import React, { createContext, useState, useContext } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import {
    IconButton,
    Snackbar,
    SnackbarContent,
    Typography
} from '@material-ui/core';

// Snackbar colors
const snackbarTypes = Object.freeze({
    DEFAULT: "",
    ERROR: "#cd5c5c",
    SUCCESS: "#228b22"
})

export const SnackbarContext = createContext();

export const SnackbarProvider = ({ children }) => {

    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState(null);
    const [type, setType] = useState(snackbarTypes.DEFAULT);

    function handleClose(_, reason) {

        console.debug("Closing snackbar...");

        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    }

    function notifySuccess(message) {

        console.debug("Opening success snackbar...");

        setMessage(message);
        setType(snackbarTypes.SUCCESS);
        setOpen(true);
    }

    function notifyError(message) {

        console.debug("Opening error snackbar...");

        setMessage(message);
        setType(snackbarTypes.ERROR);
        setOpen(true);
    }

    return (
        <SnackbarContext.Provider value={{ notifySuccess, notifyError }}>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}
                open={open}
                autoHideDuration={5000}
                onClose={handleClose}
            >
                <SnackbarContent
                    style={{ background: type }}
                    message={
                        <Typography variant="body1" color="textPrimary">{message}</Typography>
                    }
                    action={
                        <IconButton size="small" onClick={handleClose}>
                            <CloseIcon fontSize="medium" />
                        </IconButton>
                    }
                />
            </Snackbar>
            {children}
        </SnackbarContext.Provider>
    )
}

export const useSnackbar = () => useContext(SnackbarContext);