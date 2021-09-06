import QuestionsIcon from '@material-ui/icons/Ballot';
import TimeoutIcon from '@material-ui/icons/Timer';
import RuleIcon from '@material-ui/icons/Casino';
import {
    useMediaQuery,
    useTheme,
    ImageList,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@material-ui/core';

function QuizParametersList(props) {

    const questionCount = props.questionCount;
    const questionTimeout = props.questionTimeout;
    const ruleset = props.ruleset;

    const theme = useTheme();
    const multipleColumns = useMediaQuery(theme.breakpoints.up('sm'));

    return (
        <ImageList rowHeight="auto" cols={multipleColumns ? 2 : 0}>
            <ListItem disableGutters style={{ width: '100%' }}>
                <ListItemIcon>
                    <RuleIcon />
                </ListItemIcon>
                <ListItemText primary={ruleset.rule} secondary={ruleset.description} />
            </ListItem>
            <ListItem disableGutters>
                <ListItemIcon>
                    <QuestionsIcon />
                </ListItemIcon>
                <ListItemText primary={`${questionCount} questions`} />
            </ListItem>
            <ListItem disableGutters>
                <ListItemIcon>
                    <TimeoutIcon />
                </ListItemIcon>
                <ListItemText primary={`${questionTimeout} seconds`} />
            </ListItem>
        </ImageList>
    )
}

export default QuizParametersList;