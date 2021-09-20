import { v4 as uuid } from 'uuid';
import {
    Container,
    List,
    ListItem,
    ListItemText,
    Typography
} from '@material-ui/core';

const content = [
    {
        "question": "What is Quizine?",
        "answer": "A Quiz game"
    },
    {
        "question": "How many players can play at the same time?",
        "answer": "8 players"
    },
]

function Faq() {

    return (
        <Container maxWidth="md">
            <Typography variant="h2" align="center">FAQ</Typography>
            <hr />
            <List>
                {content.map((item) => (
                    <ListItem key={uuid()}>
                        <ListItemText
                            primary={item.question}
                            secondary={item.answer}
                            secondaryTypographyProps={{ color: 'primary' }}
                            style={{ textAlign: 'center' }}
                        />
                    </ListItem>
                ))}
            </List>
        </Container>
    )
}

export default Faq;