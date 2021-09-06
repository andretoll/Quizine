import QuestionsIcon from '@material-ui/icons/Ballot';
import TimeoutIcon from '@material-ui/icons/Timer';
import RuleIcon from '@material-ui/icons/Casino';
import CategoryIcon from '@material-ui/icons/Category';
import {
    makeStyles,
    useMediaQuery,
    useTheme,
    ImageList,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({

    container: {
        
        '& svg': {
            color: theme.palette.primary.light,
        },
    },
}));

function QuizParametersList(props) {

    const classes = useStyles();

    const questionCount = props.questionCount;
    const questionTimeout = props.questionTimeout;
    const ruleset = props.ruleset;
    const category = props.category;

    const theme = useTheme();
    const multipleColumns = useMediaQuery(theme.breakpoints.up('sm'));

    return (
        <div className={classes.container}>
            <ImageList rowHeight="auto" cols={multipleColumns ? 2 : 0}>
                <ListItem disableGutters style={{ width: '100%' }}>
                    <ListItemIcon>
                        <RuleIcon />
                    </ListItemIcon>
                    <ListItemText primary={ruleset.rule} secondary={ruleset.description} />
                </ListItem>
                <ListItem disableGutters style={{ width: '100%' }}>
                    <ListItemIcon>
                        <CategoryIcon />
                    </ListItemIcon>
                    <ListItemText primary={category} />
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
                    {questionTimeout > 0 ?
                        < ListItemText primary={`${questionTimeout} seconds`} />
                        :
                        <ListItemText primary="Unlimited" />
                    }
                </ListItem>
            </ImageList>
        </div>
    )
}

export default QuizParametersList;