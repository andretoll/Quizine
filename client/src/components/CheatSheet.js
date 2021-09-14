import { Fragment, useEffect, useState } from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
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
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Divider,
} from '@material-ui/core';

function CheatSheet(props) {

    const data = props.data;
    const close = props.onClose;

    const [itemOpen, setItemOpen] = useState("");
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(props.open);
    }, [props.open]);

    function handleClose() {
        close();
    }

    const handleExpanded = (item) => (_, isExpanded) => {
        setItemOpen(isExpanded ? item : "");
    };

    function getQuestion(item) {

        return (
            <Typography variant="body2" color="textPrimary">
                <span>{item.questionIndex}. </span>{item.question}
            </Typography>
        )
    }

    function getAnswer(item) {

        return (
            <Accordion expanded={itemOpen === item.id} className="secondary-background" onChange={handleExpanded(item.id)}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="body2" color="primary">
                        {item.correctAnswer.value}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails style={{padding: '0'}}>
                    <List dense disablePadding style={{ borderLeft: '1px solid' }}>
                        {item.answers.filter(x => x.id !== item.correctAnswer.id).map((answer) => (
                            <Fragment>
                                <ListItem key={answer.id}>
                                    <Typography variant="body2" color="textSecondary">
                                        {answer.value}
                                    </Typography>
                                </ListItem>
                            </Fragment>
                        ))}
                    </List>
                </AccordionDetails>
            </Accordion>
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
                                <ListItemText primary={getQuestion(item)} secondary={getAnswer(item)} />
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