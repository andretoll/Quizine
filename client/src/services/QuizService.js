export function Connect(connection, sessionId) {
    return connection.send('Connect', sessionId);
}

export function Disconnect(connection) {
    return connection.send('Disconnect');
}

export function Start(connection, sessionId) {
    return connection.send('Start', sessionId);
}

export function SubmitAnswer(connection, sessionId, quizId, answerId) {
    return connection.send('SubmitAnswer', sessionId, quizId, answerId);
}

export function NextQuestion(connection, sessionId) {
    return connection.send('NextQuestion', sessionId);
}

export function GetResults(connection, sessionId) {
    return connection.send('GetResults', sessionId);
}

export function PromptRematch(connection, sessionId, newSessionId) {
    return connection.send('PromptRematch', sessionId, newSessionId);
}

export async function Join(data) {
    return await fetch(`${process.env.REACT_APP_QUIZINE_API_BASE_URL}quiz/join`, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'ApiKey': process.env.REACT_APP_QUIZINE_API_KEY
        }
    });
}

export async function Rematch(data) {
    return await fetch(`${process.env.REACT_APP_QUIZINE_API_BASE_URL}quiz/rematch`, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'ApiKey': process.env.REACT_APP_QUIZINE_API_KEY
        }
    });
}