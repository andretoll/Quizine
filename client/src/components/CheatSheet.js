import { useEffect, useState } from 'react';
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
            <Accordion expanded={itemOpen === item.id} className="secondary-background" elevation={0} onChange={handleExpanded(item.id)}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="body2" color="primary">
                        {item.correctAnswer.value}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails style={{ padding: '0' }}>
                    <List dense disablePadding>
                        {item.answers.filter(x => x.id !== item.correctAnswer.id).map((answer) => (
                            <ListItem key={answer.id} style={{ padding: '0 10px', margin: '5px 0' }}>
                                <Typography variant="body2" color="textSecondary">
                                    {answer.value}
                                </Typography>
                            </ListItem>
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
                Cheat Sheet
            </DialogTitle>
            <DialogContent dividers>
                <List>
                    {data?.map((item) => (
                        <ListItem key={item.id} style={{ display: 'block' }}>
                            <ListItemText primary={getQuestion(item)} />
                            <div>{getAnswer(item)}</div>
                        </ListItem>
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