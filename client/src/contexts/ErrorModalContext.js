/* 
This is a context that is used to display error messages in a modal dialog. 
It exposes a function to open the modal with parameters such as title, message and optional action as well as a function to close the modal. 
*/

import React, { createContext, useState, useContext } from 'react';
import ErrorIcon from '@material-ui/icons/ErrorOutline';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from '@material-ui/core';

const ErrorModalContext = createContext();

export const ErrorModalProvider = ({ children }) => {

    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState(null);
    const [message, setMessage] = useState(null);
    const [actionText, setActionText] = useState(null);
    const [action, setAction] = useState(null);

    function openModal(param) {

        console.debug("Opening error modal...");

        setTitle(param.title);
        setMessage(param.message);
        setActionText(param.actionText);
        setAction(() => param.action);
        setOpen(true);
    }

    function closeModal() {

        console.debug("Closing error modal...");

        setOpen(false);
    }

    function triggerAction() {

        console.debug("Triggering modal action...");

        if (action !== null)
            action();

        closeModal();
    }

    return (
        <ErrorModalContext.Provider value={{ openModal, closeModal }}>
            <Dialog open={open} PaperProps={{ className: 'secondary-background' }}>
                <DialogTitle>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <ErrorIcon style={{ marginRight: '10px' }} color="error" />
                        <Typography variant="h6">{title}</Typography>
                    </div>
                </DialogTitle>
                <DialogContent>
                    <Typography variant='body1'>{message}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={triggerAction} color="primary">{actionText}</Button>
                </DialogActions>
            </Dialog>
            {children}
        </ErrorModalContext.Provider>
    )
}

export const useErrorModal = () => useContext(ErrorModalContext);