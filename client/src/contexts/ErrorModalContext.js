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
    const [title, setTitle] = useState();
    const [message, setMessage] = useState();
    const [actionText, setActionText] = useState();
    const [action, setAction] = useState();

    function openModal(param) {

        console.trace("Opening error modal...");

        setTitle(param.title);
        setMessage(param.message);
        setActionText(param.actionText);
        setAction(() => param.action);
        setOpen(true);
    }

    function closeModal() {

        console.trace("Closing error modal...");

        setOpen(false);
    }

    function triggerAction() {

        console.trace("Triggering modal action...");

        action();
    }

    return <ErrorModalContext.Provider value={{ openModal, closeModal }}>
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
}

export const useErrorModal = () => useContext(ErrorModalContext)