import QuestionsIcon from '@material-ui/icons/Ballot';
import TimeoutIcon from '@material-ui/icons/Timer';
import RuleIcon from '@material-ui/icons/Casino';
import CategoryIcon from '@material-ui/icons/Category';
import PlayerCountIcon from '@material-ui/icons/Group';
import TitleIcon from '@material-ui/icons/Create';
import DifficultyIcon from '@material-ui/icons/Stars';
import {
    makeStyles,
    useMediaQuery,
    useTheme,
    ImageList,
    ListItem,
    ListItemIcon,
    ListItemText,
    Tooltip,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({

    container: {
        
        '& svg': {
            color: theme.palette.primary.light,

            '&:hover': {
                color: theme.palette.primary.main,
            },
        },
    },
}));

function TooltipWrapper(props) {
    return (
        <Tooltip
            title={props.title}
            arrow
            enterDelay={0}
            placement="top"
        >
            {props.children}
        </Tooltip>
    )
}

function QuizParametersList(props) {

    const classes = useStyles();

    const title = props.title;
    const playerCount = props.playerCount;
    const questionCount = props.questionCount;
    const questionTimeout = props.questionTimeout;
    const ruleset = props.ruleset;
    const category = props.category;
    const difficulty = props.difficulty;

    const theme = useTheme();
    const multipleColumns = useMediaQuery(theme.breakpoints.up('sm'));

    return (
        <div className={classes.container}>
            <ImageList rowHeight="auto" cols={multipleColumns ? 2 : 0}>
                {ruleset &&
                    <ListItem disableGutters style={{ width: '100%' }}>
                        <ListItemIcon>
                            <TooltipWrapper title="Ruleset">
                                <RuleIcon />
                            </TooltipWrapper>
                        </ListItemIcon>
                        <ListItemText primary={ruleset.rule} secondary={ruleset.description} />
                    </ListItem>
                }
                {category &&
                    <ListItem disableGutters style={{ width: '100%' }}>
                        <ListItemIcon>
                            <TooltipWrapper title="Category">
                                <CategoryIcon />
                            </TooltipWrapper>
                        </ListItemIcon>
                        <ListItemText primary={category} />
                    </ListItem>
                }
                {title &&
                    <ListItem disableGutters>
                        <ListItemIcon>
                            <TooltipWrapper title="Quiz title">
                                <TitleIcon />
                            </TooltipWrapper>
                        </ListItemIcon>
                        <ListItemText primary={title} />
                    </ListItem>
                }
                {playerCount &&
                    <ListItem disableGutters>
                        <ListItemIcon>
                            <TooltipWrapper title="Number of players">
                                <PlayerCountIcon />
                            </TooltipWrapper>
                        </ListItemIcon>
                        <ListItemText primary={`${playerCount} players`} />
                    </ListItem>
                }
                {questionCount &&
                    <ListItem disableGutters>
                        <ListItemIcon>
                            <TooltipWrapper title="Number of questions">
                                <QuestionsIcon />
                            </TooltipWrapper>
                        </ListItemIcon>
                        <ListItemText primary={`${questionCount} questions`} />
                    </ListItem>
                }
                {difficulty &&
                    <ListItem disableGutters>
                        <ListItemIcon>
                            <TooltipWrapper title="Difficulty">
                                <DifficultyIcon />
                            </TooltipWrapper>
                        </ListItemIcon>
                        <ListItemText primary={difficulty} />
                    </ListItem>
                }
                {ruleset?.enableTimeout &&
                    <ListItem disableGutters>
                        <ListItemIcon>
                            <TooltipWrapper title="Time per question">
                                <TimeoutIcon />
                            </TooltipWrapper>
                        </ListItemIcon>
                        {questionTimeout > 0 ?
                            < ListItemText primary={`${questionTimeout} seconds`} />
                            :
                            <ListItemText primary="Unlimited" />
                        }
                    </ListItem>
                }
            </ImageList>
        </div>
    )
}

export default QuizParametersList;