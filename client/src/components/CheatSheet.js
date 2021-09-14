import { Fragment, useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    List,
    ListItem,
    ListItemText,
    Button,
} from '@material-ui/core';

function CheatSheet(props) {

    const data = props.data;
    const close = props.onClose;

    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(props.open);
    }, [props.open]);

    function handleClose() {
        close();
    }

    function getQuestion(item) {

        return (
            <Typography variant="body2" color="textPrimary">
                <span>{item.questionIndex}. </span>{item.question}
            </Typography>
        )
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{ className: 'secondary-background' }}
        >
            <DialogTitle style={{ textAlign: 'center' }}>
                <Typography variant="h3">Cheat Sheet</Typography>
            </DialogTitle>
            <DialogContent dividers>
                <List>
                    {data?.map((item) => (
                        <Fragment>
                            <ListItem key={item.id}>
                                <ListItemText primary={getQuestion(item)} secondary={item.correctAnswer.value} secondaryTypographyProps={{ color: "primary" }} />
                            </ListItem>
                        </Fragment>
                    ))}
                </List>

            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}

export default CheatSheet;