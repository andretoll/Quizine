import VisibilitySensor from 'react-visibility-sensor';
import { v4 as uuid } from 'uuid';
import {
    Container,
    List,
    ListItem,
    ListItemText,
    Typography,
    Grow,
} from '@material-ui/core';

const content = [
    {
        "question": "What is Quizine?",
        "answer": "A modern take on the classic quiz game."
    },
    {
        "question": "How do I register?",
        "answer": "You don't. Just jump right in!"
    },
    {
        "question": "How many players can play at the same time?",
        "answer": "8 players."
    },
]

function Faq() {

    return (
        <Container maxWidth="md">
            <VisibilitySensor partialVisibility>
                {({ isVisible }) => (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Grow in={isVisible} timeout={2000}>
                            <div>
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
                            </div>
                        </Grow>
                    </div>
                )}
            </VisibilitySensor>

        </Container>
    )
}

export default Faq;