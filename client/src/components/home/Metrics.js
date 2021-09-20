import { useEffect, useState } from 'react';
import VisibilitySensor from 'react-visibility-sensor';
import CountUp from 'react-countup';
import {
    Container,
    Fade,
    Grid,
    Typography,
} from '@material-ui/core';

function CountUpWrapper(props) {

    return (
        <CountUp
            end={props.value}
            delay={0}
            duration={2}
            preserveValue
        >
            {({ countUpRef }) => (
                <div style={{ textAlign: 'center' }}>
                    <Typography ref={countUpRef} variant="h2" color="primary"></Typography>
                    <Typography variant="h4">{props.suffix}</Typography>
                </div>
            )}
        </CountUp>
    )
}

function Metrics() {

    const [categoryCount, setCategoryCount] = useState(0);
    const [questionCount, setQuestionCount] = useState(0);
    const [pendingQuestionCount, setPendingQuestionCount] = useState(0);

    useEffect(() => {

        fetchMetrics();
    }, []);

    async function fetchMetrics() {

        console.info("Fetching metrics...");

        await fetch("https://opentdb.com/api_count_global.php", {
            method: 'GET',
        }).then(response => {
            response.json().then(result => {

                console.info("Successfully fetched metrics.");
                setCategoryCount(Object.keys(result.categories).length);
                setQuestionCount(result.overall.total_num_of_verified_questions);
                setPendingQuestionCount(result.overall.total_num_of_pending_questions);
            })
        }).catch(error => {
            console.error(error);
        })
    }

    return (
        <Container maxWidth="md">
            <VisibilitySensor partialVisibility>
                {({ isVisible }) => (
                    <div style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {isVisible ?
                            <Fade in timeout={2000}>
                                <Grid container spacing={4}>
                                    <Grid item xs={12} style={{ textAlign: 'center' }}>
                                        <Typography variant="overline">With an ever-growing library...</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <CountUpWrapper
                                            value={categoryCount}
                                            suffix="Categories"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <CountUpWrapper
                                            value={questionCount}
                                            suffix="Questions"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <CountUpWrapper
                                            value={pendingQuestionCount}
                                            suffix="Pending"
                                        />
                                    </Grid>
                                </Grid>
                            </Fade>
                            :
                            null
                        }
                    </div>
                )}
            </VisibilitySensor>
        </Container>
    )
}

export default Metrics;